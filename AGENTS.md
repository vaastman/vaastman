<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This project uses Next.js 16.x, which has breaking changes compared with older versions.
Read the relevant guide in `node_modules/next/dist/docs/` before writing or changing Next.js code.
Heed deprecation notices and prefer current project conventions over remembered defaults.
<!-- END:nextjs-agent-rules -->

# Project Stacks

- Use Bun for everything: installing dependencies, running scripts, and invoking project tooling.
- This repo uses the App Router under `app/`.
- TypeScript is strict and uses the `@/*` path alias.
- Use Biome for formatting and linting via the existing package scripts.

# UI Rules

- When installing or generating UI components, follow the existing `components.json` configuration.
- Preserve the current shadcn setup and alias structure.

## Icons Rules
- Use **Tabler Icons** for all icons.
- Prefer **filled variants** by default.
- keep size-5 in classname for icons

# Command Rules

- Prefer Bun commands such as `bun install`, `bun run dev`, `bun run lint`, and `bun run format`.
- Do not introduce npm, pnpm, or yarn commands unless the user explicitly asks for them.


# Tooling Rules (Package Manager)

- Use Bun for everything: installing dependencies, running scripts, and invoking project tooling.

# Maintainability Rule

- If a file becomes complex, extract helper functions into a `lib/` module instead of keeping all logic inline in the same file.

## React Hook Form + Zod + shadcn UI

Use this pattern for typed, validated forms across projects. This section covers UI form composition only; server actions, database access, and API implementation are outside its scope.

Field UI primitives (`Field`, `FieldLabel`, `FieldContent`, `FieldDescription`, `FieldError`) come from `@/components/ui/field`.

#### `requiredLable` prop on `FieldLabel`

`FieldLabel` has a custom `requiredLable` boolean prop (not from shadcn — added manually). When `true`, it appends a red `*` asterisk after the label text to indicate a required field.

**FieldLabel customization** in `components/ui/field.tsx`:

```tsx
function FieldLabel({
  className,
  requiredLable,
  children,
  ...props
}: React.ComponentProps<typeof Label> & {
  requiredLable?: boolean;
}) {
  return (
    <Label
      data-slot="field-label"
      className={cn(
        "...", // existing classes
        className,
      )}
      {...props}
    >
      <span className="leading-none">{children}</span>
      {requiredLable && <span className="form-required leading-none">*</span>}
    </Label>
  );
}
```

**Companion CSS** in `globals.css`:

```css
/* For aligning the required asterisk properly */
.form-required {
  @apply text-destructive inline-block translate-y-[2px] transform text-[0.95em];
}
```

When setting up a new project, add both the `requiredLable` prop to `FieldLabel` and the `.form-required` class to `globals.css`.

### Recommended form structure

Keep form components colocated inside the route's `_components/` directory. The depth depends on route complexity:

**Simple route** — form files live directly in `_components/`:

```text
app/<route>/
├── _components/
│   ├── main-form.tsx              ← form owner (useForm, Card, submit)
│   ├── <field-group>.tsx          ← grouped fields (e.g. contact-fields.tsx, identity-fields.tsx)
│   └── <helper>.ts               ← field-group-specific helpers
└── lib/
    ├── actions.ts                 ← server actions for this route
    └── zod-type/
        └── <form-name>.ts         ← Zod schema + inferred type
```

**Heavy route** — group by feature name inside `_components/` when the route has multiple forms or modules:

```text
app/<route>/
├── _components/
│   ├── <feature_name>/            ← e.g. personal_candidate/
│   │   ├── main.tsx               ← form owner (useForm, Card, submit)
│   │   ├── <field-group>.tsx      ← e.g. contact-fields.tsx, identity-fields.tsx
│   │   ├── <field-group>.tsx      ← split by logical section to keep files small
│   │   ├── <sub-component>.tsx    ← small UI pieces used by field groups
│   │   └── <helper>.ts           ← field-group-specific helpers (validation, upload, etc.)
│   └── <another_feature>/
│       └── ...
└── lib/
    ├── actions.ts
    └── zod-type/
        └── <form-name>.ts
```



