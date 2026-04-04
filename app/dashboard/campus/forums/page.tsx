"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
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
import { useAuth } from "@/lib/auth/use-auth";
import { ChevronUp, Lock, Plus, Settings2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CreateForumModal, type Forum } from "./_components/create-forum-modal";
import { ReplyCard, type Reply } from "./_components/reply-card";
import { TAG_COLOR, ThreadRow, type Thread } from "./_components/thread-row";

/* ── Mock data ──────────────────────────────────────────────────────────────── */

const INITIAL_FORUMS: Forum[] = [
  {
    id: "f-mth",
    name: "MTH 301 · Advanced Calculus II",
    description: "Course forum",
    type: "course",
    unread: 3,
    threads: 24,
    icon: "📘",
    status: "active",
  },
  {
    id: "f-arc",
    name: "ARC 402 · Urban Design Theory",
    description: "Course forum",
    type: "course",
    unread: 0,
    threads: 12,
    icon: "📐",
    status: "active",
  },
  {
    id: "f-cs",
    name: "CS 105 · Data Structures",
    description: "Course forum",
    type: "course",
    unread: 1,
    threads: 31,
    icon: "💻",
    status: "active",
  },
  {
    id: "f-his",
    name: "HIS 215 · Renaissance Art History",
    description: "Course forum",
    type: "course",
    unread: 0,
    threads: 8,
    icon: "🎨",
    status: "active",
  },
  {
    id: "f-gen",
    name: "General · Campus Life",
    description: "General discussion",
    type: "university",
    unread: 2,
    threads: 55,
    icon: "🏫",
    status: "active",
  },
  {
    id: "f-help",
    name: "Help Desk",
    description: "Admin & IT help",
    type: "university",
    unread: 0,
    threads: 18,
    icon: "❓",
    status: "active",
  },
  {
    id: "f-sg",
    name: "MTH 301 Finals Study Group",
    description: "Study group",
    type: "study_group",
    unread: 1,
    threads: 6,
    icon: "👥",
    status: "active",
  },
  {
    id: "f-photo",
    name: "Photography Enthusiasts",
    description: "Interest group",
    type: "interest",
    unread: 0,
    threads: 14,
    icon: "📷",
    status: "active",
  },
];

const INITIAL_THREADS: Thread[] = [
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

const INITIAL_REPLIES: Reply[] = [
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
    isSolution: false,
    timeAgo: "45m ago",
  },
];

// Manager's teaching course forum IDs — in reality pulled from user profile
const MANAGER_COURSE_FORUM_IDS = ["f-mth", "f-cs"];

/* ── Helpers ─────────────────────────────────────────────────────────────────── */

