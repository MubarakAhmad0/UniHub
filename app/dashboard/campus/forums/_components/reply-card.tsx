"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CheckCircle,
  ChevronUp,
  Flag,
  Ghost,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

export type Reply = {
  id: string;
  author: string;
  isAnonymous?: boolean;
  body: string;
  upvotes: number;
  isSolution?: boolean;
  timeAgo: string;
};

type ReplyCardProps = {
  reply: Reply;
  canMarkSolution: boolean; // manager who owns the course forum
  canDelete: boolean; // admin always; manager in own course forum
  onMarkSolution?: () => void;
  onDelete?: () => void;
};

export function ReplyCard({
  reply,
  canMarkSolution,
  canDelete,
  onMarkSolution,
  onDelete,
}: ReplyCardProps) {
  const handleFlag = () => {
    toast("Reply flagged for review.");
  };

  return (
    <Card
      className={`border-0 shadow-sm ${
        reply.isSolution ? "ring-1 ring-emerald-400" : "bg-card"
      }`}
    >
      <CardHeader className="pb-2 pt-4 px-5">
        <div className="flex items-center gap-2">
          {/* Avatar */}
          <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-bold shrink-0">
            {reply.isAnonymous ? (
              <Ghost className="h-4 w-4 text-muted-foreground" />
            ) : (
              reply.author[0].toUpperCase()
            )}
          </div>

          {/* Author info */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold">
              {reply.isAnonymous ? "Anonymous Student" : reply.author}
            </p>
            <p className="text-[10px] text-muted-foreground">{reply.timeAgo}</p>
          </div>

          {/* Solution badge */}
          {reply.isSolution && (
            <Badge className="text-[10px] bg-emerald-500 hover:bg-emerald-500 shrink-0">
              ✓ Solution
            </Badge>
          )}

          {/* Actions menu (flag + moderation) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 text-muted-foreground shrink-0"
                id={`reply-menu-${reply.id}`}
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              {/* Flag — available to ALL users */}
              <DropdownMenuItem onClick={handleFlag}>
                <Flag className="h-3.5 w-3.5 mr-2" />
                Flag Reply
              </DropdownMenuItem>

              {/* Mark as solution — manager who owns this forum */}
              {canMarkSolution && (
                <DropdownMenuItem
                  onClick={() => {
                    onMarkSolution?.();
                    toast(
                      reply.isSolution
                        ? "Solution mark removed."
                        : "Reply marked as solution.",
                    );
                  }}
                >
                  <CheckCircle className="h-3.5 w-3.5 mr-2 text-emerald-600" />
                  {reply.isSolution ? "Unmark Solution" : "Mark as Solution"}
                </DropdownMenuItem>
              )}

              {/* Delete — admin or manager in own course forum */}
              {canDelete && (
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => {
                    onDelete?.();
                    toast("Reply removed.");
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5 mr-2" />
                  Delete Reply
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="px-5 pb-4 space-y-3">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {reply.body}
        </p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <button className="flex items-center gap-1 hover:text-foreground transition-colors">
            <ChevronUp className="h-4 w-4" />
            {reply.upvotes}
          </button>
          <button className="hover:text-foreground transition-colors">
            Reply
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
