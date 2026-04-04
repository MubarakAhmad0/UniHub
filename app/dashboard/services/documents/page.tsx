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
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { toast } from "sonner";
import {
  Check,
  CheckCircle,
  Circle,
  Clock,
  Download,
  FileText,
  Plus,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth/use-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentsManagePanel } from "./_components/documents-manage-panel";
import { StaffDocumentsPanel } from "./_components/staff-documents-panel";

/* ── Mock data ────────────────────────────────────────────────────── */

type RequestStatus =
  | "submitted"
  | "processing"
  | "ready"
  | "collected"
  | "rejected";

type DocRequest = {
  id: string;
  docType: string;
  reference: string;
  submittedDate: string;
  purpose: string;
  status: RequestStatus;
  estReady: string | null;
  adminNote: string | null;
  documentUrl: string | null;
};

const STEPS: RequestStatus[] = [
  "submitted",
  "processing",
  "ready",
  "collected",
];

const docTypes = [
  { id: "transcript", name: "Official Transcript", fee: 10, days: 5 },
  { id: "enrolment", name: "Enrolment Verification Letter", fee: 0, days: 3 },
  { id: "good_standing", name: "Good Standing Letter", fee: 0, days: 3 },
  { id: "graduation", name: "Graduation Certificate", fee: 20, days: 10 },
  { id: "moi", name: "Medium of Instruction Letter", fee: 0, days: 5 },
  { id: "completion", name: "Completion Letter", fee: 0, days: 5 },
];

const myRequests: DocRequest[] = [
  {
    id: "r1",
    docType: "Official Transcript",
    reference: "DOC-2026-0041",
    submittedDate: "Mar 20, 2026",
    purpose: "Scholarship application — JASSO Japan",
    status: "ready",
    estReady: "Mar 27, 2026",
    adminNote: null,
    documentUrl: "#",
  },
  {
    id: "r2",
    docType: "Enrolment Verification Letter",
    reference: "DOC-2026-0038",
    submittedDate: "Mar 25, 2026",
    purpose: "Visa application — Embassy of Japan",
    status: "processing",
    estReady: "Apr 4, 2026",
    adminNote: null,
    documentUrl: null,
  },
  {
    id: "r3",
    docType: "Good Standing Letter",
    reference: "DOC-2026-0029",
    submittedDate: "Feb 10, 2026",
    purpose: "Exchange programme at TU Berlin",
    status: "collected",
    estReady: null,
    adminNote: null,
    documentUrl: null,
  },
  {
    id: "r4",
    docType: "Medium of Instruction Letter",
    reference: "DOC-2026-0051",
    submittedDate: "Apr 2, 2026",
    purpose: "Postgraduate application",
    status: "submitted",
    estReady: "Apr 9, 2026",
    adminNote: null,
    documentUrl: null,
  },
];

const STATUS_LABEL: Record<RequestStatus, string> = {
  submitted: "Submitted",
  processing: "Processing",
  ready: "Ready",
  collected: "Collected",
  rejected: "Rejected",
};
const STATUS_COLOR: Record<RequestStatus, string> = {
  submitted: "bg-amber-100 text-amber-700",
  processing: "bg-blue-100 text-blue-700",
  ready: "bg-emerald-100 text-emerald-700",
  collected: "bg-muted text-muted-foreground",
  rejected: "bg-destructive/10 text-destructive",
};

