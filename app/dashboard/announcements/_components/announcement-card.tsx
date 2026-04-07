"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Check,
  MoreHorizontal,
  Pencil,
  Pin,
  PinOff,
  Trash2,
} from "lucide-react";

export type AnnouncementType = "system" | "faculty" | "event";
export type AnnouncementStatus = "published" | "scheduled" | "archived";

export type Announcement = {
  id: number;
  date: string;
  title: string;
  body: string;
  type: AnnouncementType;
  priority: "high" | "normal";
  read: boolean;
  author: string;
  isPinned: boolean;
  status: AnnouncementStatus;
  audience?: string;
  courseCode?: string;
};

const typeLabel: Record<AnnouncementType, string> = {
  system: "System",
  faculty: "Faculty",
  event: "Event",
};

const typeVariant: Record<
  AnnouncementType,
  "default" | "secondary" | "outline"
> = {
  system: "default",
  faculty: "secondary",
  event: "outline",
};

type AnnouncementCardProps = {
  item: Announcement;
  isRead: boolean;
  onToggleRead: (id: number) => void;
  isOwner?: boolean;
  canAdmin?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onPin?: () => void;
  onUnpin?: () => void;
  onArchive?: () => void;
};

export function AnnouncementCard({
  item,
  isRead,
  onToggleRead,
  isOwner = false,
  canAdmin = false,
  onEdit,
  onDelete,
  onPin,
  onUnpin,
  onArchive,
}: AnnouncementCardProps) {
  const showMenu = isOwner || canAdmin;

  return (
    <Card
      className={`shadow-sm border-0 transition-opacity ${
        isRead ? "opacity-60" : ""
      } ${item.isPinned ? "border-l-2 border-l-primary" : ""}`}
    >
      <CardHeader className="pb-2 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 flex-1 min-w-0">
            {/* Pin indicator */}
            {item.isPinned && (
              <div className="flex items-center gap-1 text-primary mb-1">
                <Pin className="h-3 w-3" />
                <span className="text-[10px] font-semibold uppercase tracking-widest">
                  Pinned
                </span>
              </div>
            )}

            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {item.date}
              </p>
              <Badge variant={typeVariant[item.type]} className="text-xs">
                {typeLabel[item.type]}
              </Badge>
              {item.priority === "high" && (
                <Badge variant="destructive" className="text-xs">
                  Priority
                </Badge>
              )}
              {item.courseCode && (
                <Badge variant="outline" className="text-xs font-mono">
                  {item.courseCode}
                </Badge>
              )}
            </div>

            <h2
              className={`text-sm font-semibold leading-snug ${
                isRead ? "font-normal" : ""
              }`}
            >
              {item.title}
            </h2>

            {/* Author byline — shown when there's an author (manager/admin posts) */}
            <p className="text-xs text-muted-foreground">
              Posted by {item.author}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 shrink-0">
            <Button
              size="icon"
              variant={isRead ? "outline" : "ghost"}
              className="h-7 w-7"
              onClick={() => onToggleRead(item.id)}
              id={`read-toggle-${item.id}`}
              title={isRead ? "Mark unread" : "Mark as read"}
            >
              <Check className="h-3.5 w-3.5" />
            </Button>

            {showMenu && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    id={`announcement-menu-${item.id}`}
                  >
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  {(isOwner || canAdmin) && onEdit && (
                    <DropdownMenuItem onClick={onEdit}>
                      <Pencil className="h-3.5 w-3.5 mr-2" />
                      Edit
                    </DropdownMenuItem>
                  )}
                  {canAdmin && (
                    <>
                      {item.isPinned ? (
                        <DropdownMenuItem onClick={onUnpin}>
                          <PinOff className="h-3.5 w-3.5 mr-2" />
                          Unpin
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={onPin}>
                          <Pin className="h-3.5 w-3.5 mr-2" />
                          Pin
                        </DropdownMenuItem>
                      )}
                    </>
                  )}
                  {canAdmin && onArchive && (
                    <DropdownMenuItem onClick={onArchive}>
                      Archive
                    </DropdownMenuItem>
                  )}
                  {(isOwner || canAdmin) && onDelete && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={onDelete}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {item.body}
        </p>
      </CardContent>
    </Card>
  );
}