### Zod schema (`lib/zod-type/<form-name>.ts`)

- Define the complete Zod schema.
- Export the schema **and** its inferred TypeScript type.
- Keep validation rules, required fields, enum values, and transformations in the schema.
- Prefer names such as `addEntitySchema` (camelCase) and `AddEntitySchema` (PascalCase type).

```ts
import { z } from "zod";

export const addEntitySchema = z.object({
  id: z.string(),
  name: z.string().trim().min(1, { error: "Name is required" }),
  email: z.string().trim().email({ error: "Valid email is required" }),
  // ...
});

export type AddEntitySchema = z.infer<
  typeof addEntitySchema
>;
```

---

### Main form component (`_components/<feature_name>/main.tsx`)

The main form file owns initialization and submission. Fields are split into child components (e.g. `contact-fields.tsx`, `identity-fields.tsx`) so that no single file grows endlessly as the form gains more fields.

Responsibilities:
- Mark the component with `"use client"` when it uses `useForm`, event handlers, or other client-only hooks.
- Initialize the form with `useForm<FormValues>()`.
- Connect the schema with `zodResolver(formSchema)`.
- Define complete `defaultValues` that match the form type.
- Own `form.handleSubmit(...)`, submission state, and the top-level `<form>` element.
- Wrap the form fields inside a shadcn `Card` (`CardHeader` → `CardTitle`, `CardContent` → fields grid, `CardFooter` → submit button).
- Use `LoadingSwap` inside the submit `Button` to show a spinner during `isPending`.
- Pass the **typed form instance** to child field-group components as a `form` prop.

```tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
import { LoadingSwap } from "@/components/ui/loading-swap";
import {
  type AddEntitySchema,
  addEntitySchema,
} from "../../lib/zod-type/<form-name>";
import { useAddEntity } from "../../query/mut-add-<entity>";
import { ContactFields } from "./contact-fields";
import { IdentityFields } from "./identity-fields";

export function AddEntityForm({
  entityId,
}: {
  entityId: string;
}) {
  const form = useForm<AddEntitySchema>({
    resolver: zodResolver(addEntitySchema),
    defaultValues: {
      id: entityId,
      name: "",
      email: "",
      // ... all fields with matching defaults
    },
  });

  const { mutateAsync: addEntity, isPending } =
    useAddEntity({ entityId });

  const onSubmit = (data: AddEntitySchema) => {
    addEntity(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Card>
        <CardHeader className="gap-2">
          <CardTitle className="max-w-none">
            <h4>Section Title</h4>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <ContactFields form={form} />
            <IdentityFields form={form} />
          </div>
        </CardContent>
        <CardFooter className="justify-center">
          <Button
            disabled={isPending}
            type="submit"
            size="lg"
            className="px-8 text-base"
          >
            <LoadingSwap isLoading={isPending}>
              Save Details
            </LoadingSwap>
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
```

---

### Passing `form` to child field-group components

Child field-group components receive the entire `form` object via a typed prop. Always type it with `UseFormReturn<FormValues>`. Name each child file after the logical group of fields it contains (e.g. `contact-fields.tsx`, `identity-fields.tsx`, `address-fields.tsx`):

```tsx
import { Controller, type UseFormReturn } from "react-hook-form";
import type { AddEntitySchema } from "../../lib/zod-type/<form-name>";

export function ContactFields({
  form,
}: {
  form: UseFormReturn<AddEntitySchema>;
}) {
  return (
    <>
      {/* Controller fields here */}
    </>
  );
}
```

Rules for child field-group components (`_components/<feature_name>/<field-group>.tsx`):
- Keep related fields together in route-level child components.
- Receive `form` through props using `UseFormReturn<FormValues>`.
- Use `Controller` for controlled shadcn inputs, selects, custom controls, and file inputs.
- Connect every controlled field to `form.control` and provide its exact field name.
- Render `fieldState.error` through the shadcn `FieldError` component.
- Set `aria-invalid={fieldState.invalid}` on the input or control.
- Keep field-specific display and interaction logic in the child component, while keeping form initialization in `main.tsx`.
- If a field group has complex sub-components (e.g. upload button, preview dialog), extract them into sibling files within the same feature folder.

