"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronUp,
  Flag,
  Lock,
  MessageSquare,
  MoreHorizontal,
  Pin,
  PinOff,
  Trash2,
  Unlock,
} from "lucide-react";
import { toast } from "sonner";

export const TAG_COLOR: Record<string, string> = {
  notes: "bg-blue-100 text-blue-700",
  question: "bg-amber-100 text-amber-700",
  "study-group": "bg-emerald-100 text-emerald-700",
  resources: "bg-purple-100 text-purple-700",
  "off-topic": "bg-muted text-muted-foreground",
};

export type Thread = {
  id: string;
  forumId: string;
  title: string;
  author: string;
  isAnonymous?: boolean;
  isPinned?: boolean;
  isLocked?: boolean;
  isFlagged?: boolean;
  tags: string[];
  upvotes: number;
  replies: number;
  timeAgo: string;
  isSolved?: boolean;
};

type ThreadRowProps = {
  thread: Thread;
  isActive: boolean;
  onClick: () => void;
  canModerate: boolean;
  onPin?: () => void;
  onLock?: () => void;
  onDelete?: () => void;
};

export function ThreadRow({
  thread,
  isActive,
  onClick,
  canModerate,
  onPin,
  onLock,
  onDelete,
}: ThreadRowProps) {
  const handleFlag = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast("Content flagged for review.");
  };

  return (
    <div
      className={`relative group w-full text-left px-5 py-3.5 transition-colors cursor-pointer ${
        isActive ? "bg-primary/5" : "hover:bg-muted/40"
      }`}
      onClick={onClick}
    >
      <div className="flex items-start gap-2">
        {thread.isPinned && (
          <Pin className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
        )}
        {thread.isLocked && (
          <Lock className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium leading-snug">{thread.title}</p>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
            <span className="text-[11px] text-muted-foreground">
              {thread.isAnonymous ? "Anonymous" : thread.author} ·{" "}
              {thread.timeAgo}
            </span>
            {thread.isSolved && (
              <span className="text-[10px] text-emerald-600 font-semibold">
                ✓ Solved
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            {thread.tags.map((tag) => (
              <span
                key={tag}
                className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                  TAG_COLOR[tag] ?? "bg-muted text-muted-foreground"
                }`}
              >
                {tag}
              </span>
            ))}
            <span className="text-[11px] text-muted-foreground ml-auto flex items-center gap-1">
              <ChevronUp className="h-3 w-3" />
              {thread.upvotes}
              <MessageSquare className="h-3 w-3 ml-1" />
              {thread.replies}
            </span>
          </div>
        </div>

        {/* Moderation + flag controls — shown on hover */}
        <div
          className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Flag — available to ALL users */}
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 text-muted-foreground hover:text-destructive"
            title="Flag content"
            onClick={handleFlag}
            id={`flag-thread-${thread.id}`}
          >
            <Flag className="h-3 w-3" />
          </Button>

          {/* Moderation actions — moderators only */}
          {canModerate && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6"
                  id={`moderate-thread-${thread.id}`}
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuItem
                  onClick={() => {
                    onPin?.();
                    toast(
                      thread.isPinned ? "Thread unpinned." : "Thread pinned.",
                    );
                  }}
                >
                  {thread.isPinned ? (
                    <>
                      <PinOff className="h-3.5 w-3.5 mr-2" />
                      Unpin
                    </>
                  ) : (
                    <>
                      <Pin className="h-3.5 w-3.5 mr-2" />
                      Pin
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    onLock?.();
                    toast(
                      thread.isLocked ? "Thread unlocked." : "Thread locked.",
                    );
                  }}
                >
                  {thread.isLocked ? (
                    <>
                      <Unlock className="h-3.5 w-3.5 mr-2" />
                      Unlock
                    </>
                  ) : (
                    <>
                      <Lock className="h-3.5 w-3.5 mr-2" />
                      Lock
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => {
                    onDelete?.();
                    toast("Thread removed.");
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Badge helpers re-exported ───────────────────────────────────────────────
export { Badge };
