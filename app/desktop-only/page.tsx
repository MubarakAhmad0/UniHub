"use client";

import { motion } from "framer-motion";
import { Construction } from "lucide-react";

function SpinningGear() {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      className="relative"
    >
      <Construction className="h-20 w-20 text-[#FF8157]" strokeWidth={1.5} />
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: -360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-3 h-3 rounded-full bg-[#FF8157]/60" />
        <div className="absolute top-1/2 right-0 translate-x-2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#FF8157]/60" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 w-3 h-3 rounded-full bg-[#FF8157]/60" />
        <div className="absolute top-1/2 left-0 -translate-x-2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#FF8157]/60" />
      </motion.div>
    </motion.div>
  );
}

export default function DesktopOnlyPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FF8157]/[0.03] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#FF8157]/10 via-transparent to-transparent" />
      <div className="absolute top-0 right-0 -mr-40 -mt-40 h-[400px] w-[400px] rounded-full bg-[#FF8157]/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 -ml-40 -mb-40 h-[300px] w-[300px] rounded-full bg-[#FF8157]/5 blur-3xl" />

      <div className="container relative z-10 mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-8"
        >
          <div className="relative">
            <SpinningGear />
            <motion.div
              className="absolute inset-0"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-24 h-24 rounded-full border-2 border-dashed border-[#FF8157]/30" />
            </motion.div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl font-medium text-foreground"
            >
              Under Construction
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-lg text-muted-foreground max-w-md"
            >
              We&apos;re building something amazing for you.
              <br />
              Mobile experience coming soon.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex items-center gap-2 text-sm text-muted-foreground/60"
          >
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-[#FF8157]"
            />
            Please visit on a desktop device
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
