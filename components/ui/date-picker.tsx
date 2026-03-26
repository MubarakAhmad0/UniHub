"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";

export interface QuickSelectOption {
  label: string;
  value: string;
  daysToAdd: number;
}

export interface DatePickerProps {
  // Mode: single date or range
  mode?: "single" | "range";
  // Single-date props
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  // Range props
  valueRange?: { from?: Date; to?: Date };
  onRangeChange?: (range: { from?: Date; to?: Date } | undefined) => void;
  // Common props
  dateFormat?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  quickSelectOptions?: QuickSelectOption[];
  showQuickSelect?: boolean;
  buttonVariant?: "default" | "outline" | "secondary" | "ghost";
}

const DEFAULT_QUICK_SELECT_OPTIONS: QuickSelectOption[] = [
  { label: "Today", value: "0", daysToAdd: 0 },
  { label: "Tomorrow", value: "1", daysToAdd: 1 },
  { label: "In 2 days", value: "2", daysToAdd: 2 },
];

export function DatePicker({
  mode = "single",
  value,
  onChange,
  valueRange,
  onRangeChange,
  dateFormat = "dd-MM-yyyy",
  placeholder = "Pick a date",
  className,
  disabled = false,
  quickSelectOptions = DEFAULT_QUICK_SELECT_OPTIONS,
  showQuickSelect = true,
  buttonVariant = "outline",
}: DatePickerProps) {
  const [internalDate, setInternalDate] = React.useState<Date | undefined>(
    value,
  );
  const [internalRange, setInternalRange] = React.useState<
    { from?: Date; to?: Date } | undefined
  >(valueRange);

  const selectedDate = value !== undefined ? value : internalDate;
  const selectedRange = valueRange !== undefined ? valueRange : internalRange;

  const handleDateChange = React.useCallback(
    (newDate: Date | undefined) => {
      if (value === undefined) {
        setInternalDate(newDate);
      }
      onChange?.(newDate);
    },
    [onChange, value],
  );

  const handleRangeChange = React.useCallback(
    (newRange: { from?: Date; to?: Date } | undefined) => {
      if (valueRange === undefined) {
        setInternalRange(newRange);
      }
      onRangeChange?.(newRange);
    },
    [onRangeChange, valueRange],
  );

  const handleQuickSelect = React.useCallback(
    (quickSelectValue: string) => {
      const newDate = addDays(new Date(), parseInt(quickSelectValue));
      if (mode === "range") {
        handleRangeChange({ from: newDate, to: newDate });
      } else {
        handleDateChange(newDate);
      }
    },
    [handleDateChange, handleRangeChange, mode],
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={buttonVariant}
          className={cn(
            "justify-start text-left font-normal",
            mode === "single"
              ? !selectedDate && "text-muted-foreground"
              : !selectedRange?.from &&
                  !selectedRange?.to &&
                  "text-muted-foreground",
            disabled && "opacity-50 cursor-not-allowed",
            className,
          )}
          size="sm"
          disabled={disabled}
        >
          <CalendarIcon className="mr-1 h-3 w-3" />
          {mode === "single" ? (
            selectedDate ? (
              format(selectedDate, dateFormat)
            ) : (
              <span>{placeholder}</span>
            )
          ) : selectedRange?.from ? (
            selectedRange.to ? (
              `${format(selectedRange.from, dateFormat)} - ${format(selectedRange.to, dateFormat)}`
            ) : (
              `${format(selectedRange.from, dateFormat)} - ...`
            )
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
        {showQuickSelect && (
          <Select onValueChange={handleQuickSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Quick select" />
            </SelectTrigger>
            <SelectContent position="popper">
              {quickSelectOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <div className="rounded-md border">
          {mode === "single" ? (
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateChange}
              disabled={disabled}
            />
          ) : (
            <Calendar
              mode="range"
              selected={selectedRange as any}
              onSelect={handleRangeChange as any}
              disabled={disabled}
              numberOfMonths={2}
            />
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
