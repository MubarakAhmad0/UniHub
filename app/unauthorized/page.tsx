import Link from "next/link";
import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Unauthorized Access
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <AlertCircle className="h-24 w-24 text-destructive" />
          </div>
          <p className="text-center text-muted-foreground">
            Sorry, you don&apos;t have permission to access this page. Please
            check your credentials or contact the administrator if you believe
            this is an error.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/">Return to Login</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
