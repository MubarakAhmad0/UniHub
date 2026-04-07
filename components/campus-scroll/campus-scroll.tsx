"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useMediaQuery } from "@/hooks/use-media-query";
import { FeatureCard } from "./feature-card";
import { HeroOverlay } from "./hero-overlay";
import { LoadingSpinner } from "./loading-spinner";

// ─── Configuration ────────────────────────────────────────────────
const TOTAL_FRAMES = 192;
const SCROLL_HEIGHT = "800vh";

const IMAGE_PATHS: string[] = Array.from(
  { length: TOTAL_FRAMES },
  (_, i) => `/Image sequence/${String(i + 1).padStart(5, "0")}.jpg`,
);

// ─── Feature card beat definitions ────────────────────────────────
interface CardBeat {
  id: string;
  start: number;
  end: number;
  align: "left" | "right" | "center";
  title: string;
  description: string;
  mockupType:
    | "schedule"
    | "forum"
    | "clubs"
    | "map"
    | "documents"
    | "hero"
    | "none";
}

const CARD_BEATS: CardBeat[] = [
  {
    id: "hero",
    start: 0.0,
    end: 0.1,
    align: "center",
    title: "Your Campus.",
    description: "Your Hub.",
    mockupType: "hero",
  },
  {
    id: "academics",
    start: 0.15,
    end: 0.28,
    align: "left",
    title: "Academics & Classes",
    description: "Your schedule, grades, and coursework in one unified view.",
    mockupType: "schedule",
  },
  {
    id: "forums",
    start: 0.32,
    end: 0.43,
    align: "right",
    title: "Student Forums",
    description: "Connect, debate, and share with your campus community.",
    mockupType: "forum",
  },
  {
    id: "clubs",
    start: 0.47,
    end: 0.58,
    align: "left",
    title: "Clubs & Societies",
    description: "Discover and join organizations that fit your passions.",
    mockupType: "clubs",
  },
  {
    id: "maps",
    start: 0.62,
    end: 0.73,
    align: "right",
    title: "Campus Maps",
    description: "Never get lost. Live navigation to your next lecture.",
    mockupType: "map",
  },
  {
    id: "documents",
    start: 0.77,
    end: 0.88,
    align: "left",
    title: "Admin & Paperwork",
    description: "Submit forms, requests, and documents instantly.",
    mockupType: "documents",
  },
];

// ─── Per-beat transform hook — called at the top level ───────────
function useCardTransforms(
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"],
) {
  // Each beat needs two transforms (opacity + y). Because hooks must be called
  // unconditionally at the top level we call them once per beat here — the
  // number of beats is a compile-time constant so the hook count is stable.
  const beat0 = CARD_BEATS[0];
  const beat1 = CARD_BEATS[1];
  const beat2 = CARD_BEATS[2];
  const beat3 = CARD_BEATS[3];
  const beat4 = CARD_BEATS[4];
  const beat5 = CARD_BEATS[5];

  const makeTransform = (beat: CardBeat) => {
    const fadeInStart = beat.start;
    const fadeInEnd = beat.start + 0.03;
    const fadeOutStart = beat.end - 0.03;
    const fadeOutEnd = beat.end;
    return { fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd };
  };

  const t0 = makeTransform(beat0);
  const t1 = makeTransform(beat1);
  const t2 = makeTransform(beat2);
  const t3 = makeTransform(beat3);
  const t4 = makeTransform(beat4);
  const t5 = makeTransform(beat5);

  const opacity0 = useTransform(
    scrollYProgress,
    [t0.fadeInStart, t0.fadeInEnd, t0.fadeOutStart, t0.fadeOutEnd],
    [0, 1, 1, 0],
  );
  const y0 = useTransform(
    scrollYProgress,
    [t0.fadeInStart, t0.fadeInEnd, t0.fadeOutStart, t0.fadeOutEnd],
    [30, 0, 0, -30],
  );
  const opacity1 = useTransform(
    scrollYProgress,
    [t1.fadeInStart, t1.fadeInEnd, t1.fadeOutStart, t1.fadeOutEnd],
    [0, 1, 1, 0],
  );
  const y1 = useTransform(
    scrollYProgress,
    [t1.fadeInStart, t1.fadeInEnd, t1.fadeOutStart, t1.fadeOutEnd],
    [30, 0, 0, -30],
  );
  const opacity2 = useTransform(
    scrollYProgress,
    [t2.fadeInStart, t2.fadeInEnd, t2.fadeOutStart, t2.fadeOutEnd],
    [0, 1, 1, 0],
  );
  const y2 = useTransform(
    scrollYProgress,
    [t2.fadeInStart, t2.fadeInEnd, t2.fadeOutStart, t2.fadeOutEnd],
    [30, 0, 0, -30],
  );
  const opacity3 = useTransform(
    scrollYProgress,
    [t3.fadeInStart, t3.fadeInEnd, t3.fadeOutStart, t3.fadeOutEnd],
    [0, 1, 1, 0],
  );
  const y3 = useTransform(
    scrollYProgress,
    [t3.fadeInStart, t3.fadeInEnd, t3.fadeOutStart, t3.fadeOutEnd],
    [30, 0, 0, -30],
  );
  const opacity4 = useTransform(
    scrollYProgress,
    [t4.fadeInStart, t4.fadeInEnd, t4.fadeOutStart, t4.fadeOutEnd],
    [0, 1, 1, 0],
  );
  const y4 = useTransform(
    scrollYProgress,
    [t4.fadeInStart, t4.fadeInEnd, t4.fadeOutStart, t4.fadeOutEnd],
    [30, 0, 0, -30],
  );
  const opacity5 = useTransform(
    scrollYProgress,
    [t5.fadeInStart, t5.fadeInEnd, t5.fadeOutStart, t5.fadeOutEnd],
    [0, 1, 1, 0],
  );
  const y5 = useTransform(
    scrollYProgress,
    [t5.fadeInStart, t5.fadeInEnd, t5.fadeOutStart, t5.fadeOutEnd],
    [30, 0, 0, -30],
  );

  return [
    { ...beat0, opacity: opacity0, y: y0 },
    { ...beat1, opacity: opacity1, y: y1 },
    { ...beat2, opacity: opacity2, y: y2 },
    { ...beat3, opacity: opacity3, y: y3 },
    { ...beat4, opacity: opacity4, y: y4 },
    { ...beat5, opacity: opacity5, y: y5 },
  ];
}

