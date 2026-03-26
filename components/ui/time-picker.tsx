"use client";

import React from "react";
import { Clock } from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TimePickerProps {
  value?: Date;
  onChange?: (time: Date) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function TimePicker({
  value,
  onChange,
  className,
  placeholder = "Select time",
  disabled,
}: TimePickerProps) {
  function handleTimeChange(
    type: "hour" | "minute" | "ampm",
    newValue: string,
  ) {
    if (!onChange) return;

    const currentTime = value || new Date();
    const newTime = new Date(currentTime);

    if (type === "hour") {
      const hour = parseInt(newValue, 10);
      const isCurrentlyPM = newTime.getHours() >= 12;
      newTime.setHours(isCurrentlyPM ? hour + 12 : hour);
    } else if (type === "minute") {
      newTime.setMinutes(parseInt(newValue, 10));
    } else if (type === "ampm") {
      const hours = newTime.getHours();
      if (newValue === "AM" && hours >= 12) {
        newTime.setHours(hours - 12);
      } else if (newValue === "PM" && hours < 12) {
        newTime.setHours(hours + 12);
      }
    }

    onChange(newTime);
  }

  return (
    <div className={className}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground",
            )}
            disabled={disabled}
          >
            <Clock className="mr-2 h-4 w-4" />
            {value ? format(value, "hh:mm aa") : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex divide-x">
            <ScrollArea className="w-16">
              <div className="flex flex-col p-2">
                {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                  <Button
                    key={hour}
                    size="sm"
                    variant={
                      value && (value.getHours() % 12 || 12) === hour
                        ? "default"
                        : "ghost"
                    }
                    className="w-full justify-center"
                    onClick={() => handleTimeChange("hour", hour.toString())}
                  >
                    {hour}
                  </Button>
                ))}
              </div>
            </ScrollArea>
            <ScrollArea className="w-16">
              <div className="flex flex-col p-2">
                {Array.from({ length: 4 }, (_, i) => i * 15).map((minute) => (
                  <Button
                    key={minute}
                    size="sm"
                    variant={
                      value && value.getMinutes() === minute
                        ? "default"
                        : "ghost"
                    }
                    className="w-full justify-center"
                    onClick={() =>
                      handleTimeChange("minute", minute.toString())
                    }
                  >
                    {minute.toString().padStart(2, "0")}
                  </Button>
                ))}
              </div>
            </ScrollArea>
            <ScrollArea className="w-16">
              <div className="flex flex-col p-2">
                {["AM", "PM"].map((ampm) => (
                  <Button
                    key={ampm}
                    size="sm"
                    variant={
                      value &&
                      ((ampm === "AM" && value.getHours() < 12) ||
                        (ampm === "PM" && value.getHours() >= 12))
                        ? "default"
                        : "ghost"
                    }
                    className="w-full justify-center"
                    onClick={() => handleTimeChange("ampm", ampm)}
                  >
                    {ampm}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
