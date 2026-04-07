"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Map as MapIcon,
  FileText,
  CalendarDays,
  CheckCircle2,
  Bell,
} from "lucide-react";

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

            <div className="flex items-center gap-4 mt-8 text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-full border-2 border-background bg-muted flex items-center justify-center"
                  >
                    <GraduationCap className="h-4 w-4 text-muted-foreground/50" />
                  </div>
                ))}
              </div>
              <p>
                Trusted by over{" "}
                <strong className="text-foreground">10,000+</strong> students
              </p>
            </div>
          </motion.div>

          {/* Abstract Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="relative mx-auto w-full max-w-[600px] lg:max-w-none"
          >
            <div className="relative aspect-square md:aspect-[4/3] lg:aspect-square w-full rounded-2xl border border-border/40 bg-card/40 p-4 shadow-2xl backdrop-blur-xl">
              {/* Fake UI Header */}
              <div className="mb-6 flex items-center justify-between border-b border-border/40 pb-4">
                <div className="flex items-center gap-4">
                  <div className="h-3 w-3 rounded-full bg-red-400"></div>
                  <div className="h-3 w-3 rounded-full bg-amber-400"></div>
                  <div className="h-3 w-3 rounded-full bg-green-400"></div>
                </div>
                <div className="h-6 w-32 rounded bg-muted/60"></div>
              </div>

              {/* Fake UI Grid */}
              <div className="grid h-[calc(100%-4rem)] grid-cols-12 grid-rows-6 gap-4">
                {/* Panel 1 */}
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="col-span-12 row-span-2 md:col-span-8 rounded-xl border border-border/30 bg-background/60 p-4 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary/10 p-2 rounded-md">
                      <CalendarDays className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="h-4 w-24 rounded bg-foreground/80 mb-1"></div>
                      <div className="h-3 w-16 rounded bg-muted-foreground/40"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-full rounded-full bg-muted/50"></div>
                    <div className="h-2 w-5/6 rounded-full bg-muted/50"></div>
                  </div>
                </motion.div>

                {/* Panel 2 */}
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="col-span-6 row-span-2 md:col-span-4 rounded-xl border border-border/30 bg-primary/5 p-4 shadow-sm flex flex-col justify-center"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                      GPA
                    </span>
                    <GraduationCap className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-3xl font-[family-name:var(--font-serif)] text-foreground">
                    3.84
                  </div>
                </motion.div>

                {/* Panel 3 */}
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="col-span-6 row-span-4 md:col-span-4 md:row-span-4 rounded-xl border border-border/30 bg-background/60 p-4 shadow-sm relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF8157]/10 rounded-bl-full blur-xl"></div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-[#FF8157]/10 p-2 rounded-md">
                      <Bell className="h-5 w-5 text-[#FF8157]" />
                    </div>
                    <div className="h-4 w-20 rounded bg-foreground/80"></div>
                  </div>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex gap-3">
                        <div className="mt-1 h-2 w-2 rounded-full bg-primary/40 shrink-0"></div>
                        <div>
                          <div className="h-3 w-28 rounded bg-foreground/60 mb-2"></div>
                          <div className="h-2 w-20 rounded bg-muted-foreground/30"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Panel 4 */}
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="col-span-12 row-span-2 md:col-span-8 md:row-span-2 rounded-xl border border-border/30 bg-background/60 p-4 shadow-sm flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-muted/80 flex items-center justify-center">
                      <MapIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="h-4 w-32 rounded bg-foreground/80 mb-1"></div>
                      <div className="h-3 w-40 rounded bg-muted-foreground/40"></div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="hidden sm:flex rounded-full"
                  >
                    Explore
                  </Button>
                </motion.div>

                {/* Panel 5 */}
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="col-span-12 row-span-2 md:col-span-8 md:row-span-2 rounded-xl border border-border/30 bg-[#565e74] p-4 shadow-md text-white flex items-center justify-between"
                >
                  <div>
                    <div className="text-sm font-medium mb-1 opacity-90">
                      Next Class in 15m
                    </div>
                    <div className="text-xl font-[family-name:var(--font-serif)]">
                      Advanced Algorithms
                    </div>
                  </div>
                  <div className="bg-white/20 p-3 rounded-full">
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  </div>
                </motion.div>
              </div>

              {/* Floating element out of bounds */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1, type: "spring" }}
                className="absolute -right-6 -bottom-6 flex items-center gap-3 rounded-xl border border-border/50 bg-background p-4 shadow-xl"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="text-sm font-bold text-foreground">
                    Transcript Ready
                  </div>
                  <div className="text-xs text-muted-foreground">Just now</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
