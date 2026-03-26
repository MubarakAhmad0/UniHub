"use client";

import { CalendarIcon, XCircle } from "lucide-react";
import * as React from "react";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

export function formatDate(
  date: Date | string | number | undefined,
  opts: Intl.DateTimeFormatOptions = {},
) {
  if (!date) return "";

  try {
    return new Intl.DateTimeFormat("en-US", {
      month: opts.month ?? "long",
      day: opts.day ?? "numeric",
      year: opts.year ?? "numeric",
      ...opts,
    }).format(new Date(date));
  } catch (_err) {
    return "";
  }
}

interface StandaloneDateRangePickerProps {
  value?: DateRange;
  onChange?: (dateRange: DateRange | undefined) => void;
  title?: string;
  placeholder?: string;
  className?: string;
}

export function StandaloneDateRangePicker({
  value,
  onChange,
  title = "Date Range",
  placeholder = "Select date range",
  className,
}: StandaloneDateRangePickerProps) {
  const selectedDates = React.useMemo<DateRange>(() => {
    return value || { from: undefined, to: undefined };
  }, [value]);

  const onSelect = React.useCallback(
    (date: DateRange | undefined) => {
      onChange?.(date);
    },
    [onChange],
  );

  const onReset = React.useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      onChange?.(undefined);
    },
    [onChange],
  );

  const hasValue = React.useMemo(() => {
    return selectedDates.from || selectedDates.to;
  }, [selectedDates]);

  const formatDateRange = React.useCallback((range: DateRange) => {
    if (!range.from && !range.to) return "";
    if (range.from && range.to) {
      return `${formatDate(range.from)} - ${formatDate(range.to)}`;
    }
    return formatDate(range.from ?? range.to);
  }, []);

  const label = React.useMemo(() => {
    const hasSelectedDates = selectedDates.from || selectedDates.to;
    const dateText = hasSelectedDates
      ? formatDateRange(selectedDates)
      : placeholder;

    return (
      <span className="flex items-center gap-2">
        <span>{title}</span>
        {hasSelectedDates && (
          <>
            <Separator
              orientation="vertical"
              className="mx-0.5 data-[orientation=vertical]:h-4"
            />
            <span>{dateText}</span>
          </>
        )}
      </span>
    );
  }, [selectedDates, formatDateRange, title, placeholder]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`border-dashed ${className || ""}`}
        >
          {hasValue ? (
            <div
              role="button"
              aria-label={`Clear ${title} filter`}
              tabIndex={0}
              onClick={onReset}
              className="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <XCircle />
            </div>
          ) : (
            <CalendarIcon />
          )}
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          captionLayout="dropdown"
          mode="range"
          selected={selectedDates}
          onSelect={onSelect}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
}
