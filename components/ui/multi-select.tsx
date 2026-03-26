import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Search } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

type Option = { label: string; value: string };

interface ISelectProps {
  placeholder: string;
  options: Option[];
  selectedOptions: string[];
  setSelectedOptions: Dispatch<SetStateAction<string[]>>;
}

const ITEM_HEIGHT = 48;
const VISIBLE_ITEMS = 8;

const MultiSelect = ({
  placeholder,
  options: values,
  selectedOptions: selectedItems,
  setSelectedOptions: setSelectedItems,
}: ISelectProps) => {
  const [search, setSearch] = useState("");
  const [scrollTop, setScrollTop] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // Filter options based on search
  const filteredOptions = values.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase()),
  );

  // Get selected items' labels
  const selectedLabels = values
    .filter((option) => selectedItems.includes(option.value))
    .map((option) => option.label);

  // Calculate which items to render based on scroll position
  const startIndex = Math.floor(scrollTop / ITEM_HEIGHT);
  const endIndex = Math.min(startIndex + VISIBLE_ITEMS, filteredOptions.length);

  const visibleOptions = filteredOptions.slice(startIndex, endIndex);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const handleSelectChange = (value: string) => {
    if (!selectedItems.includes(value)) {
      setSelectedItems((prev) => [...prev, value]);
    } else {
      setSelectedItems((prev) => prev.filter((item) => item !== value));
    }
  };

  const isOptionSelected = (value: string): boolean => {
    return selectedItems.includes(value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setScrollTop(0);
  };

  return (
    <div className="relative w-full">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild className="w-full">
          <Button
            variant="outline"
            className="w-full flex items-center justify-between h-auto min-h-10 whitespace-normal py-2"
          >
            <div className="text-left break-words">
              {selectedLabels.length > 0
                ? selectedLabels.join(", ")
                : placeholder}
            </div>
            <ChevronDown className="h-4 w-4 opacity-50 flex-shrink-0 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[350px] p-0"
          onCloseAutoFocus={(e) => e.preventDefault()}
          side="bottom"
          align="start"
          sideOffset={5}
        >
          <div className="sticky top-0 z-50 bg-background border-b">
            <div className="p-2">
              <div className="flex items-center px-2 py-1 border rounded-md">
                <Search className="w-4 h-4 mr-2 opacity-50" />
                <input
                  type="text"
                  className="w-full bg-transparent outline-none"
                  placeholder="Search..."
                  value={search}
                  onClick={(e) => e.stopPropagation()}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
          </div>

          <div
            className="overflow-auto"
            style={{
              height: `${Math.min(filteredOptions.length, VISIBLE_ITEMS) * ITEM_HEIGHT}px`,
              maxHeight: "300px",
            }}
            onScroll={handleScroll}
          >
            <div
              style={{
                height: `${filteredOptions.length * ITEM_HEIGHT}px`,
                position: "relative",
              }}
            >
              {visibleOptions.map((option, index) => (
                <div
                  key={option.value}
                  style={{
                    position: "absolute",
                    top: `${(startIndex + index) * ITEM_HEIGHT}px`,
                    height: ITEM_HEIGHT,
                    width: "100%",
                  }}
                  className={`flex items-center px-2 cursor-pointer hover:bg-gray-100 py-1
                    ${isOptionSelected(option.value) ? "bg-gray-50" : ""}`}
                  onClick={() => handleSelectChange(option.value)}
                >
                  <div className="flex items-start py-1">
                    <input
                      type="checkbox"
                      className="mr-2 mt-1"
                      checked={isOptionSelected(option.value)}
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => {}}
                    />
                    <span className="break-words text-sm leading-5">
                      {option.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default MultiSelect;