---

### shadcn Field composition with Controller

Use the shadcn field primitives consistently inside every `Controller`:

**Simple text input:**

```tsx
<Controller
  control={form.control}
  name="name"
  render={({ field, fieldState }) => (
    <Field>
      <FieldLabel requiredLable>Name</FieldLabel>
      <FieldContent>
        <Input
          {...field}
          aria-invalid={fieldState.invalid}
          placeholder="Enter full name"
        />
        <FieldError errors={[fieldState.error]} />
      </FieldContent>
    </Field>
  )}
/>
```

**NativeSelect (enum field):**

```tsx
const statusOptions = [
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
] as const;

<Controller
  control={form.control}
  name="status"
  render={({ field, fieldState }) => (
    <Field>
      <FieldLabel requiredLable>Status</FieldLabel>
      <FieldContent>
        <NativeSelect
          {...field}
          aria-invalid={fieldState.invalid}
          className="w-full"
        >
          {statusOptions.map((option) => (
            <NativeSelectOption key={option.value} value={option.value}>
              {option.label}
            </NativeSelectOption>
          ))}
        </NativeSelect>
        <FieldError errors={[fieldState.error]} />
      </FieldContent>
    </Field>
  )}
/>
```

**File input with `data-invalid` and `FieldDescription`:**

```tsx
<Controller
  control={form.control}
  name="attachment"
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid || undefined}>
      <FieldLabel requiredLable>Upload File</FieldLabel>
      <FieldContent>
        {/* Custom file input with validation */}
        {!fieldState.error ? (
          <FieldDescription>Choose an image (max 50KB).</FieldDescription>
        ) : null}
        <FieldError errors={[fieldState.error]} />
      </FieldContent>
    </Field>
  )}
/>
```

Field composition rules:
- Use `Field`, `FieldLabel`, `FieldContent`, `FieldDescription`, and `FieldError` instead of creating one-off label and error markup.
- Use the appropriate shadcn control (`Input`, `Textarea`, `Select`, `NativeSelect`, `Checkbox`, `RadioGroup`, or a project-specific control).
- Do not duplicate validation messages in JSX when they already come from Zod.
- Use `field.onChange`, `field.onBlur`, `field.value`, `field.name`, and `field.ref` when integrating custom controls.
- For file inputs, validate the selected file in the field component, use `form.setError` and `form.clearErrors`, and update the form value only after the value is ready.
- Avoid `register` for complex controlled components. Use `register` only for simple native inputs when it fits the existing form pattern.
- Use `data-invalid={fieldState.invalid || undefined}` on the `Field` wrapper when the field needs parent-level invalid styling (common for file inputs and custom controls).
- Show `FieldDescription` conditionally: hide it when there is a `fieldState.error` to avoid visual clutter.

---

### Helper extraction pattern

When a field group has complex logic (file validation, uploads, constants), extract helpers into a sibling `.ts` file in the same feature folder:

```text
_components/<feature_name>/
├── <field-group>.tsx              ← uses the helpers
├── <feature>-helpers.ts           ← constants, validators, async operations
├── <feature>-action-button.tsx    ← small UI sub-component
└── <feature>-preview.tsx          ← small UI sub-component
```

Keep helpers focused:
- Export constants (`ACCEPTED_FILE_TYPES`, `MAX_FILE_SIZE`).
- Export pure validation functions (`isAcceptedFileType`, `isWithinSizeLimit`).
- Export async operations (`uploadFile`).
- Keep types co-located with the helper when they are only used there.

---

### Tailwind CSS and layout rules

- Use Tailwind utility classes for form layout and styling; do not add page-specific CSS files for ordinary form spacing or alignment.
- Use responsive grid or flex layouts for field groups, for example:
  - `grid gap-4`
  - `md:grid-cols-2`
  - `xl:grid-cols-3`