// ─── Main Component ───────────────────────────────────────────────
export function CampusScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const canvasOpacity = useTransform(scrollYProgress, [0.85, 0.97], [1, 0]);

  // All card transforms — hooks called unconditionally at top level
  const cardTransforms = useCardTransforms(scrollYProgress);

  // Preload all images
  useEffect(() => {
    let cancelled = false;
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    IMAGE_PATHS.forEach((src, index) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        if (!cancelled) {
          setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
          if (loadedCount === TOTAL_FRAMES) setLoaded(true);
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (!cancelled && loadedCount === TOTAL_FRAMES) setLoaded(true);
      };
      images[index] = img;
    });

    imagesRef.current = images;
    return () => {
      cancelled = true;
    };
  }, []);

  // Canvas draw logic
  const currentFrameIndex = useTransform(
    scrollYProgress,
    [0, 1],
    [0, TOTAL_FRAMES - 1],
  );

  const frameIndexRef = useRef(0);

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imagesRef.current[index];
    if (!img || !img.complete || !img.naturalWidth) return;

    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    }

    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = width / height;

    let drawWidth: number, drawHeight: number, drawX: number, drawY: number;

    if (imgRatio > canvasRatio) {
      drawHeight = height;
      drawWidth = height * imgRatio;
      drawX = (width - drawWidth) / 2;
      drawY = 0;
    } else {
      drawWidth = width;
      drawHeight = width / imgRatio;
      drawX = 0;
      drawY = (height - drawHeight) / 2;
    }

    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
  }, []);

  useEffect(() => {
    return currentFrameIndex.on("change", (latest) => {
      const index = Math.min(Math.max(Math.round(latest), 0), TOTAL_FRAMES - 1);
      frameIndexRef.current = index;
      drawFrame(index);
    });
  }, [currentFrameIndex, drawFrame]);

  useEffect(() => {
    const handleResize = () => drawFrame(frameIndexRef.current);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [drawFrame]);

  if (!loaded) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <LoadingSpinner progress={loadProgress} />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{ height: SCROLL_HEIGHT }}
      className="relative bg-white"
    >
      {/* Sticky Canvas */}
      <motion.canvas
        ref={canvasRef}
        className="sticky top-0 left-0 h-screen w-full block"
        style={{ opacity: canvasOpacity, zIndex: 1 }}
      />

      {/* UI Overlay Cards */}
      <div
        className="pointer-events-none sticky top-0 h-screen w-full"
        style={{ zIndex: 10 }}
      >
        {/* Hero overlay */}
        {cardTransforms
          .filter((c) => c.id === "hero")
          .map((card) => (
            <HeroOverlay key={card.id} opacity={card.opacity} y={card.y} />
          ))}

        {/* Feature cards */}
        {cardTransforms
          .filter((c) => c.id !== "hero")
          .map((card) => {
            const isLeft =
              card.align === "left" || (isMobile && card.align !== "center");
            const isCenter = isMobile;

            return (
              <motion.div
                key={card.id}
                className={`absolute ${
                  isCenter
                    ? "bottom-10 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md"
                    : isLeft
                      ? "top-1/2 left-8 -translate-y-1/2 hidden md:block"
                      : "top-1/2 right-8 -translate-y-1/2 hidden md:block"
                }`}
                style={{
                  opacity: card.opacity,
                  y: card.y,
                  pointerEvents: "auto" as const,
                }}
              >
                <FeatureCard
                  title={card.title}
                  description={card.description}
                  mockupType={card.mockupType}
                />
              </motion.div>
            );
          })}
      </div>

      {/* White background behind canvas */}
      <div className="fixed inset-0 bg-white" style={{ zIndex: 0 }} />
    </div>
  );
}
