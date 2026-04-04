"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MoreHorizontal,
  Pencil,
  Pin,
  PinOff,
  Archive,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Announcement } from "./announcement-card";

const STATUS_VARIANT: Record<
  Announcement["status"],
  "default" | "secondary" | "outline" | "destructive"
> = {
  published: "default",
  scheduled: "secondary",
  archived: "outline",
};

type ManageTabProps = {
  announcements: Announcement[];
  onEdit: (item: Announcement) => void;
  onDelete: (id: number) => void;
  onTogglePin: (id: number) => void;
  onArchive: (id: number) => void;
};

export function ManageTab({
  announcements,
  onEdit,
  onDelete,
  onTogglePin,
  onArchive,
}: ManageTabProps) {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const filtered = announcements.filter((a) => {
    const matchSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.author.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "all" || a.type === filterType;
    const matchStatus = filterStatus === "all" || a.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex flex-wrap gap-3">
        <Input
          id="manage-search"
          placeholder="Search announcements…"
          className="max-w-xs h-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-36 h-9">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="system">System</SelectItem>
            <SelectItem value="faculty">Faculty</SelectItem>
            <SelectItem value="event">Event</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-36 h-9">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground self-center ml-auto">
          {filtered.length} of {announcements.length} announcements
        </p>
      </div>

      {/* Table */}
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="w-[40%]">Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Pinned</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-10 text-muted-foreground text-sm"
                >
                  No announcements match your filters.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((item) => (
                <TableRow key={item.id} className="group">
                  <TableCell className="font-medium text-sm">
                    {item.title}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs capitalize">
                      {item.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {item.author}
                  </TableCell>
                  <TableCell>
                    {item.priority === "high" ? (
                      <Badge variant="destructive" className="text-xs">
                        High
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {item.isPinned ? (
                      <Badge className="text-xs bg-primary/15 text-primary hover:bg-primary/20">
                        Pinned
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={STATUS_VARIANT[item.status]}
                      className="text-xs capitalize"
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {item.date}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                          id={`manage-menu-${item.id}`}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => onEdit(item)}>
                          <Pencil className="h-3.5 w-3.5 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            onTogglePin(item.id);
                            toast.success(
                              item.isPinned
                                ? "Announcement unpinned."
                                : "Announcement pinned.",
                            );
                          }}
                        >
                          {item.isPinned ? (
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
                            onArchive(item.id);
                            toast.success("Announcement archived.");
                          }}
                        >
                          <Archive className="h-3.5 w-3.5 mr-2" />
                          Archive
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            onDelete(item.id);
                            toast.success("Announcement deleted.");
                          }}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
