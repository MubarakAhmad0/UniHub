"use client";

import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";

interface LoadingSpinnerProps {
  progress: number;
}

export function LoadingSpinner({ progress }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center gap-6">
      <motion.div
        className="relative"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <GraduationCap className="h-12 w-12 text-slate-300" />
        <svg
          className="absolute -inset-2 h-16 w-16 -rotate-90"
          viewBox="0 0 64 64"
        >
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-slate-100"
          />
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 28}`}
            strokeDashoffset={`${2 * Math.PI * 28 * (1 - progress / 100)}`}
            className="text-slate-400 transition-all duration-300"
          />
        </svg>
      </motion.div>
      <div className="text-center">
        <p className="text-sm font-medium text-slate-500">
          Preparing your campus experience
        </p>
        <p className="mt-1 text-xs text-slate-400">{progress}% loaded</p>
      </div>
    </div>
  );
}
