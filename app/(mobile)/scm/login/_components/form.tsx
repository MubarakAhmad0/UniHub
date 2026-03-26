"use client";

import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Employee, login } from "../_lib/actions";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@/app/contexts/user";

const loginSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const t = useTranslations("SCMLoginPage");
  const router = useRouter();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [employeeData, setEmployeeData] = useState<Employee | null>(null);
  const { setUser } = useUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      employeeId: "",
    },
  });

  const [currentLocale, setCurrentLocale] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("locale") || "en";
    }
    return "en";
  });

  const handleLocaleChange = useCallback((value: string) => {
    setCurrentLocale(value);
    localStorage.setItem("locale", value);
    document.cookie = `locale=${value};path=/`;
    window.location.reload();
  }, []);

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await login({ employeeId: data.employeeId });

      if (res.error) {
        toast.error("An error occurred. Please try again.");
        return;
      }

      if (!res.data || res.data.length === 0) {
        toast.error("Employee not found!");
        return;
      }

      setEmployeeData(res.data[0]);
      setShowConfirmation(true);
    } catch (err) {
      toast.error("An error occurred. Please try again.");
      console.error(err);
    }
  };

  const handleConfirm = () => {
    if (employeeData) {
      const userData = {
        id: employeeData.id,
        name: employeeData.name,
        employeeId: employeeData.employeeId,
        departmentId: employeeData.departmentId,
        branchId: employeeData.branchId,
      };
      setUser(userData);
      document.cookie = `user=${JSON.stringify(userData)};path=/`;
    }
    setShowConfirmation(false);
    router.push("/scm/stock-transfers");
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Select onValueChange={handleLocaleChange} value={currentLocale}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ms">🇲🇾 Bahasa Melayu</SelectItem>
              <SelectItem value="en">🇬🇧 English</SelectItem>
              <SelectItem value="cn">🇨🇳 Mandarin</SelectItem>
              <SelectItem value="bn">🇧🇩 Bangladeshi</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div>
            <Label htmlFor="employeeId">{t("employeeId")}</Label>
            <Input
              id="employeeId"
              type="text"
              className="text-[16px]"
              {...register("employeeId")}
            />
            {errors.employeeId && (
              <p className="text-sm text-red-500 mt-1">
                {errors.employeeId.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="secondary"
            className="w-full h-10"
            onClick={() => router.push("/")}
          >
            Back to Login
          </Button>
          <Button type="submit" variant="default" className="w-full h-10">
            {t("continueButton")}
          </Button>
        </div>
      </form>

      <Drawer open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DrawerContent>
          <DrawerHeader className="text-center">
            <DrawerTitle>{t("confirmTitle")}</DrawerTitle>
            <DrawerDescription>
              {t("confirmDescription", { name: employeeData?.name || "" })}
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter className="flex flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowConfirmation(false)}
              className="flex-1"
            >
              {t("cancelButton")}
            </Button>
            <Button onClick={handleConfirm} className="flex-1">
              {t("confirmButton")}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