function StepRow({ status }: { status: RequestStatus }) {
  const steps = ["submitted", "processing", "ready", "collected"];
  const currentIdx = steps.indexOf(status);
  return (
    <div className="flex items-center gap-1 mt-2">
      {steps.map((step, i) => {
        const done = i < currentIdx;
        const active = i === currentIdx;
        return (
          <div key={step} className="flex items-center gap-1">
            <div
              className={`flex items-center gap-1 text-[10px] font-medium ${done ? "text-emerald-600" : active ? "text-primary" : "text-muted-foreground/50"}`}
            >
              {done ? (
                <CheckCircle className="h-3.5 w-3.5" />
              ) : active ? (
                <Circle className="h-3.5 w-3.5 fill-primary/20 text-primary" />
              ) : (
                <Circle className="h-3.5 w-3.5" />
              )}
              <span className="capitalize">{step.replace("_", " ")}</span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`w-4 h-px ${i < currentIdx ? "bg-emerald-400" : "bg-muted"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function DocumentsPage() {
  const { hasRole } = useAuth();
  const isAdmin = hasRole("admin");
  const isManager = hasRole("manager");

  const [newOpen, setNewOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [step, setStep] = useState(1);

  function handleSubmit() {
    setNewOpen(false);
    setStep(1);
    setSelectedType(null);
    toast("Document request submitted!", {
      description: "Estimated ready in 3–5 working days.",
    });
  }

  return (
    <div className="flex flex-col min-h-svh">
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
              <BreadcrumbPage>Document Requests</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <main className="flex-1 p-6 lg:p-8 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-0.5">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Admin & Services
            </p>
            <h1 className="text-3xl font-bold tracking-tight">
              Document Requests
            </h1>
            <p className="text-sm text-muted-foreground">
              Request official university documents without visiting the admin
              counter.
            </p>
          </div>
          <Button onClick={() => setNewOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Request
          </Button>
        </div>

        {/* Request list */}
        <Tabs defaultValue="my">
          <TabsList className="h-8 mb-4">
            <TabsTrigger value="my" className="text-xs">
              My Requests
            </TabsTrigger>
            {isManager && (
              <TabsTrigger value="staff" className="text-xs">
                Staff Docs
              </TabsTrigger>
            )}
            {isAdmin && (
              <TabsTrigger value="manage" className="text-xs">
                Manage
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="my" className="mt-0 space-y-3">
            {myRequests.length === 0 && (
              <div className="py-16 text-center text-sm text-muted-foreground">
                <FileText className="h-10 w-10 mx-auto mb-3 text-muted-foreground/30" />
                No requests yet — your documents will appear here.
              </div>
            )}
            {myRequests.map((req) => (
              <Card key={req.id} className="border-0 shadow-sm bg-card">
                <CardContent className="px-5 py-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-sm">{req.docType}</p>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-medium ${STATUS_COLOR[req.status]}`}
                        >
                          {STATUS_LABEL[req.status]}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {req.reference} · Submitted {req.submittedDate}
                        {req.estReady && ` · Est. ready: ${req.estReady}`}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Purpose: {req.purpose}
                      </p>
                      {req.status !== "rejected" && (
                        <StepRow status={req.status} />
                      )}
                      {req.adminNote && (
                        <p className="text-xs text-destructive mt-1">
                          Admin: {req.adminNote}
                        </p>
                      )}
                    </div>
                    <div>
                      {req.status === "ready" && req.documentUrl && (
                        <Button size="sm" asChild>
                          <a href={req.documentUrl} download>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </a>
                        </Button>
                      )}
                      {req.status === "processing" && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          Processing
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {isManager && (
            <TabsContent value="staff" className="mt-0">
              <StaffDocumentsPanel />
            </TabsContent>
          )}

          {isAdmin && (
            <TabsContent value="manage" className="mt-0">
              <DocumentsManagePanel />
            </TabsContent>
          )}
        </Tabs>
      </main>

      {/* New request dialog (2 steps) */}
      <Dialog
        open={newOpen}
        onOpenChange={(open) => {
          if (!open) {
            setNewOpen(false);
            setStep(1);
            setSelectedType(null);
          }
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>New Document Request — Step {step} of 2</DialogTitle>
          </DialogHeader>

          {step === 1 && (
            <div className="space-y-3 py-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Select Document Type
              </p>
              <div className="grid grid-cols-2 gap-2">
                {docTypes.map((dt) => (
                  <button
                    key={dt.id}
                    onClick={() => setSelectedType(dt.id)}
                    className={`text-left p-3 rounded-md border transition-colors ${selectedType === dt.id ? "border-primary bg-primary/5" : "border-border/40 hover:bg-muted/50"}`}
                  >
                    <div className="flex items-start gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold leading-snug">
                          {dt.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {dt.fee > 0 ? `RM ${dt.fee}` : "Free"} · {dt.days}{" "}
                          working days
                        </p>
                      </div>
                    </div>
                    {selectedType === dt.id && (
                      <Check className="h-3 w-3 text-primary ml-auto mt-1" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3 py-2 text-sm">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                {docTypes.find((d) => d.id === selectedType)?.name}
              </p>
              <div className="space-y-1.5">
                <Label>Purpose</Label>
                <Input placeholder="e.g. Scholarship application — JASSO Japan" />
              </div>
              <div className="space-y-1.5">
                <Label>Addressed To (optional)</Label>
                <Input placeholder="e.g. Embassy of Japan" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Number of Copies</Label>
                  <Input type="number" defaultValue={1} min={1} />
                </div>
                <div className="space-y-1.5">
                  <Label>Urgency</Label>
                  <select className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm">
                    <option>Normal</option>
                    <option>Urgent (+RM15)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            {step === 1 ? (
              <>
                <Button variant="outline" onClick={() => setNewOpen(false)}>
                  Cancel
                </Button>
                <Button disabled={!selectedType} onClick={() => setStep(2)}>
                  Next →
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setStep(1)}>
                  ← Back
                </Button>
                <Button onClick={handleSubmit}>Submit Request</Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