- Keep spacing consistent with `gap-4` for field groups unless the surrounding design requires another spacing scale.
- Prefer shadcn component variants and existing design tokens over custom colors, arbitrary values, or inline styles.
- Use `w-full` for controls that should fill their field container.
- Keep labels and errors in the field wrapper so the layout remains stable when validation messages appear.
- Use `aria-invalid` and state classes rather than styling invalid fields through unrelated parent selectors.
- Use responsive utility classes instead of JavaScript viewport checks.
- Keep class names readable and ordered consistently with the project formatter.
- Extract a reusable component or helper when a Tailwind class list becomes difficult to understand; do not introduce a global CSS rule only to shorten a local class list.
- Use `cn` or the project's existing class-merging helper when classes depend on form state or props.

# Environment Variable Rules

- If you update `.env` or any environment variables, always make sure to update `.env.example` as a reference.

# Feature Route Pattern

- For data-driven routes under `app/`, keep feature code colocated inside the route folder.
- Use `app/<route>/_components/` for route-local UI pieces such as dialogs, forms, tables, and columns.
- Use `app/<route>/lib/actions.ts` for route-local server actions.
- Use `app/<route>/lib/zod-type/` for route-local Zod schemas and form/input types.
- Use `app/<route>/query/` for TanStack Query hooks.
- Prefer route-local imports for feature-specific code instead of moving it into shared folders too early.

## Server Action Conventions

- Route actions should start with `"use server"`.
- Each action should handle auth/session checks inside the action itself.
- For writes, validate incoming payloads with the route-local Zod schema before database access.
- Keep action return shapes consistent:
  - success: `{ success: true, data }`
  - failure: `{ success: false, message }`
- Catch database or action errors and return a readable `message` string for the client layer.

## TanStack Query Conventions

- Use TanStack Query for route data fetching and mutations.
- Put read hooks in `app/<route>/query/use-*.ts`.
- Put mutation hooks in `app/<route>/query/mut-*.ts`.
- Always use array query keys.
- Query hooks should call the server action, check `res.success`, throw `new Error(res.message)` on failure, and return `res.data` on success.
- Unless the route has a clear reason to retry, prefer `retry: false` in route query hooks.
- Route pages or route-local client components should consume the query hook directly and handle `isPending`, `isError`, and `error`.

## Mutation Conventions

- Use `useMutation` together with `useQueryClient` for every create, update, and delete flow.
- Mutation hooks should call the related server action, throw on `!res.success`, and return the successful response.  
- After every successful mutation, invalidate the related query key with `queryClient.invalidateQueries(...)`.
- Invalidation is mandatory for create, update, and delete mutations. Do not skip it.
- Invalidate the exact query key that the list/detail view uses, instead of using broad invalidation when the target key is known.
- Keep success and error feedback close to the mutation hook when that route follows the existing toast-based pattern.

## CRUD Naming Conventions

- Read hooks: `use-get-<entity>.ts`
- Create mutations: `mut-add-<entity>.ts`
- Update mutations: `mut-update-<entity>.ts`
- Delete mutations: `mut-delete-<entity>.ts`
- Keep server action names aligned with the hook names so reads and writes are easy to trace.

# Commit Rules

- Commit only related files together as one logical change set.
- Do not commit everything at once (avoid `git add .`).
- Write clear and concise commit messages.
- Do not push commits unless explicitly requested.

# Adding a New University

To add a new university to the system, follow these steps:

1. **Update the Enum**:
   Open [college.prisma](file:///home/kys/projects/vaastman/prisma/models/college.prisma) and add the new university to the `UniversityName` enum (use uppercase with underscores, e.g. `NEW_UNIVERSITY_NAME`).

2. **Sync the Database Schema and Regenerate Client**:
   Run the following commands in your terminal:
   ```bash
   bun run db:push
   ```
   This command will push the updated schema to the database and regenerate the Prisma client.

> [!NOTE]
> You do **not** need to manually insert the new university record into the database. When you add the first college under this university via the admin UI, the application will automatically create the corresponding `University` record in the database if it doesn't already exist.