function ForumItem({
  f,
  isActive,
  onClick,
}: {
  f: Forum;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center gap-2 ${
        isActive ? "bg-primary/10" : "hover:bg-muted"
      }`}
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

/* ── Page ─────────────────────────────────────────────────────────────────────── */

export default function ForumsPage() {
  const { hasRole } = useAuth();
  const isAdmin = hasRole("admin");
  const isManager = hasRole("manager");

  const [forums, setForums] = useState<Forum[]>(INITIAL_FORUMS);
  const [threads, setThreads] = useState<Thread[]>(INITIAL_THREADS);
  const [replies, setReplies] = useState<Reply[]>(INITIAL_REPLIES);

  const [activeForum, setActiveForum] = useState<Forum>(forums[0]);
  const [activeThread, setActiveThread] = useState<Thread | null>(null);
  const [newThreadOpen, setNewThreadOpen] = useState(false);
  const [createForumOpen, setCreateForumOpen] = useState(false);
  const [replyText, setReplyText] = useState("");

  // Filtered lists
  const courseForums = forums.filter(
    (f) => f.type === "course" && f.status === "active",
  );
  const uniForums = forums.filter(
    (f) => f.type === "university" && f.status === "active",
  );
  const communityForums = forums.filter(
    (f) =>
      ["study_group", "club", "interest"].includes(f.type) &&
      f.status === "active",
  );
  const forumThreads = threads.filter((t) => t.forumId === activeForum.id);

  // Sort threads: pinned first
  const sortedThreads = [...forumThreads].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  // Moderation rights for active forum
  const canModerateActiveForum =
    isAdmin || (isManager && MANAGER_COURSE_FORUM_IDS.includes(activeForum.id));

  // ── Thread actions ──────────────────────────────────────────────────────────
  const togglePin = (threadId: string) =>
    setThreads((prev) =>
      prev.map((t) =>
        t.id === threadId ? { ...t, isPinned: !t.isPinned } : t,
      ),
    );

  const toggleLock = (threadId: string) =>
    setThreads((prev) =>
      prev.map((t) =>
        t.id === threadId ? { ...t, isLocked: !t.isLocked } : t,
      ),
    );

  const deleteThread = (threadId: string) =>
    setThreads((prev) => prev.filter((t) => t.id !== threadId));

  // ── Reply actions ───────────────────────────────────────────────────────────
  const toggleSolution = (replyId: string) =>
    setReplies((prev) =>
      prev.map((r) =>
        r.id === replyId ? { ...r, isSolution: !r.isSolution } : r,
      ),
    );

  const deleteReply = (replyId: string) =>
    setReplies((prev) => prev.filter((r) => r.id !== replyId));

  // ── Forum actions ───────────────────────────────────────────────────────────
  const handleCreateForum = (forum: Forum) => {
    setForums((prev) => [...prev, forum]);
  };

  const postReply = () => {
    if (!replyText.trim()) return;
    const newReply: Reply = {
      id: `r-${Date.now()}`,
      author: "You",
      body: replyText,
      upvotes: 0,
      timeAgo: "just now",
    };
    setReplies((prev) => [...prev, newReply]);
    setReplyText("");
    toast("Reply posted.");
  };

  return (
    <div className="flex flex-col min-h-svh">
      {/* ── Header ── */}
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

        {/* Admin manage button */}
        {isAdmin && (
          <Button variant="outline" size="sm" className="ml-auto gap-1">
            <Settings2 className="h-3.5 w-3.5" />
            Manage Forums
          </Button>
        )}
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ── SIDEBAR: Forum list ── */}
        <aside className="w-60 shrink-0 border-r bg-muted/30 flex flex-col overflow-y-auto">
          <div className="p-3 space-y-4">
            {/* Course forums */}
            <div>
              <div className="flex items-center justify-between px-3 pb-1">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  My Courses
                </p>
                {/* Manager: add course forum */}
                {isManager && (
                  <button
                    onClick={() => setCreateForumOpen(true)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    title="Create course forum"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                )}
              </div>
              <div className="space-y-0.5">
                {courseForums.map((f) => (
                  <ForumItem
                    key={f.id}
                    f={f}
                    isActive={activeForum.id === f.id}
                    onClick={() => {
                      setActiveForum(f);
                      setActiveThread(null);
                    }}
                  />
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
                  <ForumItem
                    key={f.id}
                    f={f}
                    isActive={activeForum.id === f.id}
                    onClick={() => {
                      setActiveForum(f);
                      setActiveThread(null);
                    }}
                  />
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
                  <ForumItem
                    key={f.id}
                    f={f}
                    isActive={activeForum.id === f.id}
                    onClick={() => {
                      setActiveForum(f);
                      setActiveThread(null);
                    }}
                  />
                ))}
              </div>

              {/* Create Room button — all users (student=pending, manager/admin=direct) */}
              <button
                onClick={() => setCreateForumOpen(true)}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-muted text-xs text-muted-foreground flex items-center gap-2 mt-1 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                {isAdmin || isManager ? "Create Forum" : "Apply for Room"}
              </button>
            </div>
          </div>
        </aside>

        {/* ── THREAD LIST PANEL ── */}
        {!activeThread && (
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
              {sortedThreads.length === 0 && (
                <p className="text-sm text-muted-foreground p-5">
                  No discussions yet — be the first to post!
                </p>
              )}
              {sortedThreads.map((t) => (
                <ThreadRow
                  key={t.id}
                  thread={t}
                  isActive={false}
                  onClick={() => setActiveThread(t)}
                  canModerate={canModerateActiveForum}
                  onPin={() => togglePin(t.id)}
                  onLock={() => toggleLock(t.id)}
                  onDelete={() => deleteThread(t.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── THREAD DETAIL PANEL ── */}
        {activeThread ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Detail header */}
            <div className="px-6 pt-5 pb-3 border-b flex items-start gap-3">
              <button
                onClick={() => setActiveThread(null)}
                className="text-xs text-muted-foreground hover:text-foreground mt-0.5 transition-colors"
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
                  {activeThread.isLocked && (
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Lock className="h-3 w-3" /> Locked
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-bold leading-snug">
                  {activeThread.title}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {activeThread.isAnonymous ? "Anonymous" : activeThread.author}{" "}
                  · {activeThread.timeAgo}
                </p>
              </div>
              <button className="text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
                <ChevronUp className="h-4 w-4" />
                {activeThread.upvotes}
              </button>
            </div>

            {/* Replies */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {/* Original post body */}
              <div className="p-4 rounded-md bg-muted/20 text-sm text-muted-foreground leading-relaxed">
                Hi all, I missed Tuesday&apos;s lecture and can&apos;t find
                clear notes for the Week 9 integration by parts section. Does
                anyone have a clean summary or can point me to a good resource?
                Thanks 🙏
              </div>

              {replies.map((r) => (
                <ReplyCard
                  key={r.id}
                  reply={r}
                  canMarkSolution={canModerateActiveForum}
                  canDelete={
                    isAdmin ||
                    (isManager &&
                      MANAGER_COURSE_FORUM_IDS.includes(activeForum.id))
                  }
                  onMarkSolution={() => toggleSolution(r.id)}
                  onDelete={() => deleteReply(r.id)}
                />
              ))}
            </div>

            {/* Compose reply — locked threads show a notice instead */}
            {activeThread.isLocked ? (
              <div className="border-t px-6 py-4 text-xs text-muted-foreground flex items-center gap-2">
                <Lock className="h-3.5 w-3.5" />
                This thread has been locked. No new replies can be posted.
              </div>
            ) : (
              <div className="border-t px-6 py-4 space-y-2">
                <Textarea
                  placeholder="Write a reply..."
                  rows={2}
                  className="resize-none text-sm"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
                <div className="flex items-center justify-between">
                  {/* Anonymous checkbox — hidden for managers */}
                  {!isManager && (
                    <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                      <input type="checkbox" className="rounded" />
                      Post anonymously
                    </label>
                  )}
                  {isManager && <span />}
                  <Button
                    size="sm"
                    disabled={!replyText.trim()}
                    onClick={postReply}
                  >
                    Post Reply
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Empty right panel when no thread is selected */
          <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
            Select a thread to read
          </div>
        )}
      </div>

      {/* ── New Thread Sheet ── */}
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
            {/* Anonymous option hidden for managers */}
            {!isManager && (
              <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                <input type="checkbox" className="rounded" />
                Post anonymously
              </label>
            )}
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

      {/* ── Create Forum Modal ── */}
      <CreateForumModal
        open={createForumOpen}
        onClose={() => setCreateForumOpen(false)}
        role={isAdmin ? "admin" : isManager ? "manager" : "student"}
        onSave={handleCreateForum}
      />
    </div>
  );
}
