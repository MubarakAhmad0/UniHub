"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { InteractiveImageAccordion } from "@/components/ui/interactive-image-accordion";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden bg-[#FF8157]/[0.06] pt-24 pb-32 md:pt-32 md:pb-40">
      {/* Background gradients */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#FF8157]/10 via-[#FF8157]/[0.06] to-[#FF8157]/[0.04]"></div>
      <div className="absolute top-0 right-0 -mr-40 -mt-40 h-[600px] w-[600px] rounded-full bg-[#FF8157]/10 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-40 -mb-40 h-[500px] w-[500px] rounded-full bg-[#FF8157]/5 blur-3xl"></div>

      <div className="container relative z-10 mx-auto px-4 md:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          {/* Text Content — pushed slightly right for balance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-start gap-8 pl-0 md:pl-8 lg:pl-16"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-surface-container-low/50 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-[#FF8157]" />
              Welcome to the Intellectual Atrium
            </div>

            {/* Headline — stacked vertically for impact */}
            <h1 className="font-[family-name:var(--font-serif)] text-5xl font-medium tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95]">
              <span className="block">The Modern</span>
              <span className="block">University</span>
              <span className="block">Experience,</span>
              <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#FF8157]">
                Unified.
              </span>
            </h1>

            {/* Description */}
            <p className="max-w-md text-lg text-muted-foreground leading-relaxed">
              One seamless portal for academics, campus life, community
              engagement, and administrative services.
            </p>

            {/* CTA Buttons */}
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button
                  size="lg"
                  className="h-12 rounded-full bg-[#FF8157] text-white hover:bg-[#E6744E] px-8 text-base shadow-sm hover:shadow-md transition-all gap-2"
                >
                  Student Login
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="h-12 rounded-full px-8 text-base shadow-sm hover:bg-muted/50 border-border/50"
              >
                For Institutions
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
