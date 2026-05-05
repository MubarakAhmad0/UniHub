"use client";

import { useState } from "react";

// --- Data for the image accordion ---
const accordionItems = [
  {
    id: 1,
    title: "Academic",
    imageUrl:
      "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=2090&q=80",
  },
  {
    id: 2,
    title: "Campus Life",
    imageUrl:
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Community",
    imageUrl:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1974&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Services",
    imageUrl:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2090&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "Announcements",
    imageUrl:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2090&auto=format&fit=crop",
  },
];

// --- Accordion Item Component ---
const AccordionItem = ({
  item,
  isActive,
  onMouseEnter,
}: {
  item: (typeof accordionItems)[number];
  isActive: boolean;
  onMouseEnter: () => void;
}) => {
  return (
    <div
      className={`relative h-[520px] rounded-2xl overflow-hidden cursor-pointer transition-all duration-700 ease-in-out ${isActive ? "w-[460px]" : "w-[70px]"}`}
      onMouseEnter={onMouseEnter}
    >
      {/* Background Image */}
      <img
        src={item.imageUrl}
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src =
            "https://placehold.co/400x450/2d3748/ffffff?text=Image+Error";
        }}
      />
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      {/* Caption Text */}
      <span
        className={`absolute text-white text-lg font-semibold whitespace-nowrap transition-all duration-300 ease-in-out ${
          isActive
            ? "bottom-6 left-1/2 -translate-x-1/2 rotate-0"
            : "w-auto text-left bottom-24 left-1/2 -translate-x-1/2 rotate-90"
        }`}
      >
        {item.title}
      </span>
    </div>
  );
};

// --- Main Component ---
export function InteractiveImageAccordion() {
  const [activeIndex, setActiveIndex] = useState(4);

  return (
    <div className="flex flex-row items-center justify-center gap-4 overflow-x-auto p-4">
      {accordionItems.map((item, index) => (
        <AccordionItem
          key={item.id}
          item={item}
          isActive={index === activeIndex}
          onMouseEnter={() => setActiveIndex(index)}
        />
      ))}
    </div>
  );
}
