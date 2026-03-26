import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Box } from "lucide-react";
import { LoginForm } from "./_components/form";
import { getTranslations } from "next-intl/server";

export default async function Login() {
  const t = await getTranslations("SCMLoginPage");

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="lg:w-1/2 w-full bg-blue-200 flex-1 flex items-center justify-center order-2 lg:order-1">
        <Card className="w-full max-w-md mx-4 lg:mx-8 shadow-2xl">
          <CardHeader className="space-y-1 p-4 sm:p-6">
            <CardTitle className="text-xl sm:text-2xl font-bold text-center flex items-center justify-center text-blue-500">
              <Box className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
              {t("title")}
            </CardTitle>
            <CardDescription className="text-center text-sm sm:text-base">
              {t("description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
