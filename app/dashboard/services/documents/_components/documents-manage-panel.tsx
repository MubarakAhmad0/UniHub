"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import {
  MoreHorizontal,
  Search,
  Settings,
  Filter,
  Download,
  CopyX,
  CheckCircle,
  FileUp,
  ListChecks,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type DocRequestAdmin = {
  id: string;
  reference: string;
  student: string;
  docType: string;
  submittedDate: string;
  status: "submitted" | "processing" | "ready" | "collected";
  urgent: boolean;
};

const adminRequests: DocRequestAdmin[] = [
  {
    id: "r1",
    reference: "DOC-2026-0041",
    student: "john.doe_88",
    docType: "Official Transcript",
    submittedDate: "2026-03-20",
    status: "submitted",
    urgent: true,
  },
  {
    id: "r2",
    reference: "DOC-2026-0038",
    student: "amy.w_22",
    docType: "Enrolment Letter",
    submittedDate: "2026-03-25",
    status: "processing",
    urgent: false,
  },
  {
    id: "r3",
    reference: "DOC-2026-0029",
    student: "lee.kh_91",
    docType: "Good Standing Letter",
    submittedDate: "2026-02-10",
    status: "ready",
    urgent: false,
  },
];

export function DocumentsManagePanel() {
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-4 pt-4">
      <Card className="border-0 shadow-sm bg-card">
        <CardHeader className="pb-2 pt-4 px-5 flex flex-row items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Registry & Document Hub
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast("Opening Document Types Config...")}
            >
              <Settings className="mr-2 h-4 w-4" /> Types
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast("Opening Template Manager...")}
            >
              <ListChecks className="mr-2 h-4 w-4" /> Templates
            </Button>
            <Button
              size="sm"
              onClick={() => toast("Opening Bulk Generation wizard...")}
            >
              <Download className="mr-2 h-4 w-4" /> Bulk Gen
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-5 pb-4">
          <Tabs defaultValue="queue">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex gap-2 flex-1">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search standard requests..."
                    className="pl-9 h-9"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
              <TabsList className="h-9">
                <TabsTrigger value="queue" className="text-xs">
                  Request Queue ({adminRequests.length})
                </TabsTrigger>
                <TabsTrigger value="completed" className="text-xs">
                  Collected
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="queue" className="mt-0 border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Document Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminRequests.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-mono text-xs">
                        {r.reference}
                      </TableCell>
                      <TableCell className="font-medium text-sm">
                        {r.student}
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{r.docType}</p>
                        {r.urgent && (
                          <Badge
                            variant="outline"
                            className="text-destructive border-destructive/30 bg-destructive/5 text-[9px] mt-1"
                          >
                            URGENT
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {r.submittedDate}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-[10px]">
                          {r.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                toast("View student & request details")
                              }
                            >
                              Inspect Request
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                toast("Status updated to processing.")
                              }
                            >
                              <CheckCircle className="mr-2 h-4 w-4" /> Mark
                              Processing
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-indigo-600"
                              onClick={() =>
                                toast("Template populated and PDF generated.")
                              }
                            >
                              <Download className="mr-2 h-4 w-4" />{" "}
                              Auto-Generate PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-emerald-600"
                              onClick={() => toast("Upload dialog opened.")}
                            >
                              <FileUp className="mr-2 h-4 w-4" /> Upload
                              Finalised PDF
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => toast("Request rejected.")}
                            >
                              <CopyX className="mr-2 h-4 w-4" /> Reject Request
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="completed">
              <div className="py-8 text-center text-sm text-muted-foreground border rounded-md border-dashed">
                Archive of completed and collected requests.
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
