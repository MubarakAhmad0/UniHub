"use client";

import { useMemo } from "react";
import { useLocalStorage } from "usehooks-ts";

type NavItem = {
  title: string;
  isActive?: boolean;
};

export function useNavOpenItems(navType: string, items: NavItem[]) {
  const defaultOpenItems = useMemo(
    () =>
      items
        .filter((item) => item.isActive)
        .map((item) => `${navType}-${item.title}`),
    [items, navType],
  );

  const [openNavItems, setOpenNavItems] = useLocalStorage<string[]>(
    "navigation-open-items",
    defaultOpenItems,
    { initializeWithValue: false },
  );

  const handleOpenChange = (itemTitle: string, isOpen: boolean) => {
    const navKey = `${navType}-${itemTitle}`;
    setOpenNavItems((previous) => {
      const withoutCurrent = previous.filter((key) => key !== navKey);
      return isOpen ? [...withoutCurrent, navKey] : withoutCurrent;
    });
  };

  const isItemOpen = (itemTitle: string) =>
    openNavItems.includes(`${navType}-${itemTitle}`);

  return {
    openNavItems,
    handleOpenChange,
    isItemOpen,
  } as const;
}
