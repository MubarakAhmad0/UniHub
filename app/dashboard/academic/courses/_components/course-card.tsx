"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Archive,
  UserCog,
  Users,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export type CourseStatus = "Open" | "Limited" | "Full" | "Closed";

export type Course = {
  id: number;
  code: string;
  title: string;
  description: string;
  faculty: string;
  level: "Undergraduate" | "Graduate";
  credits: number;
  seats: { available: number; total: number };
  enrolledCount: number;
  prerequisites: string[];
  hasPrerequisites: boolean;
  status: CourseStatus;
  lecturer: string;
};

const STATUS_VARIANT: Record<
  CourseStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  Open: "default",
  Limited: "secondary",
  Full: "destructive",
  Closed: "outline",
};

type CourseCardProps = {
  course: Course;
  isTeaching?: boolean;
  canAdmin?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onArchive?: () => void;
  onAssignLecturer?: () => void;
};

export function CourseCard({
  course,
  isTeaching = false,
  canAdmin = false,
  onEdit,
  onDelete,
  onArchive,
  onAssignLecturer,
}: CourseCardProps) {
  const isEnrollable =
    course.status !== "Full" &&
    course.status !== "Closed" &&
    course.hasPrerequisites;

  return (
    <Card className="flex flex-col bg-card shadow-sm border-0">
      <CardHeader className="pb-3 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-0.5 flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {course.code} · {course.credits} Credits
            </p>
            <h2 className="text-base font-semibold leading-snug">
              {course.title}
            </h2>
            {/* Lecturer name — always shown to everyone */}
            <p className="text-xs text-muted-foreground">{course.lecturer}</p>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {/* Teaching badge */}
            {isTeaching && (
              <Badge className="text-[10px] bg-primary/15 text-primary hover:bg-primary/20 border-0">
                Teaching
              </Badge>
            )}
            <Badge variant={STATUS_VARIANT[course.status]}>
              {course.status}
            </Badge>

            {/* Admin three-dot menu */}
            {canAdmin && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    id={`course-menu-${course.id}`}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem onClick={onEdit}>
                    <Pencil className="h-3.5 w-3.5 mr-2" />
                    Edit Course
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onAssignLecturer}>
                    <UserCog className="h-3.5 w-3.5 mr-2" />
                    Assign Lecturer
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      onArchive?.();
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
                      onDelete?.();
                      toast.success("Course deleted.");
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

        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline">{course.faculty}</Badge>
          <Badge variant="outline">{course.level}</Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pt-0">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {course.description}
        </p>

        {course.prerequisites.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Prerequisites
            </p>
            <div className="flex gap-1.5 flex-wrap">
              {course.prerequisites.map((p) => (
                <Badge
                  key={p}
                  variant={
                    course.hasPrerequisites ? "secondary" : "destructive"
                  }
                  className="text-xs"
                >
                  {p}
                </Badge>
              ))}
            </div>
            {!course.hasPrerequisites && (
              <p className="text-xs text-destructive mt-1">
                Missing prerequisites
              </p>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-4 border-t flex items-center justify-between">
        {/* Seat display — manager teaching view shows enrolled count */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Users className="h-3.5 w-3.5" />
          {isTeaching ? (
            <span>
              {course.enrolledCount} enrolled / {course.seats.total} seats
            </span>
          ) : (
            <span>
              {course.seats.available} / {course.seats.total} seats
            </span>
          )}
        </div>

        {/* Footer action — different per role */}
        {isTeaching ? (
          <Button size="sm" variant="outline" asChild>
            <Link href="/dashboard/academic/my-courses">
              <ExternalLink className="h-3.5 w-3.5 mr-1" />
              Manage Course
            </Link>
          </Button>
        ) : (
          <Button
            size="sm"
            variant={course.status === "Full" ? "secondary" : "default"}
            disabled={!isEnrollable}
            id={`enroll-${course.id}`}
          >
            {course.status === "Full" ? "Join Waitlist" : "Enroll"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
