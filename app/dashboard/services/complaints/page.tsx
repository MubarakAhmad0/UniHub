"use client";

import { Badge } from "@/components/ui/badge";
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
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  CheckCircle,
  Circle,
  FileWarning,
  MessageSquare,
  Plus,
  ShieldCheck,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth/use-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ComplaintsManagePanel } from "./_components/complaints-manage-panel";

/* ── Mock data ────────────────────────────────────────────────────── */

type CaseType =
  | "academic_appeal"
  | "grade_dispute"
  | "special_consideration"
  | "grievance"
  | "other";
type CaseStatus = "submitted" | "under_review" | "info_requested" | "resolved";
type Outcome = "upheld" | "rejected" | "partially_upheld" | null;

type Message = {
  id: string;
  role: "student" | "admin";
  author: string;
  body: string;
  timeAgo: string;
};

type Case = {
  id: string;
  reference: string;
  type: CaseType;
  title: string;
  description: string;
  courseCode: string | null;
  semester: string | null;
  submittedDate: string;
  status: CaseStatus;
  outcome: Outcome;
  outcomeNote: string | null;
  messages: Message[];
};

const TYPE_LABEL: Record<CaseType, string> = {
  academic_appeal: "Academic Appeal",
  grade_dispute: "Grade Dispute",
  special_consideration: "Special Consideration",
  grievance: "Grievance",
  other: "Other",
};
const TYPE_COLOR: Record<CaseType, string> = {
  academic_appeal: "bg-blue-100 text-blue-700",
  grade_dispute: "bg-amber-100 text-amber-700",
  special_consideration: "bg-purple-100 text-purple-700",
  grievance: "bg-orange-100 text-orange-700",
  other: "bg-muted text-muted-foreground",
};
const STATUS_LABEL: Record<CaseStatus, string> = {
  submitted: "Submitted",
  under_review: "Under Review",
  info_requested: "Info Requested",
  resolved: "Resolved",
};
const STATUS_COLOR: Record<CaseStatus, string> = {
  submitted: "bg-amber-100 text-amber-700",
  under_review: "bg-blue-100 text-blue-700",
  info_requested: "bg-amber-100 text-amber-700 border border-amber-300",
  resolved: "bg-muted text-muted-foreground",
};
const OUTCOME_COLOR: Record<NonNullable<Outcome>, string> = {
  upheld: "bg-emerald-100 text-emerald-800",
  rejected: "bg-destructive/10 text-destructive",
  partially_upheld: "bg-amber-100 text-amber-800",
};

const cases: Case[] = [
  {
    id: "c1",
    reference: "APP-2026-0012",
    type: "academic_appeal",
    title: "Grade Appeal — MTH 301 Final Exam",
    courseCode: "MTH 301",
    semester: "Fall 2024",
    description:
      "I believe my final exam was incorrectly graded. My answer to Question 4 used an alternative valid method equivalent to the model answer, but received 0 marks. I am requesting a re-evaluation by a second marker.",
    submittedDate: "Mar 15, 2026",
    status: "under_review",
    outcome: null,
    outcomeNote: null,
    messages: [
      {
        id: "m1",
        role: "admin",
        author: "Academic Affairs Office",
        body: "Thank you for your submission. We have forwarded this to the course lecturer for review.",
        timeAgo: "Mar 16",
      },
      {
        id: "m2",
        role: "student",
        author: "You",
        body: "Thank you. Please let me know if you need any further documentation.",
        timeAgo: "Mar 17",
      },
    ],
  },
  {
    id: "c2",
    reference: "GRV-2026-0008",
    type: "grievance",
    title: "Facilities Complaint — Air Conditioning in Studio C",
    courseCode: null,
    semester: null,
    description:
      "The air conditioning unit in Studio C (Block 3) has been non-functional for 3 weeks, creating an uncomfortable working environment especially during afternoon sessions.",
    submittedDate: "Mar 28, 2026",
    status: "info_requested",
    outcome: null,
    outcomeNote: null,
    messages: [
      {
        id: "m3",
        role: "admin",
        author: "Facilities Management",
        body: "Please provide the specific dates and times the issue occurred, along with names of any witnesses.",
        timeAgo: "Mar 29",
      },
    ],
  },
  {
    id: "c3",
    reference: "APP-2026-0003",
    type: "special_consideration",
    title: "Special Consideration — Medical Leave Week 8",
    courseCode: null,
    semester: "Fall 2024",
    description:
      "I was hospitalised from Week 8 to Week 9 due to appendicitis. I am requesting special consideration for the assessments I missed during this period.",
    submittedDate: "Feb 20, 2026",
    status: "resolved",
    outcome: "upheld",
    outcomeNote:
      "Decision: Upheld — A supplementary assessment has been scheduled for Apr 10, 2026. Contact your lecturer for details.",
    messages: [],
  },
];

