"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const pillars = [
  {
    id: "academic",
    label: "Academic",
    href: "/dashboard/academic",
    cursorImage:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600&auto=format&fit=crop",
    thumbA:
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=400&auto=format&fit=crop",
    thumbB:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "campus",
    label: "Campus",
    href: "/dashboard/campus",
    cursorImage:
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&auto=format&fit=crop",
    thumbA:
      "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=400&auto=format&fit=crop",
    thumbB:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "community",
    label: "Community",
    href: "/dashboard/community",
    cursorImage:
      "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=600&auto=format&fit=crop",
    thumbA:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=400&auto=format&fit=crop",
    thumbB:
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "services",
    label: "Services",
    href: "/dashboard/services",
    cursorImage:
      "https://images.unsplash.com/photo-1560523159-6b6818a129?q=80&w=600&auto=format&fit=crop",
    thumbA:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=400&auto=format&fit=crop",
    thumbB:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=400&auto=format&fit=crop",
  },
];

export function LandingPillars() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const hoveredPillar = pillars.find((p) => p.id === hoveredId);

  return (
    <section
      className="relative bg-[#FF8157]/[0.06] py-24 md:py-32"
      onMouseMove={handleMouseMove}
    >
      {/* Cursor-following image */}
      <AnimatePresence>
        {isClient && hoveredPillar && (
          <motion.div
            key={hoveredId}
            initial={{ opacity: 0, scale: 0.5, x: mousePos.x, y: mousePos.y }}
            animate={{
              opacity: 1,
              scale: 1,
              x: mousePos.x + 16,
              y: mousePos.y - 16,
              transition: {
                type: "spring",
                stiffness: 150,
                damping: 15,
                mass: 0.1,
              },
            }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className="pointer-events-none fixed z-50 hidden md:block"
            style={{ left: 0, top: 0 }}
          >
            <div className="relative h-36 w-48 overflow-hidden rounded-xl border border-border/40 bg-card shadow-2xl">
              <img
                src={hoveredPillar.cursorImage}
                alt={hoveredPillar.label}
                className="h-full w-full object-cover"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {pillars.map((pillar, i) => (
            <Link
              key={pillar.id}
              href={pillar.href}
              onMouseEnter={() => setHoveredId(pillar.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`group relative flex items-center justify-center gap-4 md:gap-8 p-6 md:p-12 overflow-hidden cursor-pointer border-border/30 ${
                i < 2 ? "md:border-b" : ""
              } ${i % 2 === 0 ? "md:border-r" : ""} transition-colors duration-500 hover:bg-[#FF8157]/[0.10]`}
            >
              {/* Left thumbnail */}
              <div
                className={`hidden md:block w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-500 ease-in-out ${
                  hoveredId
                    ? hoveredId === pillar.id
                      ? "opacity-0 scale-50"
                      : "opacity-30 scale-75"
                    : "opacity-100 scale-100"
                }`}
              >
                <img
                  src={pillar.thumbA}
                  alt={pillar.label}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Label */}
              <span
                className={`font-[family-name:var(--font-serif)] text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight transition-colors duration-500 ${
                  hoveredId === pillar.id
                    ? "text-foreground"
                    : hoveredId
                      ? "text-muted-foreground/30"
                      : "text-foreground/80"
                }`}
              >
                {pillar.label}
              </span>

              {/* Right thumbnail */}
              <div
                className={`hidden md:block w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-500 ease-in-out ${
                  hoveredId
                    ? hoveredId === pillar.id
                      ? "opacity-0 scale-50"
                      : "opacity-30 scale-75"
                    : "opacity-100 scale-100"
                }`}
              >
                <img
                  src={pillar.thumbB}
                  alt={pillar.label}
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
