import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-semibold transition-colors shadow-none",
  {
    variants: {
      variant: {
        green:
          "bg-emerald-600/10 dark:bg-emerald-600/20 hover:bg-emerald-600/10 text-emerald-500 border-emerald-600/60",
        red: "bg-red-600/10 dark:bg-red-600/20 hover:bg-red-600/10 text-red-500 border-red-600/60",
        orange:
          "bg-orange-600/10 dark:bg-orange-600/20 hover:bg-orange-600/10 text-orange-500 border-orange-600/60",
        blue: "bg-blue-600/10 dark:bg-blue-600/20 hover:bg-blue-600/10 text-blue-500 border-blue-600/60",
        purple:
          "bg-purple-600/10 dark:bg-purple-600/20 hover:bg-purple-600/10 text-purple-500 border-purple-600/60",
        yellow:
          "bg-yellow-600/10 dark:bg-yellow-600/20 hover:bg-yellow-600/10 text-yellow-500 border-yellow-600/60",
        grey: "bg-grey-600/10 dark:bg-grey-600/20 hover:bg-grey-600/10 text-grey-500 border-grey-600/60",
      },
    },
    defaultVariants: {
      variant: "grey",
    },
  },
);

const statusDotVariants = cva("h-1.5 w-1.5 rounded-full mr-2", {
  variants: {
    variant: {
      green: "bg-emerald-500",
      red: "bg-red-500",
      orange: "bg-orange-500",
      blue: "bg-blue-500",
      purple: "bg-purple-500",
      yellow: "bg-yellow-500",
      grey: "bg-black",
    },
  },
  defaultVariants: {
    variant: "grey",
  },
});

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {}

function StatusBadge({ className, variant, ...props }: StatusBadgeProps) {
  return (
    <div className={cn(statusBadgeVariants({ variant }), className)} {...props}>
      <div className={cn(statusDotVariants({ variant }))} />
      {props.children}
    </div>
  );
}

export { StatusBadge, statusBadgeVariants };
