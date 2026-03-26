import { Layout, LayoutBody } from "@/components/ui/layout";
import React from "react";
import { PasswordChangeForm } from "./_components/password-change-form";

export default function PasswordReset() {
  return (
    <Layout>
      <LayoutBody>
        <div className="max-w-7xl mx-auto">
          <div className="mt-8">
            <PasswordChangeForm />
          </div>
        </div>
      </LayoutBody>
    </Layout>
  );
}