const STEPS: CaseStatus[] = [
  "submitted",
  "under_review",
  "info_requested",
  "resolved",
];

function StepRow({ status }: { status: CaseStatus }) {
  const display = ["submitted", "under_review", "info_requested", "resolved"];
  const currentIdx = display.indexOf(status);
  return (
    <div className="flex items-center gap-1 mt-2 flex-wrap">
      {display.map((step, i) => {
        const done =
          i < currentIdx || (status === "resolved" && i <= currentIdx);
        const active = i === currentIdx;
        return (
          <div key={step} className="flex items-center gap-1">
            <div
              className={`flex items-center gap-1 text-[10px] ${done ? "text-emerald-600" : active ? "text-primary" : "text-muted-foreground/40"}`}
            >
              {done ? (
                <CheckCircle className="h-3 w-3" />
              ) : (
                <Circle className="h-3 w-3" />
              )}
              <span className="capitalize hidden sm:inline">
                {step.replace("_", " ")}
              </span>
            </div>
            {i < display.length - 1 && (
              <div
                className={`w-4 h-px ${done ? "bg-emerald-400" : "bg-muted"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

const CASE_TYPES: { type: CaseType; label: string; desc: string }[] = [
  {
    type: "academic_appeal",
    label: "Academic Appeal",
    desc: "Grade disputes, re-grading requests",
  },
  {
    type: "grade_dispute",
    label: "Grade Dispute",
    desc: "Specific mark disagreement",
  },
  {
    type: "special_consideration",
    label: "Special Consideration",
    desc: "Medical, personal circumstances",
  },
  {
    type: "grievance",
    label: "Grievance",
    desc: "Staff conduct, facilities, process",
  },
];

export default function ComplaintsPage() {
  const { hasRole } = useAuth();
  const isAdmin = hasRole("admin");
  const isManager = hasRole("manager");

  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [newOpen, setNewOpen] = useState(false);
  const [selectedCaseType, setSelectedCaseType] = useState<CaseType | null>(
    null,
  );
  const [replyText, setReplyText] = useState("");
  const [newStep, setNewStep] = useState(1);

  function handleSubmit() {
    setNewOpen(false);
    setNewStep(1);
    setSelectedCaseType(null);
    toast("Case submitted!", {
      description:
        "Reference number: APP-2026-0054 · We'll respond within 5 business days.",
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
              <BreadcrumbPage>Complaints & Appeals</BreadcrumbPage>
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
              Complaints & Appeals
            </h1>
            <p className="text-sm text-muted-foreground">
              Submit formal academic appeals or grievances. All cases are
              tracked and responded to.
            </p>
          </div>
          <Button onClick={() => setNewOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Submit New Case
          </Button>
        </div>

        <Tabs defaultValue="my">
          <TabsList className="h-8 mb-4">
            <TabsTrigger value="my" className="text-xs">
              My Complaints
            </TabsTrigger>
            {isManager && (
              <TabsTrigger value="course" className="text-xs">
                Course Feedback
              </TabsTrigger>
            )}
            {isAdmin && (
              <TabsTrigger value="manage" className="text-xs">
                Manage
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="my" className="mt-0">
            <div className="space-y-3">
              {cases.length === 0 && (
                <div className="py-16 text-center text-sm text-muted-foreground">
                  <FileWarning className="h-10 w-10 mx-auto mb-3 text-muted-foreground/30" />
                  No cases submitted yet.
                </div>
              )}
              {cases.map((c) => (
                <Card
                  key={c.id}
                  className={`border-0 shadow-sm bg-card cursor-pointer hover:shadow transition-shadow ${c.status === "info_requested" ? "ring-1 ring-amber-300" : ""}`}
                  onClick={() => setSelectedCase(c)}
                >
                  <CardContent className="px-5 py-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded font-medium ${TYPE_COLOR[c.type]}`}
                          >
                            {TYPE_LABEL[c.type]}
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded font-medium ${STATUS_COLOR[c.status]}`}
                          >
                            {STATUS_LABEL[c.status]}
                          </span>
                          {c.messages.some((m) => m.role === "admin") &&
                            c.status !== "resolved" && (
                              <Badge
                                variant="secondary"
                                className="text-[10px]"
                              >
                                {
                                  c.messages.filter((m) => m.role === "admin")
                                    .length
                                }{" "}
                                message
                                {c.messages.filter((m) => m.role === "admin")
                                  .length > 1
                                  ? "s"
                                  : ""}
                              </Badge>
                            )}
                        </div>
                        <p className="font-semibold text-sm mt-1">{c.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {c.reference} · Submitted {c.submittedDate}
                        </p>
                        {c.status !== "resolved" && (
                          <StepRow status={c.status} />
                        )}
                        {c.outcome && (
                          <div
                            className={`mt-2 text-xs px-2 py-1 rounded ${OUTCOME_COLOR[c.outcome]}`}
                          >
                            {c.outcomeNote}
                          </div>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant={
                          c.status === "info_requested" ? "default" : "outline"
                        }
                        className="text-xs shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCase(c);
                        }}
                      >
                        {c.status === "info_requested"
                          ? "Respond"
                          : "View Case"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {isManager && (
            <TabsContent value="course" className="mt-0">
              <div className="space-y-3">
                {cases
                  .filter((c) => c.courseCode === "MTH 301")
                  .map((c) => (
                    <Card
                      key={c.id}
                      className="border-0 shadow-sm bg-card cursor-pointer hover:shadow transition-shadow"
                      onClick={() => setSelectedCase(c)}
                    >
                      <CardContent className="px-5 py-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded font-medium ${TYPE_COLOR[c.type]}`}
                              >
                                {TYPE_LABEL[c.type]}
                              </span>
                              <Badge variant="outline" className="text-[10px]">
                                Reference: {c.reference}
                              </Badge>
                            </div>
                            <p className="font-semibold text-sm mt-1">
                              Course Feedback against {c.courseCode}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {c.description}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCase(c);
                            }}
                          >
                            Review & Respond
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          )}

          {isAdmin && (
            <TabsContent value="manage" className="mt-0">
              <ComplaintsManagePanel />
            </TabsContent>
          )}
        </Tabs>
      </main>

      {/* Case detail sheet */}
      <Sheet open={!!selectedCase} onOpenChange={() => setSelectedCase(null)}>
        <SheetContent className="sm:max-w-lg overflow-y-auto flex flex-col">
          {selectedCase && (
            <>
              <SheetHeader>
                <div className="flex gap-2 flex-wrap">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-medium ${TYPE_COLOR[selectedCase.type]}`}
                  >
                    {TYPE_LABEL[selectedCase.type]}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-medium ${STATUS_COLOR[selectedCase.status]}`}
                  >
                    {STATUS_LABEL[selectedCase.status]}
                  </span>
                </div>
                <SheetTitle className="text-base leading-snug mt-1">
                  {selectedCase.title}
                </SheetTitle>
                <p className="text-xs text-muted-foreground">
                  {selectedCase.reference} · Submitted{" "}
                  {selectedCase.submittedDate}
                </p>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto space-y-5 mt-5 text-sm">
                {/* Student statement */}
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-2">
                    Your Statement
                  </p>
                  <p className="text-muted-foreground leading-relaxed bg-muted/20 p-3 rounded-md">
                    {selectedCase.description}
                  </p>
                </div>

                {/* Outcome */}
                {selectedCase.outcome && (
                  <div
                    className={`p-3 rounded-md text-sm ${OUTCOME_COLOR[selectedCase.outcome]}`}
                  >
                    <p className="font-semibold capitalize">
                      {selectedCase.outcome.replace("_", " ")}
                    </p>
                    {selectedCase.outcomeNote && (
                      <p className="mt-1 text-xs">{selectedCase.outcomeNote}</p>
                    )}
                  </div>
                )}

                {/* Info requested notice */}
                {selectedCase.status === "info_requested" && (
                  <div className="border-l-2 border-amber-400 bg-amber-50 text-amber-800 p-3 rounded-sm text-xs">
                    Admin has requested additional information — please reply
                    below.
                  </div>
                )}

                {/* Message thread */}
                {selectedCase.messages.length > 0 && (
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-3">
                      Messages
                    </p>
                    <div className="space-y-3">
                      {selectedCase.messages.map((m) => (
                        <div
                          key={m.id}
                          className={`flex gap-2 ${m.role === "student" ? "flex-row-reverse" : ""}`}
                        >
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${m.role === "admin" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                          >
                            {m.role === "admin" ? "A" : "Y"}
                          </div>
                          <div
                            className={`max-w-[80%] rounded-md p-3 text-xs ${m.role === "admin" ? "bg-muted" : "bg-primary/10"}`}
                          >
                            <p className="font-semibold mb-0.5">
                              {m.author}{" "}
                              <span className="font-normal text-muted-foreground">
                                · {m.timeAgo}
                              </span>
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                              {m.body}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {isAdmin && (
                <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mt-4">
                  <p className="text-[10px] uppercase tracking-widest text-amber-800 font-bold flex items-center gap-1 mb-2">
                    <ShieldCheck className="h-3 w-3" /> Admin Tools
                  </p>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-white text-xs border-amber-300"
                      >
                        <UserPlus className="h-3 w-3 mr-1" /> Assign Staff
                      </Button>
                    </div>
                    <div>
                      <Label className="text-[10px] text-amber-800">
                        Internal Notes (Hidden from Student)
                      </Label>
                      <Textarea
                        placeholder="Add a private note..."
                        className="h-16 text-xs bg-white border-amber-300 mt-1"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Reply box */}
              {selectedCase.status !== "resolved" && (
                <div className="border-t pt-4 space-y-2 mt-4">
                  <Textarea
                    placeholder={
                      isManager
                        ? "Submit formal lecturer response..."
                        : "Write a reply..."
                    }
                    rows={2}
                    className="resize-none text-sm"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <div className="flex justify-end pr-1">
                    <span className="text-[10px] text-muted-foreground mr-auto mt-2">
                      {isManager
                        ? "Response will be sent privately to Admin."
                        : "Visible to administration."}
                    </span>
                    <Button
                      size="sm"
                      disabled={!replyText.trim()}
                      onClick={() => {
                        setReplyText("");
                        toast(
                          isManager
                            ? "Lecturer Response Submitted."
                            : "Reply sent.",
                        );
                      }}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      {isManager ? "Submit Response" : "Send Reply"}
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* New case sheet — 2 steps */}
      <Sheet
        open={newOpen}
        onOpenChange={(open) => {
          if (!open) {
            setNewOpen(false);
            setNewStep(1);
            setSelectedCaseType(null);
          }
        }}
      >
        <SheetContent className="sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Submit New Case — Step {newStep} of 2</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-4 text-sm">
            {newStep === 1 && (
              <>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Select Case Type
                </p>
                <div className="grid gap-2">
                  {CASE_TYPES.map((ct) => (
                    <button
                      key={ct.type}
                      onClick={() => setSelectedCaseType(ct.type)}
                      className={`text-left p-3 rounded-md border transition-colors ${selectedCaseType === ct.type ? "border-primary bg-primary/5" : "border-border/40 hover:bg-muted/50"}`}
                    >
                      <p className="font-semibold text-sm">{ct.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {ct.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </>
            )}
            {newStep === 2 && (
              <>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {CASE_TYPES.find((t) => t.type === selectedCaseType)?.label}
                </p>
                <div className="space-y-1.5">
                  <Label>Title</Label>
                  <Input placeholder="Brief title for your case" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Related Course (optional)</Label>
                    <Input placeholder="e.g. MTH 301" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Semester (optional)</Label>
                    <Input placeholder="e.g. Fall 2024" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Detailed Description</Label>
                  <Textarea
                    placeholder="Describe your case in detail. Include dates, evidence, and supporting context..."
                    rows={5}
                    className="resize-none"
                  />
                </div>
                <div className="text-xs text-muted-foreground bg-muted/40 p-3 rounded">
                  ⚠️ Submissions are formal records and cannot be deleted after
                  submission.
                </div>
              </>
            )}
          </div>
          <SheetFooter className="mt-6">
            {newStep === 1 ? (
              <>
                <Button variant="outline" onClick={() => setNewOpen(false)}>
                  Cancel
                </Button>
                <Button
                  disabled={!selectedCaseType}
                  onClick={() => setNewStep(2)}
                >
                  Next →
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setNewStep(1)}>
                  ← Back
                </Button>
                <Button onClick={handleSubmit}>Submit Case</Button>
              </>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
