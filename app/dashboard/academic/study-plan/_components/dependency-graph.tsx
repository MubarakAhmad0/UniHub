"use client";

import React from "react";
import {
  ReactFlow,
  Controls,
  Background,
  MarkerType,
  useNodesState,
  useEdgesState,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { CourseNode } from "./course-node";

/* ── Course data ── */
const coursesData = [
  {
    id: "CS101",
    code: "CS 101",
    title: "Intro to Computing",
    credits: 3,
    status: "Completed",
  },
  {
    id: "MTH101",
    code: "MTH 101",
    title: "Calculus I",
    credits: 3,
    status: "Completed",
  },
  {
    id: "CS102",
    code: "CS 102",
    title: "Data Structures",
    credits: 3,
    status: "Completed",
  },
  {
    id: "MTH102",
    code: "MTH 102",
    title: "Calculus II",
    credits: 3,
    status: "Completed",
  },
  {
    id: "CS201",
    code: "CS 201",
    title: "Algorithms",
    credits: 3,
    status: "Completed",
  },
  {
    id: "MTH201",
    code: "MTH 201",
    title: "Linear Algebra",
    credits: 3,
    status: "Completed",
  },
  {
    id: "CS105",
    code: "CS 105",
    title: "Data Structures (Advanced)",
    credits: 4,
    status: "At Risk",
  },
  {
    id: "MTH301",
    code: "MTH 301",
    title: "Advanced Calculus II",
    credits: 3,
    status: "In Progress",
  },
  {
    id: "CS401",
    code: "CS 401",
    title: "Machine Learning",
    credits: 4,
    status: "Planned",
  },
  {
    id: "CS410",
    code: "CS 410",
    title: "Database Systems",
    credits: 3,
    status: "Planned",
  },
  {
    id: "AI210",
    code: "AI 210",
    title: "Ethics in AI",
    credits: 2,
    status: "Planned",
  },
];

const dependencies = [
  { from: "CS101", to: "CS102" },
  { from: "MTH101", to: "MTH102" },
  { from: "CS102", to: "CS201" },
  { from: "MTH102", to: "MTH201" },
  { from: "CS201", to: "CS105" },
  { from: "MTH201", to: "MTH301" },
  { from: "CS105", to: "CS401" },
  { from: "MTH301", to: "CS401" },
  { from: "CS105", to: "CS410" },
];

/* ── Layout calculation ── */
function calculateLayout(nodes: typeof coursesData) {
  const levels: Map<string, number> = new Map();
  const adjacency: Map<string, string[]> = new Map();

  nodes.forEach((n) => {
    adjacency.set(n.id, []);
    levels.set(n.id, 0);
  });

  dependencies.forEach(({ from, to }) => {
    adjacency.get(from)?.push(to);
  });

  // BFS to calculate levels
  const queue = nodes.filter((n) => !dependencies.some((d) => d.to === n.id));
  queue.forEach((n) => levels.set(n.id, 0));

  let head = 0;
  while (head < queue.length) {
    const current = queue[head++];
    const currentLevel = levels.get(current.id) ?? 0;

    adjacency.get(current.id)?.forEach((neighbor) => {
      const neighborLevel = levels.get(neighbor) ?? 0;
      if (neighborLevel <= currentLevel) {
        levels.set(neighbor, currentLevel + 1);
      }
      queue.push(nodes.find((n) => n.id === neighbor)!);
    });
  }

  // Group by level
  const levelGroups: Map<number, typeof coursesData> = new Map();
  levels.forEach((level, id) => {
    if (!levelGroups.has(level)) levelGroups.set(level, []);
    levelGroups.get(level)?.push(nodes.find((n) => n.id === id)!);
  });

  // Calculate positions
  const positions: Map<string, { x: number; y: number }> = new Map();
  const levelSpacing = 250;
  const nodeSpacing = 120;

  levelGroups.forEach((group, level) => {
    const totalHeight = (group.length - 1) * nodeSpacing;
    const startY = -totalHeight / 2;

    group.forEach((node, index) => {
      positions.set(node.id, {
        x: level * levelSpacing,
        y: startY + index * nodeSpacing,
      });
    });
  });

  return positions;
}

const nodeTypes = {
  courseNode: CourseNode as React.ComponentType<any>,
};

export function DependencyGraph() {
  const positions = calculateLayout(coursesData);

  const initialNodes = coursesData.map((course) => ({
    id: course.id,
    type: "courseNode" as const,
    position: positions.get(course.id) ?? { x: 0, y: 0 },
    data: {
      code: course.code,
      title: course.title,
      credits: course.credits,
      status: course.status,
    },
  }));

  const initialEdges: Edge[] = dependencies.map(({ from, to }) => ({
    id: `${from}-${to}`,
    source: from,
    target: to,
    sourceHandle: null,
    targetHandle: null,
    type: "default",
    style: { stroke: "hsl(228 13% 60%)", strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "hsl(228 13% 60%)",
    },
  }));

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="h-[600px] rounded-lg border bg-muted/30">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        panOnDrag
        zoomOnScroll
        zoomOnPinch
        panOnScroll={false}
        preventScrolling={false}
        minZoom={0.2}
        maxZoom={2}
      >
        <Background color="hsl(228 13% 80%)" gap={20} size={1} />
        <Controls
          className="!bg-background !border !border-border !shadow-sm"
          showInteractive={false}
        />
      </ReactFlow>
    </div>
  );
}
