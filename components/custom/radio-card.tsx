import { cn } from "@/lib/utils";
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import React from "react";

function RadioGroupCard({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn(`max-w-md w-full grid grid-cols-3 gap-3`, className)}
      {...props}
    />
  );
}

function RadioGroupCardItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "ring-[1px] ring-border text-primary dark:bg-input/30 rounded py-1 px-3 data-[state=checked]:ring-2 data-[state=checked]:ring-blue-500",
        className,
      )}
      {...props}
    >
      <span className="font-semibold tracking-tight">{props.children}</span>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroupCard, RadioGroupCardItem };
