"use client";

import { motion } from "framer-motion";
import { BellRing, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingAnnouncements() {
  const notifications = [
    {
      title: "Midterm Schedules Released",
      time: "2 hours ago",
      category: "Academic",
    },
    {
      title: "Campus Library closed this Sunday",
      time: "5 hours ago",
      category: "Campus",
    },
    {
      title: "New Club: AI Enthusiasts",
      time: "1 day ago",
      category: "Community",
    },
  ];

  return (
    <section id="announcements" className="py-24 bg-[#FF8157]/[0.06]">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
          {/* Editorial Text Side */}
          <div className="flex-1 space-y-6">
            <h2 className="font-[family-name:var(--font-serif)] text-3xl font-medium tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Live Announcements & <br />
              <span className="italic text-primary/80">Scholar Slate</span>
            </h2>
            <div className="h-1 w-12 bg-[#FF8157] rounded-full"></div>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
              Never miss critical updates. From emergency campus alerts to
              assignment deadlines, the Scholar Slate consolidates your
              need-to-know information into one elegant feed.
            </p>
            <Button variant="outline" className="mt-4 rounded-full group">
              View Sample Slate
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

          {/* Visual Display Side */}
          <div className="flex-1 w-full max-w-md mx-auto lg:mx-0">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl border border-border/50 bg-card p-6 shadow-xl relative"
            >
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <BellRing className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-semibold text-lg tracking-tight">
                    Latest Updates
                  </span>
                </div>
                <div className="px-2 py-1 bg-[#FF8157]/10 text-[#FF8157] text-xs font-bold rounded-full">
                  3 New
                </div>
              </div>

              <div className="space-y-6 relative">
                {/* Timeline line */}
                <div className="absolute left-[11px] top-2 bottom-4 w-[2px] bg-border/40"></div>

                {notifications.map((note, i) => (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 + 0.2 }}
                    key={i}
                    className="relative pl-10"
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-0 top-1.5 h-6 w-6 rounded-full border-[3px] border-background bg-primary shadow-sm flex items-center justify-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-foreground"></div>
                    </div>

                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 flex items-center justify-between">
                      <span>{note.category}</span>
                      <span className="normal-case opacity-70 font-medium">
                        {note.time}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-foreground leading-snug">
                      {note.title}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
