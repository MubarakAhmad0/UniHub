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
import { Archive, MoreHorizontal, Pencil, Trash2, UserCog } from "lucide-react";
import { toast } from "sonner";
import type { Course, CourseStatus } from "./course-card";

const STATUS_VARIANT: Record<
  CourseStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  Open: "default",
  Limited: "secondary",
  Full: "destructive",
  Closed: "outline",
};

type CoursesTableProps = {
  courses: Course[];
  onEdit: (course: Course) => void;
  onDelete: (id: number) => void;
  onArchive: (id: number) => void;
  onAssignLecturer: (course: Course) => void;
};

export function CoursesTable({
  courses,
  onEdit,
  onDelete,
  onArchive,
  onAssignLecturer,
}: CoursesTableProps) {
  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40">
            <TableHead>Code</TableHead>
            <TableHead className="w-[25%]">Title</TableHead>
            <TableHead>Faculty</TableHead>
            <TableHead>Level</TableHead>
            <TableHead>Lecturer</TableHead>
            <TableHead>Seats</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-center py-10 text-sm text-muted-foreground"
              >
                No courses match your filters.
              </TableCell>
            </TableRow>
          )}
          {courses.map((c) => (
            <TableRow key={c.id} className="group">
              <TableCell className="font-mono text-xs font-semibold">
                {c.code}
              </TableCell>
              <TableCell className="font-medium text-sm">{c.title}</TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {c.faculty}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="text-xs">
                  {c.level}
                </Badge>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {c.lecturer}
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {c.enrolledCount} / {c.seats.total}
              </TableCell>
              <TableCell>
                <Badge variant={STATUS_VARIANT[c.status]} className="text-xs">
                  {c.status}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                      id={`table-menu-${c.id}`}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem onClick={() => onEdit(c)}>
                      <Pencil className="h-3.5 w-3.5 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onAssignLecturer(c)}>
                      <UserCog className="h-3.5 w-3.5 mr-2" />
                      Assign Lecturer
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        onArchive(c.id);
                        toast.success("Course archived.");
                      }}
                    >
                      <Archive className="h-3.5 w-3.5 mr-2" />
                      Archive
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => {
                        onDelete(c.id);
                        toast.success("Course deleted.");
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
