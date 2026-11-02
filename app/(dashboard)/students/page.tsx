import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { auth } from "@/lib/auth";
import { StudentsClient } from "./_components/students-client";

export default async function StudentsPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/signin");
  }

  return (
    <ContentLayout title="Students">
      <StudentsClient />
    </ContentLayout>
  );
}
