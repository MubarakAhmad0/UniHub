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
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Backpack,
  Key,
  Laptop,
  Search,
  Shirt,
  SmartphoneIcon,
} from "lucide-react";
import { useState } from "react";

/* ── Types & mock data ────────────────────────────────────────────── */

type ReportType = "lost" | "found";
type ReportStatus = "open" | "claimed" | "resolved";
type Category =
  | "electronics"
  | "id_card"
  | "clothing"
  | "keys"
  | "bag"
  | "stationery"
  | "other";

type Report = {
  id: string;
  type: ReportType;
  category: Category;
  title: string;
  description: string;
  location: string;
  date: string;
  status: ReportStatus;
  isOwn?: boolean;
};

const CATEGORIES_ALL = [
  "All",
  "Electronics",
  "ID Card",
  "Clothing",
  "Keys",
  "Bag",
  "Other",
];

const catIcon: Record<Category, React.ElementType> = {
  electronics: SmartphoneIcon,
  id_card: SmartphoneIcon,
  clothing: Shirt,
  keys: Key,
  bag: Backpack,
  stationery: Laptop,
  other: SmartphoneIcon,
};

const reports: Report[] = [
  {
    id: "1",
    type: "lost",
    category: "electronics",
    title: "Black Samsung Phone",
    description:
      "Cracked screen protector, blue silicone case. Lost near Block C Canteen around 2:30pm.",
    location: "Block C Canteen",
    date: "Apr 1, 2026",
    status: "open",
  },
  {
    id: "2",
    type: "lost",
    category: "id_card",
    title: "Student ID Card",
    description: "ID card for student in Architecture faculty.",
    location: "Library Level 2",
    date: "Mar 31, 2026",
    status: "open",
  },
  {
    id: "3",
    type: "lost",
    category: "bag",
    title: "Blue Backpack",
    description: "Navy blue Kipling backpack with yellow keychain.",
    location: "Lecture Theatre 2",
    date: "Mar 30, 2026",
    status: "claimed",
  },
  {
    id: "4",
    type: "lost",
    category: "electronics",
    title: "AirPods Case (White)",
    description: "White AirPods Gen 3 case, no AirPods inside.",
    location: "Cafeteria",
    date: "Apr 2, 2026",
    status: "open",
  },
  {
    id: "5",
    type: "lost",
    category: "clothing",
    title: "Lab Coat",
    description: "Size S lab coat with name tag 'Ahmad'.",
    location: "Biology Lab B",
    date: "Mar 28, 2026",
    status: "resolved",
    isOwn: true,
  },
  {
    id: "6",
    type: "lost",
    category: "keys",
    title: "Keychain with 3 keys",
    description: "Blue whale keychain with 3 keys — looks like dorm keys.",
    location: "Parking Level 2",
    date: "Apr 1, 2026",
    status: "open",
  },
  {
    id: "7",
    type: "found",
    category: "electronics",
    title: "Black Calculator (Casio)",
    description: "Found on a desk in Hall 9A after MTH lecture.",
    location: "Hall 9A, Main Building",
    date: "Apr 2, 2026",
    status: "open",
  },
  {
    id: "8",
    type: "found",
    category: "id_card",
    title: "Student ID Card",
    description: "Found near the library entrance. Handed to security desk.",
    location: "Library Entrance",
    date: "Apr 1, 2026",
    status: "open",
  },
  {
    id: "9",
    type: "found",
    category: "keys",
    title: "Single Key on red lanyard",
    description: "Found at the cafeteria table near window.",
    location: "Main Cafeteria",
    date: "Mar 31, 2026",
    status: "claimed",
  },
];

const statusVariant: Record<
  ReportStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  open: "default",
  claimed: "secondary",
  resolved: "outline",
};

