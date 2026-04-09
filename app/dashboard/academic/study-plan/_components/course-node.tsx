import { Badge } from "@/components/ui/badge";
import { Handle, Position } from "@xyflow/react";
import { BookOpen } from "lucide-react";

export interface CourseNodeData {
  code: string;
  title: string;
  credits: number;
  status: string;
}

const statusVariant: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  Completed: "secondary",
  "In Progress": "default",
  "At Risk": "destructive",
  Planned: "outline",
};

export function CourseNode(props: any) {
  const nodeData = props.data as CourseNodeData;
  return (
    <div className="group relative min-w-[180px] rounded-lg border-2 bg-card shadow-sm transition-all hover:shadow-md">
      {/* Left handle for incoming edges */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !border-2 !bg-background"
      />

      {/* Status indicator bar */}
      <div
        className="absolute left-0 top-0 h-full w-1 rounded-l-lg"
        style={{
          backgroundColor:
            nodeData.status === "Completed"
              ? "hsl(228 13% 40%)"
              : nodeData.status === "In Progress"
                ? "hsl(228 78% 65%)"
                : nodeData.status === "At Risk"
                  ? "hsl(2 43% 43%)"
                  : "hsl(197 9% 70%)",
        }}
      />

      <div className="flex flex-col gap-2 p-3 pl-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2">
            <BookOpen className="mt-0.5 h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {nodeData.code}
              </p>
              <p className="text-sm font-medium leading-snug">
                {nodeData.title}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {nodeData.credits} credits
          </p>
          <Badge
            variant={statusVariant[nodeData.status] ?? "outline"}
            className="text-xs"
          >
            {nodeData.status}
          </Badge>
        </div>
      </div>

      {/* Right handle for outgoing edges */}
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !border-2 !bg-background"
      />
    </div>
  );
}
