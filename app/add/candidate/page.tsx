import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StartFormButton } from "./_components/start-form-button";

export default function Page() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-2xl flex-col justify-center gap-8 px-4 py-12 sm:px-6">
      <header className="text-center">
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          Vaastman Solutions
        </h1>
      </header>

      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Candidate Registration</CardTitle>
          <CardDescription>
            Fill in your personal and education details to complete your
            registration.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          Have your contact, profile, and education information ready before you
          begin.
        </CardContent>
        <CardFooter className="justify-center">
          <StartFormButton />
        </CardFooter>
      </Card>
    </main>
  );
}
