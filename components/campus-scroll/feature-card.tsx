"use client";

import {
  CalendarDays,
  MessageSquare,
  Users,
  MapPin,
  FileText,
  TrendingUp,
  Clock,
  Upload,
  CheckCircle2,
} from "lucide-react";

// ─── Mockup sub-components ──────────────────────────────────────────

function ScheduleMockup() {
  return (
    <div className="mt-4 space-y-3 rounded-xl bg-white/60 p-4 backdrop-blur-sm">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
        <CalendarDays className="h-4 w-4 text-blue-500" />
        Today&apos;s Schedule
      </div>
      {[
        { time: "09:00", course: "Data Structures", room: "A-201" },
        { time: "11:00", course: "Linear Algebra", room: "B-103" },
        { time: "14:00", course: "Algorithms", room: "C-305" },
      ].map((item, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-lg bg-white/80 p-2.5 text-xs"
        >
          <div className="rounded-md bg-blue-100 px-2 py-1 font-mono text-blue-700">
            {item.time}
          </div>
          <div className="flex-1">
            <div className="font-medium text-slate-800">{item.course}</div>
            <div className="text-slate-500">{item.room}</div>
          </div>
        </div>
      ))}
      <div className="flex items-center gap-2 rounded-lg bg-green-50 p-2.5 text-xs">
        <TrendingUp className="h-3.5 w-3.5 text-green-600" />
        <span className="font-medium text-green-700">GPA: 3.84</span>
        <span className="ml-auto text-green-600">↑ 0.12</span>
      </div>
    </div>
  );
}

function ForumMockup() {
  return (
    <div className="mt-4 space-y-3 rounded-xl bg-white/60 p-4 backdrop-blur-sm">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
        <MessageSquare className="h-4 w-4 text-indigo-500" />
        Trending Discussions
      </div>
      {[
        {
          title: "Best study groups for CS101?",
          replies: 24,
          tag: "Academics",
        },
        {
          title: "Campus food truck Friday — who&apos;s in?",
          replies: 47,
          tag: "Social",
        },
        {
          title: "Internship experiences at tech companies",
          replies: 89,
          tag: "Career",
        },
      ].map((item, i) => (
        <div
          key={i}
          className="flex items-start gap-3 rounded-lg bg-white/80 p-2.5"
        >
          <div className="mt-0.5 h-7 w-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400" />
          <div className="flex-1">
            <div className="text-xs font-medium text-slate-800">
              {item.title}
            </div>
            <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-500">
              <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-indigo-600">
                {item.tag}
              </span>
              <span>{item.replies} replies</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ClubsMockup() {
  return (
    <div className="mt-4 space-y-3 rounded-xl bg-white/60 p-4 backdrop-blur-sm">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
        <Users className="h-4 w-4 text-amber-500" />
        Popular Clubs
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[
          {
            name: "Robotics Club",
            members: 142,
            color: "from-blue-400 to-cyan-400",
          },
          {
            name: "Debate Society",
            members: 98,
            color: "from-rose-400 to-pink-400",
          },
          {
            name: "Photography",
            members: 215,
            color: "from-amber-400 to-orange-400",
          },
          {
            name: "Music Band",
            members: 67,
            color: "from-green-400 to-emerald-400",
          },
        ].map((club, i) => (
          <div key={i} className="overflow-hidden rounded-lg bg-white/80 p-2.5">
            <div
              className={`mb-1.5 h-8 rounded bg-gradient-to-r ${club.color}`}
            />
            <div className="text-[11px] font-medium text-slate-800">
              {club.name}
            </div>
            <div className="text-[10px] text-slate-500">
              {club.members} members
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MapMockup() {
  return (
    <div className="mt-4 space-y-3 rounded-xl bg-white/60 p-4 backdrop-blur-sm">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
        <MapPin className="h-4 w-4 text-red-500" />
        Campus Navigation
      </div>
      <div className="relative h-28 overflow-hidden rounded-lg bg-gradient-to-br from-green-100 via-green-50 to-blue-100">
        <div className="absolute inset-3 grid grid-cols-4 grid-rows-3 gap-1">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className={`rounded ${
                i % 3 === 0
                  ? "bg-green-300/50"
                  : i % 5 === 0
                    ? "bg-blue-200/50"
                    : "bg-white/60"
              }`}
            />
          ))}
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="h-6 w-6 rounded-full bg-red-500 shadow-lg shadow-red-500/30" />
            <div className="absolute -inset-2 animate-ping rounded-full bg-red-400/30" />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-lg bg-white/80 p-2.5 text-xs">
        <Clock className="h-3.5 w-3.5 text-slate-500" />
        <span className="text-slate-700">
          Next class: <strong>Room C-305</strong> — 15 min walk
        </span>
      </div>
    </div>
  );
}

function DocumentsMockup() {
  return (
    <div className="mt-4 space-y-3 rounded-xl bg-white/60 p-4 backdrop-blur-sm">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
        <FileText className="h-4 w-4 text-slate-600" />
        Document Requests
      </div>
      {[
        { doc: "Official Transcript", status: "processing", progress: 65 },
        { doc: "Enrollment Certificate", status: "ready", progress: 100 },
        { doc: "Fee Receipt", status: "processing", progress: 30 },
      ].map((item, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-lg bg-white/80 p-2.5"
        >
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full ${
              item.status === "ready"
                ? "bg-green-100 text-green-600"
                : "bg-amber-100 text-amber-600"
            }`}
          >
            {item.status === "ready" ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
          </div>
          <div className="flex-1">
            <div className="text-[11px] font-medium text-slate-800">
              {item.doc}
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className={`h-full rounded-full transition-all ${
                  item.status === "ready" ? "bg-green-500" : "bg-amber-500"
                }`}
                style={{ width: `${item.progress}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main FeatureCard ─────────────────────────────────────────────

interface FeatureCardProps {
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

export function FeatureCard({
  title,
  description,
  mockupType,
}: FeatureCardProps) {
  const renderMockup = () => {
    switch (mockupType) {
      case "schedule":
        return <ScheduleMockup />;
      case "forum":
        return <ForumMockup />;
      case "clubs":
        return <ClubsMockup />;
      case "map":
        return <MapMockup />;
      case "documents":
        return <DocumentsMockup />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-white/40 bg-white/70 shadow-xl shadow-black/5 backdrop-blur-xl backdrop-saturate-150">
      <div className="p-6">
        <h3 className="text-lg font-semibold tracking-tight text-slate-900">
          {title}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-slate-600">
          {description}
        </p>
        {renderMockup()}
      </div>
    </div>
  );
}
