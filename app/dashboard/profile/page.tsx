import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import React from "react";
import { ProfileForm } from "./_components/profile-form";
import { PasswordForm } from "./_components/password-form";
import { redirect } from "next/navigation";
import { Layout, LayoutBody } from "@/components/ui/layout";

export default async function Profile() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/");
  }

  return (
    <Layout>
      <LayoutBody>
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Profile Settings</h1>
            <p className="text-muted-foreground text-sm">
              Manage your personal information and account security settings.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <ProfileForm
              defaultValues={{
                name: session.user.name || "",
                email: session.user.email || "",
              }}
            />

            <PasswordForm />
          </div>
        </div>
      </LayoutBody>
    </Layout>
  );
}