export default function LostFoundPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeType, setComposeType] = useState<ReportType>("lost");

  function filterReports(type: ReportType) {
    return reports.filter((r) => {
      const matchType = r.type === type;
      const matchCat =
        activeCategory === "All" ||
        r.category.replace("_", " ") ===
          activeCategory.toLowerCase().replace(" ", "_") ||
        activeCategory.toLowerCase() === r.category.replace("_", " ");
      const matchSearch =
        !search ||
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.location.toLowerCase().includes(search.toLowerCase());
      return matchType && matchCat && matchSearch;
    });
  }

  function ReportCard({ r }: { r: Report }) {
    const Icon = catIcon[r.category];
    return (
      <Card
        className={`border-0 shadow-sm bg-card cursor-pointer hover:shadow transition-shadow ${r.status === "resolved" ? "opacity-50" : ""}`}
        onClick={() => setSelectedReport(r)}
      >
        <CardHeader className="pb-2 pt-4 px-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center shrink-0">
              <Icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-sm truncate">{r.title}</p>
                <Badge
                  variant={statusVariant[r.status]}
                  className="text-[10px] capitalize"
                >
                  {r.status}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {r.location} · {r.date}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <p className="text-xs text-muted-foreground line-clamp-2">
            {r.description}
          </p>
          {r.isOwn && r.status === "open" && (
            <Button
              size="sm"
              variant="outline"
              className="mt-2 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                toast("Marked as resolved");
              }}
            >
              Mark as Resolved
            </Button>
          )}
        </CardContent>
      </Card>
    );
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
              <BreadcrumbPage>Lost & Found</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <main className="flex-1 p-6 lg:p-8 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-0.5">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Campus · Community
            </p>
            <h1 className="text-3xl font-bold tracking-tight">Lost & Found</h1>
            <p className="text-sm text-muted-foreground">
              Report lost items or browse items that have been turned in.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                setComposeType("lost");
                setComposeOpen(true);
              }}
            >
              Report Lost Item
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setComposeType("found");
                setComposeOpen(true);
              }}
            >
              Report Found Item
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 items-center">
          {CATEGORIES_ALL.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${activeCategory === cat ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"}`}
            >
              {cat}
            </button>
          ))}
          <div className="relative ml-auto">
            <Search className="absolute left-3 top-2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              className="pl-8 h-7 text-xs w-48"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="lost">
          <TabsList>
            <TabsTrigger value="lost">
              Lost ({filterReports("lost").length})
            </TabsTrigger>
            <TabsTrigger value="found">
              Found ({filterReports("found").length})
            </TabsTrigger>
          </TabsList>

          {(["lost", "found"] as ReportType[]).map((type) => (
            <TabsContent key={type} value={type} className="mt-4">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {filterReports(type).length === 0 ? (
                  <p className="text-sm text-muted-foreground col-span-3 py-8 text-center">
                    No {type} items reported — hopefully everything&apos;s safe!
                  </p>
                ) : (
                  filterReports(type).map((r) => (
                    <ReportCard key={r.id} r={r} />
                  ))
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>

      {/* Report detail sheet */}
      <Sheet
        open={!!selectedReport}
        onOpenChange={() => setSelectedReport(null)}
      >
        <SheetContent className="sm:max-w-sm">
          {selectedReport && (
            <>
              <SheetHeader>
                <Badge
                  variant={statusVariant[selectedReport.status]}
                  className="w-fit capitalize text-[10px]"
                >
                  {selectedReport.status}
                </Badge>
                <SheetTitle className="mt-1">{selectedReport.title}</SheetTitle>
              </SheetHeader>
              <div className="mt-5 space-y-4 text-sm">
                <div className="w-full h-32 bg-muted rounded-md flex items-center justify-center">
                  {(() => {
                    const Icon = catIcon[selectedReport.category];
                    return (
                      <Icon className="h-10 w-10 text-muted-foreground/40" />
                    );
                  })()}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                      Location
                    </p>
                    <p>{selectedReport.location}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                      Date
                    </p>
                    <p>{selectedReport.date}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-1">
                    Description
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedReport.description}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-1">
                    Posted By
                  </p>
                  <p>Anonymous student</p>
                </div>
                {selectedReport.status === "open" && (
                  <Button
                    className="w-full"
                    onClick={() =>
                      toast("Message sent to reporter", {
                        description: "They'll be notified via in-app message.",
                      })
                    }
                  >
                    {selectedReport.type === "lost"
                      ? "I Found This"
                      : "This Is Mine"}
                  </Button>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Compose dialog */}
      <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Report {composeType === "lost" ? "Lost" : "Found"} Item
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-sm">
            <div className="space-y-1.5">
              <Label>Item Title</Label>
              <Input placeholder="e.g. Black Samsung Phone" />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    "Electronics",
                    "ID Card",
                    "Clothing",
                    "Keys",
                    "Bag",
                    "Other",
                  ] as string[]
                ).map((c) => (
                  <button
                    key={c}
                    className="text-xs px-2.5 py-1 rounded-full bg-muted hover:bg-primary/10 font-medium"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>
                Location {composeType === "lost" ? "Last Seen" : "Found"}
              </Label>
              <Input placeholder="e.g. Block C Canteen" />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea
                placeholder="Describe the item in detail..."
                className="resize-none"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setComposeOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setComposeOpen(false);
                toast("Report submitted!", {
                  description: "Your report is now visible on the board.",
                });
              }}
            >
              Submit Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
