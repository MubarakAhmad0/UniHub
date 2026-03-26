import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const AuthError = () => (
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
          You do not have permission to view this page or perform this action.
          Please contact the administrator if you believe this is an error.
          adasd
        </p>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button asChild>
          <Link href="/dashboard">Go to Homepage</Link>
        </Button>
      </CardFooter>
    </Card>
  </div>
);
