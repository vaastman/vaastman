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

### Recommended form structure

Keep the main form component at the route level, not in a global shared components directory:

```text
app/<route>/
├── components/
│   ├── main.tsx
│   ├── <first-field-group>.tsx
│   └── <second-field-group>.tsx
└── lib/
    └── zod-type/
        └── <form-name>.ts
```

- `lib/zod-type/<form-name>.ts`
  - Define the complete Zod schema.
  - Export the schema and its inferred TypeScript type.
  - Keep validation rules, required fields, enum values, and transformations in the schema.
  - Prefer names such as `addCandidatePersonalSchema` and `AddCandidatePersonalSchema`.

- `components/main.tsx`
  - Mark the component with `"use client"` when it uses `useForm`, event handlers, or other client-only hooks.
  - Initialize the form with `useForm<FormValues>()`.
  - Connect the schema with `zodResolver(formSchema)`.
  - Define complete `defaultValues` that match the form type.
  - Own `form.handleSubmit(...)`, submission state, and the top-level `<form>` element.
  - Pass the typed form instance to child components:

    ```tsx
    import type { UseFormReturn } from "react-hook-form";

    type FormValues = z.infer<typeof formSchema>;

    function MainForm() {
      const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          name: "",
        },
      });

      return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup form={form} />
        </form>
      );
    }

    function FieldGroup({
      form,
    }: {
      form: UseFormReturn<FormValues>;
    }) {
      return <div>{/* fields */}</div>;
    }
    ```

- `components/<field-group>.tsx`
  - Keep related fields together in route-level child components.
  - Receive `form` through props using `UseFormReturn<FormValues>`.
  - Use `Controller` for controlled shadcn inputs, selects, custom controls, and file inputs.
  - Connect every controlled field to `form.control` and provide its exact field name.
  - Render `fieldState.error` through the shadcn `FieldError` component.
  - Set `aria-invalid={fieldState.invalid}` on the input or control.
  - Keep field-specific display and interaction logic in the child component, while keeping form initialization in `components/main.tsx`.

### shadcn field composition

Use the shadcn field primitives consistently:

```tsx
<Controller
  control={form.control}
  name="name"
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid || undefined}>
      <FieldLabel requiredLable>Name</FieldLabel>
      <FieldContent>
        <Input
          {...field}
          aria-invalid={fieldState.invalid}
          placeholder="Enter name"
        />
        <FieldError errors={[fieldState.error]} />
      </FieldContent>
    </Field>
  )}
/>
```

- Use `Field`, `FieldLabel`, `FieldContent`, `FieldDescription`, and `FieldError` instead of creating one-off label and error markup.
- Use the appropriate shadcn control (`Input`, `Textarea`, `Select`, `NativeSelect`, `Checkbox`, `RadioGroup`, or a project-specific control).
- Do not duplicate validation messages in JSX when they already come from Zod.
- Use `field.onChange`, `field.onBlur`, `field.value`, `field.name`, and `field.ref` when integrating custom controls.
- For file inputs, validate the selected file in the field component, use `form.setError` and `form.clearErrors`, and update the form value only after the value is ready.
- Avoid `register` for complex controlled components. Use `register` only for simple native inputs when it fits the existing form pattern.

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
