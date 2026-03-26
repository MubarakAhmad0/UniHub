import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout, LayoutBody } from "@/components/ui/layout";
import { Shield } from "lucide-react";
import Link from "next/link";
import React from "react";

const cards = [
  {
    link: "/admin/users",
    title: "Users Management",
    contentTitle: "Users",
    content: "Manage system users",
  },
  {
    link: "/admin/roles",
    title: "Roles Management",
    contentTitle: "Roles",
    content: "Create and manage user roles",
  },
  {
    link: "/admin/permissions",
    title: "Permissions Management",
    contentTitle: "Permissions",
    content: "Define and assign permissions",
  },
];

export default async function AdminPage() {
  return (
    <Layout>
      <LayoutBody>
        <div className="mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Administration Dashboard</h1>
            <p className="text-muted-foreground text-sm">
              Manage users, roles, and permissions for your application
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {cards.map(({ content, contentTitle, link, title }) => (
              <Link key={link} href={link} className="group">
                <Card className="transition-all hover:shadow-md hover:border-primary/50 cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {title}
                    </CardTitle>
                    <Shield className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{contentTitle}</div>
                    <p className="text-xs text-muted-foreground">{content}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </LayoutBody>
    </Layout>
  );
}
