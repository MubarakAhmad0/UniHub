"use client";

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { cn } from "@/lib/utils";
import React from "react";

const Collapsible = CollapsiblePrimitive.Root;

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;

const CollapsibleContent = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.CollapsibleContent>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.CollapsibleContent>
>(({ className, ...props }, ref) => (
  <CollapsiblePrimitive.CollapsibleContent
    ref={ref}
    className={cn(
      "overflow-hidden",
      "data-[state=open]:animate-[collapsible-down_200ms_ease-out]",
      "data-[state=closed]:animate-[collapsible-up_200ms_ease-out]",
      className,
    )}
    {...props}
  />
));
CollapsibleContent.displayName = "CollapsibleContent";

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
