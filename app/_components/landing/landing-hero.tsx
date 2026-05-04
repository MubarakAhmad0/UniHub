"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { InteractiveImageAccordion } from "@/components/ui/interactive-image-accordion";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden bg-background pt-24 pb-32 md:pt-32 md:pb-40">
      {/* Background gradients */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
      <div className="absolute top-0 right-0 -mr-40 -mt-40 h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-40 -mb-40 h-[500px] w-[500px] rounded-full bg-[#FF8157]/5 blur-3xl"></div>

      <div className="container relative z-10 mx-auto px-4 md:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-start gap-6"
          >
            <div className="inline-flex items-center rounded-full border border-border/50 bg-surface-container-low/50 px-3 py-1 text-sm text-muted-foreground backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-[#FF8157] mr-2"></span>
              Welcome to the Intellectual Atrium
            </div>

            <h1 className="font-[family-name:var(--font-serif)] text-5xl font-medium tracking-tight text-foreground sm:text-6xl md:text-7xl leading-[1.1]">
              The Modern University Experience,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#FF8157]">
                Unified.
              </span>
            </h1>

            <p className="max-w-[42rem] text-lg text-muted-foreground sm:text-xl leading-relaxed">
              One seamless portal for academics, campus life, community
              engagement, and administrative services. Designed for clarity,
              built for speed.
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-4">
              <Link href="/login">
                <Button
                  size="lg"
                  className="h-12 rounded-full bg-[#FF8157] text-white hover:bg-[#E6744E] px-8 text-base shadow-sm hover:shadow-md transition-all"
                >
                  Student Login
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="h-12 rounded-full px-8 text-base shadow-sm hover:bg-muted/50 border-border/50"
              >
                Discover for Institutions
              </Button>
            </div>
          </motion.div>

          {/* Interactive Image Accordion */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="relative w-full"
          >
            <InteractiveImageAccordion />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
