"use client";

import { motion } from "framer-motion";
import { BookOpen, Map, Users, LayoutDashboard } from "lucide-react";

export function LandingFeatures() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section
      id="features"
      className="py-24 bg-surface-container-low/30 border-y border-border/40"
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-[family-name:var(--font-serif)] text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            The Four Pillars of Campus Life
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            A meticulously organized ecosystem ensuring you never miss a
            beat—from lectures to library loans.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-12 auto-rows-min"
        >
          {/* Box 1: Academic - Large */}
          <motion.div
            variants={item}
            className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-8 shadow-sm transition-all hover:shadow-md lg:col-span-7 lg:row-span-2"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 transition-opacity group-hover:opacity-10">
              <BookOpen className="h-48 w-48" />
            </div>

            <div className="relative z-10">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="font-[family-name:var(--font-serif)] text-2xl font-semibold mb-3">
                Academic
              </h3>
              <p className="text-muted-foreground max-w-md">
                Real-time study plans, live attendance tracking, and course
                material management. Keep your GPA glowing and your deadlines in
                check.
              </p>

              <ul className="mt-8 space-y-3">
                {[
                  "Live Transcript & GPA tracking",
                  "Course catalog & enrollment",
                  "Attendance reporting",
                ].map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-sm font-medium text-foreground"
                  >
                    <span className="flex h-1.5 w-1.5 rounded-full bg-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Box 2: Campus - Medium */}
          <motion.div
            variants={item}
            className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-8 shadow-sm transition-all hover:shadow-md lg:col-span-5 lg:row-span-1"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#565e74]/10 text-[#565e74]">
                  <Map className="h-5 w-5" />
                </div>
                <h3 className="font-[family-name:var(--font-serif)] text-xl font-semibold">
                  Campus
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Interactive venue maps, digital library access, and live event
                ticketing. Navigate your physical university with digital
                precision.
              </p>
            </div>
          </motion.div>

          {/* Box 3: Community - Medium */}
          <motion.div
            variants={item}
            className="group relative overflow-hidden rounded-2xl border border-border/50 bg-[#565e74] text-white p-8 shadow-md transition-all hover:shadow-lg lg:col-span-5 lg:row-span-1"
          >
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white">
                    <Users className="h-5 w-5" />
                  </div>
                  <h3 className="font-[family-name:var(--font-serif)] text-xl font-semibold">
                    Community
                  </h3>
                </div>
                <p className="text-sm text-white/80">
                  Student marketplace, active clubs moderation, and discussion
                  forums.
                </p>
              </div>
              <div className="mt-6 font-medium text-xs tracking-wider uppercase opacity-80 flex items-center justify-between">
                <span>Join the conversation</span>
                <span>→</span>
              </div>
            </div>
          </motion.div>

          {/* Box 4: Services - Wide */}
          <motion.div
            variants={item}
            className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-8 shadow-sm transition-all hover:shadow-md lg:col-span-12"
          >
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div className="max-w-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF8157]/10 text-[#FF8157]">
                    <LayoutDashboard className="h-5 w-5" />
                  </div>
                  <h3 className="font-[family-name:var(--font-serif)] text-xl font-semibold">
                    Administrative Services
                  </h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Streamlined document requests, financial dashboards, and
                  automated complaint resolution. Dealing with administration
                  has never been this transparent.
                </p>
              </div>

              <div className="flex gap-2 flex-wrap">
                {["Finance", "Documents", "Complaints", "Lost & Found"].map(
                  (tag, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors group-hover:border-primary/30"
                    >
                      {tag}
                    </span>
                  ),
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
