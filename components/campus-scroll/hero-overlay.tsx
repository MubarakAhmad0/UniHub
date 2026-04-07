"use client";

import type { MotionValue } from "framer-motion";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";

interface HeroOverlayProps {
  opacity: MotionValue<number>;
  y: MotionValue<number>;
}

export function HeroOverlay({ opacity, y }: HeroOverlayProps) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
      style={{ opacity, y }}
    >
      <div className="text-center">
        <div className="inline-flex items-center justify-center rounded-2xl border border-white/40 bg-white/60 px-6 py-4 backdrop-blur-xl backdrop-saturate-150 shadow-2xl shadow-black/5">
          <GraduationCap className="mr-3 h-8 w-8 text-slate-900" />
          <div className="text-left">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
              Your Campus.
            </h1>
            <p className="mt-1 text-lg text-slate-600 sm:text-xl">Your Hub.</p>
          </div>
        </div>
        <p className="mt-6 text-sm text-slate-600/80">Scroll to explore ↓</p>
      </div>
    </motion.div>
  );
}
