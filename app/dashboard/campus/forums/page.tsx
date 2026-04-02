"use client";

import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ChevronUp, Ghost, Lock, MessageSquare, Pin, Plus } from "lucide-react";
import { useState } from "react";

/* ── Mock data ────────────────────────────────────────────────────── */

type Forum = {
  id: string;
  name: string;
  description: string;
  type: "course" | "university" | "study_group" | "club" | "interest";
  unread: number;
  threads: number;
  icon: string;
};
type Thread = {
  id: string;
  forumId: string;
  title: string;
  author: string;
  isAnonymous?: boolean;
  isPinned?: boolean;
  isLocked?: boolean;
  tags: string[];
  upvotes: number;
  replies: number;
  timeAgo: string;
  isSolved?: boolean;
};
type Reply = {
  id: string;
  author: string;
  isAnonymous?: boolean;
  body: string;
  upvotes: number;
  isSolution?: boolean;
  timeAgo: string;
};

const forums: Forum[] = [
  {
    id: "f-mth",
    name: "MTH 301 · Advanced Calculus II",
    description: "Course forum",
    type: "course",
    unread: 3,
    threads: 24,
    icon: "📘",
  },
  {
    id: "f-arc",
    name: "ARC 402 · Urban Design Theory",
    description: "Course forum",
    type: "course",
    unread: 0,
    threads: 12,
    icon: "📐",
  },
  {
    id: "f-cs",
    name: "CS 105 · Data Structures",
    description: "Course forum",
    type: "course",
    unread: 1,
    threads: 31,
    icon: "💻",
  },
  {
    id: "f-his",
    name: "HIS 215 · Renaissance Art History",
    description: "Course forum",
    type: "course",
    unread: 0,
    threads: 8,
    icon: "🎨",
  },
  {
    id: "f-gen",
    name: "General · Campus Life",
    description: "General discussion",
    type: "university",
    unread: 2,
    threads: 55,
    icon: "🏫",
  },
  {
    id: "f-help",
    name: "Help Desk",
    description: "Admin & IT help",
    type: "university",
    unread: 0,
    threads: 18,
    icon: "❓",
  },
  {
    id: "f-sg",
    name: "MTH 301 Finals Study Group",
    description: "Study group",
    type: "study_group",
    unread: 1,
    threads: 6,
    icon: "👥",
  },
  {
    id: "f-photo",
    name: "Photography Enthusiasts",
    description: "Interest group",
    type: "interest",
    unread: 0,
    threads: 14,
    icon: "📷",
  },
];

const threads: Thread[] = [
  {
    id: "t1",
    forumId: "f-mth",
    title: "Reminder: Assignment 3 due Fri Apr 4",
    author: "Prof. Elena Rossi",
    isPinned: true,
    tags: [],
    upvotes: 5,
    replies: 0,
    timeAgo: "2d ago",
  },
  {
    id: "t2",
    forumId: "f-mth",
    title: "Anyone have summary notes for Week 9 Integration?",
    author: "Alex Rivers",
    tags: ["notes"],
    upvotes: 8,
    replies: 12,
    timeAgo: "2h ago",
  },
  {
    id: "t3",
    forumId: "f-mth",
    title: "Question about convergence criteria in problem set",
    author: "Jae Lee",
    tags: ["question"],
    upvotes: 3,
    replies: 4,
    timeAgo: "5h ago",
    isSolved: true,
  },
  {
    id: "t4",
    forumId: "f-mth",
    title: "Study group for finals — meeting Fri 3pm Library Rm 2",
    author: "Sam Kaur",
    tags: ["study-group"],
    upvotes: 6,
    replies: 9,
    timeAgo: "1d ago",
  },
  {
    id: "t5",
    forumId: "f-mth",
    title: "Recommended textbooks beyond the syllabus?",
    author: "Ming Tao",
    tags: ["resources"],
    upvotes: 11,
    replies: 7,
    timeAgo: "2d ago",
  },
];

const replies: Reply[] = [
  {
    id: "r1",
    author: "Jae Lee",
    body: "I've got notes — dropping them here: [Week9_Integration.pdf] Really clean summary of integration by parts with examples from the tutorial.",
    upvotes: 5,
    isSolution: true,
    timeAgo: "1h ago",
  },
  {
    id: "r2",
    author: "Anonymous Student",
    isAnonymous: true,
    body: "Also Prof Rossi's slides have a good summary on slides 34-38 if you still have access to the portal.",
    upvotes: 3,
    timeAgo: "45m ago",
  },
];

const TAG_COLOR: Record<string, string> = {
  notes: "bg-blue-100 text-blue-700",
  question: "bg-amber-100 text-amber-700",
  "study-group": "bg-emerald-100 text-emerald-700",
  resources: "bg-purple-100 text-purple-700",
  "off-topic": "bg-muted text-muted-foreground",
};

export default function ForumsPage() {
  const [activeForum, setActiveForum] = useState<Forum>(forums[0]);
  const [activeThread, setActiveThread] = useState<Thread | null>(null);
  const [newThreadOpen, setNewThreadOpen] = useState(false);
  const [replyText, setReplyText] = useState("");

  const forumThreads = threads.filter((t) => t.forumId === activeForum.id);
  const courseForums = forums.filter((f) => f.type === "course");
  const uniForums = forums.filter((f) => f.type === "university");
  const communityForums = forums.filter((f) =>
    ["study_group", "club", "interest"].includes(f.type),
  );

  function ForumItem({ f }: { f: Forum }) {
    return (
      <button
        onClick={() => {
          setActiveForum(f);
          setActiveThread(null);
        }}
        className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center gap-2 ${activeForum.id === f.id ? "bg-primary/10" : "hover:bg-muted"}`}
      >
        <span className="text-base">{f.icon}</span>
        <div className="flex-1 min-w-0">
          <p
            className={`text-xs leading-tight truncate ${f.unread > 0 ? "font-bold" : "font-medium"}`}
          >
            {f.name}
          </p>
        </div>
        {f.unread > 0 && (
          <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
        )}
      </button>
    );
  }

  return (
    <div className="flex flex-col min-h-svh">
      <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Community Forums</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* FORUM LIST PANEL */}
        <aside className="w-60 shrink-0 border-r bg-muted/30 flex flex-col overflow-y-auto">
          <div className="p-3 space-y-4">
            {/* Course forums */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-3 pb-1">
                My Courses
              </p>
              <div className="space-y-0.5">
                {courseForums.map((f) => (
                  <ForumItem key={f.id} f={f} />
                ))}
              </div>
            </div>
            {/* University boards */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-3 pb-1">
                University
              </p>
              <div className="space-y-0.5">
                {uniForums.map((f) => (
                  <ForumItem key={f.id} f={f} />
                ))}
              </div>
            </div>
            {/* Communities */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-3 pb-1">
                Communities
              </p>
              <div className="space-y-0.5">
                {communityForums.map((f) => (
                  <ForumItem key={f.id} f={f} />
                ))}
              </div>
              <button className="w-full text-left px-3 py-2 rounded-md hover:bg-muted text-xs text-muted-foreground flex items-center gap-2 mt-1">
                <Plus className="h-3.5 w-3.5" />
                Create Room
              </button>
            </div>
          </div>
        </aside>

        {/* THREAD LIST PANEL */}
        {!activeThread ? (
          <div className="w-96 shrink-0 border-r flex flex-col overflow-hidden">
            <div className="px-5 pt-5 pb-3 flex items-start justify-between gap-2">
              <div>
                <p className="text-lg font-bold">
                  {activeForum.icon} {activeForum.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {activeForum.threads} threads
                </p>
              </div>
              <Button size="sm" onClick={() => setNewThreadOpen(true)}>
                New Thread
              </Button>
            </div>
            <Separator />
            <div className="flex-1 overflow-y-auto divide-y divide-border/40">
              {forumThreads.length === 0 && (
                <p className="text-sm text-muted-foreground p-5">
                  No discussions yet — be the first to post!
                </p>
              )}
              {forumThreads.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveThread(t)}
                  className="w-full text-left px-5 py-3.5 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-start gap-2">
                    {t.isPinned && (
                      <Pin className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                    )}
                    {t.isLocked && (
                      <Lock className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm leading-snug ${t.replies === 12 ? "font-bold" : "font-medium"}`}
                      >
                        {t.title}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                        <span className="text-[11px] text-muted-foreground">
                          {t.author} · {t.timeAgo}
                        </span>
                        {t.isSolved && (
                          <span className="text-[10px] text-emerald-600 font-semibold">
                            ✓ Solved
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1.5">
                        {t.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${TAG_COLOR[tag] ?? "bg-muted text-muted-foreground"}`}
                          >
                            {tag}
                          </span>
                        ))}
                        <span className="text-[11px] text-muted-foreground ml-auto flex items-center gap-1">
                          <ChevronUp className="h-3 w-3" />
                          {t.upvotes}
                          <MessageSquare className="h-3 w-3 ml-1" />
                          {t.replies}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* THREAD DETAIL PANEL */
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="px-6 pt-5 pb-3 border-b flex items-start gap-3">
              <button
                onClick={() => setActiveThread(null)}
                className="text-xs text-muted-foreground hover:text-foreground mt-0.5"
              >
                ← Back
              </button>
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 items-center mb-1">
                  {activeThread.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${TAG_COLOR[tag]}`}
                    >
                      {tag}
                    </span>
                  ))}
                  {activeThread.isSolved && (
                    <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                      ✓ Solved
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-bold leading-snug">
                  {activeThread.title}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {activeThread.author} · {activeThread.timeAgo}
                </p>
              </div>
              <button className="text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground">
                <ChevronUp className="h-4 w-4" />
                {activeThread.upvotes}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {/* Original post body */}
              <div className="p-4 rounded-md bg-muted/20 text-sm text-muted-foreground leading-relaxed">
                {
                  "Hi all, I missed Tuesday's lecture and can't find clear notes for the Week 9 integration by parts section. Does anyone have a clean summary or can point me to a good resource? Thanks 🙏"
                }
              </div>

              {/* Replies */}
              {replies.map((r) => (
                <Card
                  key={r.id}
                  className={`border-0 shadow-sm ${r.isSolution ? "ring-1 ring-emerald-400" : "bg-card"}`}
                >
                  <CardHeader className="pb-2 pt-4 px-5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                        {r.isAnonymous ? (
                          <Ghost className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          r.author[0]
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-semibold">
                          {r.isAnonymous ? "Anonymous Student" : r.author}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {r.timeAgo}
                        </p>
                      </div>
                      {r.isSolution && (
                        <Badge className="ml-auto text-[10px] bg-emerald-500 hover:bg-emerald-500">
                          ✓ Solution
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="px-5 pb-4 space-y-3">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {r.body}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <button className="flex items-center gap-1 hover:text-foreground">
                        <ChevronUp className="h-4 w-4" />
                        {r.upvotes}
                      </button>
                      <button className="hover:text-foreground">Reply</button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Compose reply */}
            <div className="border-t px-6 py-4 space-y-2">
              <Textarea
                placeholder="Write a reply..."
                rows={2}
                className="resize-none text-sm"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  Post anonymously
                </label>
                <Button
                  size="sm"
                  disabled={!replyText.trim()}
                  onClick={() => {
                    setReplyText("");
                    toast("Reply posted");
                  }}
                >
                  Post Reply
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* When no thread selected, show empty right panel */}
        {!activeThread && (
          <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
            Select a thread to read
          </div>
        )}
      </div>

      {/* New thread sheet */}
      <Sheet open={newThreadOpen} onOpenChange={setNewThreadOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>New Thread in {activeForum.name}</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-4 text-sm">
            <div className="space-y-1.5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                Title
              </p>
              <input
                className="w-full border border-border/40 rounded px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Thread title..."
              />
            </div>
            <div className="space-y-1.5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                Tags
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "notes",
                  "question",
                  "study-group",
                  "resources",
                  "off-topic",
                ].map((tag) => (
                  <button
                    key={tag}
                    className={`text-xs px-2.5 py-0.5 rounded font-medium ${TAG_COLOR[tag] ?? "bg-muted text-muted-foreground"}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                Body
              </p>
              <Textarea
                placeholder="Write your post..."
                rows={5}
                className="resize-none"
              />
            </div>
          </div>
          <SheetFooter className="mt-4">
            <Button variant="outline" onClick={() => setNewThreadOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setNewThreadOpen(false);
                toast("Thread posted!");
              }}
            >
              Post Thread
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
