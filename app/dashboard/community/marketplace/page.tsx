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
  Clock,
  Gift,
  Laptop,
  Package,
  Plus,
  Search,
  Shirt,
  SmartphoneIcon,
} from "lucide-react";
import { useState } from "react";

/* ── Mock data ────────────────────────────────────────────────────── */

type Condition = "new" | "like_new" | "good" | "fair" | "poor";
type ListingStatus = "active" | "sold";
type Category =
  | "textbook"
  | "equipment"
  | "notes"
  | "stationery"
  | "electronics"
  | "clothing"
  | "other";

type Listing = {
  id: string;
  title: string;
  category: Category;
  description: string;
  condition: Condition;
  price: number | null;
  isFree: boolean;
  courseCode: string | null;
  timeAgo: string;
  status: ListingStatus;
  isOwn?: boolean;
};

const FILTERS = [
  "All",
  "Textbooks",
  "Equipment",
  "Notes",
  "Stationery",
  "Electronics",
  "Other",
];
const PRICE_FILTERS = ["Any price", "Free", "Under RM20", "Under RM50"];

const CAT_ICON: Record<Category, React.ElementType> = {
  textbook: Package,
  equipment: Laptop,
  notes: Package,
  stationery: Package,
  electronics: SmartphoneIcon,
  clothing: Shirt,
  other: Backpack,
};

const CAT_BG: Record<Category, string> = {
  textbook: "bg-blue-50",
  equipment: "bg-primary/5",
  notes: "bg-amber-50",
  stationery: "bg-emerald-50",
  electronics: "bg-purple-50",
  clothing: "bg-orange-50",
  other: "bg-muted/40",
};

const CONDITION_LABEL: Record<Condition, string> = {
  new: "New",
  like_new: "Like New",
  good: "Good",
  fair: "Fair",
  poor: "Poor",
};

const listings: Listing[] = [
  {
    id: "l1",
    title: "Stewart Calculus 8th Edition",
    category: "textbook",
    description:
      "Minor highlights on pages 12–45. Cover intact. Includes student solutions manual.",
    condition: "good",
    price: 35,
    isFree: false,
    courseCode: "MTH 301",
    timeAgo: "3h ago",
    status: "active",
  },
  {
    id: "l2",
    title: "Lab Coat Size M (unused)",
    category: "clothing",
    description: "White lab coat, size M, never worn. Still in packaging.",
    condition: "new",
    price: 15,
    isFree: false,
    courseCode: null,
    timeAgo: "1d ago",
    status: "active",
  },
  {
    id: "l3",
    title: "TI-84 Plus Calculator",
    category: "electronics",
    description:
      "Works perfectly. Comes with USB cable and cover. Some cosmetic scratches.",
    condition: "good",
    price: 80,
    isFree: false,
    courseCode: null,
    timeAgo: "2d ago",
    status: "active",
  },
  {
    id: "l4",
    title: "Complete ARC 402 Notes (Sem 7)",
    category: "notes",
    description:
      "Handwritten + typed notes covering all 15 weeks. Very detailed with diagrams.",
    condition: "like_new",
    price: null,
    isFree: true,
    courseCode: "ARC 402",
    timeAgo: "5h ago",
    status: "active",
  },
  {
    id: "l5",
    title: "Drawing Set (technical pens)",
    category: "stationery",
    description:
      "Rotring pen set, 0.1–0.8mm. 2 pens need refill, rest are functional.",
    condition: "fair",
    price: 25,
    isFree: false,
    courseCode: null,
    timeAgo: "3d ago",
    status: "active",
  },
  {
    id: "l6",
    title: "Organic Chemistry Textbook 5th Ed",
    category: "textbook",
    description:
      "Clayden, Greeves & Warren. Good condition, no writing inside.",
    condition: "good",
    price: 40,
    isFree: false,
    courseCode: "CHE 201",
    timeAgo: "1d ago",
    status: "active",
  },
  {
    id: "l7",
    title: "Laptop Stand (foldable)",
    category: "equipment",
    description:
      "Aluminium foldable laptop stand. Adjustable height. Very portable.",
    condition: "like_new",
    price: null,
    isFree: false,
    courseCode: null,
    timeAgo: "6h ago",
    status: "active",
  },
  {
    id: "l8",
    title: "Engineering Drawing Board",
    category: "equipment",
    description: "A2 drawing board with T-square. Sold — kept for reference.",
    condition: "good",
    price: 60,
    isFree: false,
    courseCode: null,
    timeAgo: "5d ago",
    status: "sold",
    isOwn: true,
  },
];

export default function MarketplacePage() {
  const [filter, setFilter] = useState("All");
  const [priceFilter, setPriceFilter] = useState("Any price");
  const [search, setSearch] = useState("");
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [postOpen, setPostOpen] = useState(false);

  const filtered = listings.filter((l) => {
    const matchFilter =
      filter === "All" ||
      (filter === "Textbooks" && l.category === "textbook") ||
      (filter === "Equipment" && l.category === "equipment") ||
      (filter === "Notes" && l.category === "notes") ||
      (filter === "Stationery" && l.category === "stationery") ||
      (filter === "Electronics" && l.category === "electronics") ||
      (filter === "Other" && ["clothing", "other"].includes(l.category));
    const matchPrice =
      priceFilter === "Any price"
        ? true
        : priceFilter === "Free"
          ? l.isFree
          : priceFilter === "Under RM20"
            ? l.price !== null && l.price < 20
            : priceFilter === "Under RM50"
              ? l.price !== null && l.price < 50
              : true;
    const matchSearch =
      !search || l.title.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchPrice && matchSearch;
  });

  const myListings = listings.filter((l) => l.isOwn);

  function ListingCard({ l }: { l: Listing }) {
    const Icon = CAT_ICON[l.category];
    return (
      <Card
        className={`border-0 shadow-sm bg-card cursor-pointer hover:shadow transition-shadow ${l.status === "sold" ? "opacity-60" : ""}`}
        onClick={() => setSelectedListing(l)}
      >
        <div
          className={`relative h-28 ${CAT_BG[l.category]} flex items-center justify-center rounded-t-md`}
        >
          <Icon className="h-10 w-10 text-muted-foreground/40" />
          {l.status === "sold" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-foreground/70 text-background text-xs font-bold py-1 px-3 rotate-[-25deg] rounded">
                SOLD
              </div>
            </div>
          )}
          <Badge
            variant="secondary"
            className="absolute top-2 right-2 text-[10px]"
          >
            {CONDITION_LABEL[l.condition]}
          </Badge>
        </div>
        <CardHeader className="pb-1 pt-3 px-3">
          <p className="font-semibold text-sm line-clamp-2 leading-snug">
            {l.title}
          </p>
        </CardHeader>
        <CardContent className="px-3 pb-3 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            {l.courseCode && (
              <Badge variant="outline" className="text-[10px]">
                {l.courseCode}
              </Badge>
            )}
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {l.timeAgo}
            </span>
          </div>
          <div className="flex items-center justify-between">
            {l.isFree ? (
              <span className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                <Gift className="h-3.5 w-3.5" />
                Free
              </span>
            ) : l.price === null ? (
              <span className="text-sm font-bold text-muted-foreground">
                Make offer
              </span>
            ) : (
              <span className="text-sm font-bold">RM {l.price.toFixed(2)}</span>
            )}
            {l.status === "active" && (
              <Button
                size="sm"
                variant="outline"
                className="text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  toast("Message sent to seller");
                }}
              >
                Contact
              </Button>
            )}
          </div>
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
              <BreadcrumbPage>Marketplace</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <main className="flex-1 p-6 lg:p-8 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-0.5">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Community
            </p>
            <h1 className="text-3xl font-bold tracking-tight">
              Student Marketplace
            </h1>
            <p className="text-sm text-muted-foreground">
              Buy and sell textbooks, equipment, and more — from students, for
              students.
            </p>
          </div>
          <Button onClick={() => setPostOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Post Listing
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 items-center">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"}`}
            >
              {f}
            </button>
          ))}
          <div className="flex gap-2 ml-auto items-center">
            <select
              className="text-xs bg-muted rounded-full px-3 py-1 font-medium text-muted-foreground border-0 outline-none"
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
            >
              {PRICE_FILTERS.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
            <div className="relative">
              <Search className="absolute left-3 top-1.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                className="pl-8 h-7 text-xs w-40"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="h-8">
            <TabsTrigger value="all" className="text-xs">
              All Listings
            </TabsTrigger>
            <TabsTrigger value="my" className="text-xs">
              My Listings ({myListings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {filtered.map((l) => (
                <ListingCard key={l.id} l={l} />
              ))}
              {filtered.length === 0 && (
                <p className="text-sm text-muted-foreground col-span-4 py-8 text-center">
                  Nothing listed here yet — be the first!
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="my" className="mt-4">
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {myListings.map((l) => (
                <ListingCard key={l.id} l={l} />
              ))}
              {myListings.length === 0 && (
                <p className="text-sm text-muted-foreground col-span-4 py-8 text-center">
                  {"You haven't posted any listings yet."}
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Listing detail sheet */}
      <Sheet
        open={!!selectedListing}
        onOpenChange={() => setSelectedListing(null)}
      >
        <SheetContent className="sm:max-w-sm overflow-y-auto">
          {selectedListing && (
            <>
              <div
                className={`h-36 ${CAT_BG[selectedListing.category]} flex items-center justify-center rounded-md mb-4`}
              >
                {(() => {
                  const Icon = CAT_ICON[selectedListing.category];
                  return (
                    <Icon className="h-14 w-14 text-muted-foreground/30" />
                  );
                })()}
              </div>
              <SheetHeader>
                <div className="flex gap-2 flex-wrap mb-1">
                  <Badge variant="secondary" className="text-[10px]">
                    {selectedListing.category}
                  </Badge>
                  <Badge variant="outline" className="text-[10px]">
                    {CONDITION_LABEL[selectedListing.condition]}
                  </Badge>
                  {selectedListing.courseCode && (
                    <Badge variant="outline" className="text-[10px]">
                      {selectedListing.courseCode}
                    </Badge>
                  )}
                </div>
                <SheetTitle>{selectedListing.title}</SheetTitle>
                <div className="text-xl font-bold">
                  {selectedListing.isFree ? (
                    <span className="text-emerald-600">Free</span>
                  ) : selectedListing.price === null ? (
                    <span className="text-muted-foreground">Make offer</span>
                  ) : (
                    `RM ${selectedListing.price.toFixed(2)}`
                  )}
                </div>
              </SheetHeader>
              <div className="mt-5 space-y-4 text-sm">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-1">
                    Description
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedListing.description}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                      Seller
                    </p>
                    <p>Anonymous student</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                      Posted
                    </p>
                    <p>{selectedListing.timeAgo}</p>
                  </div>
                </div>
                {selectedListing.status === "active" &&
                  !selectedListing.isOwn && (
                    <Button
                      className="w-full"
                      onClick={() =>
                        toast("Message sent to seller!", {
                          description: "They'll respond via in-app message.",
                        })
                      }
                    >
                      Contact Seller
                    </Button>
                  )}
                {selectedListing.isOwn &&
                  selectedListing.status === "active" && (
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1">
                        Edit
                      </Button>
                      <Button
                        variant="secondary"
                        className="flex-1"
                        onClick={() => toast("Marked as sold!")}
                      >
                        Mark as Sold
                      </Button>
                    </div>
                  )}
                <button className="text-xs text-muted-foreground hover:text-foreground">
                  {"Report listing"}
                </button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Post listing dialog */}
      <Dialog open={postOpen} onOpenChange={setPostOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Post a Listing</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-sm">
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input placeholder="e.g. Stewart Calculus 8th Edition" />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <div className="flex flex-wrap gap-2">
                {[
                  "Textbook",
                  "Equipment",
                  "Notes",
                  "Stationery",
                  "Electronics",
                  "Clothing",
                  "Other",
                ].map((c) => (
                  <button
                    key={c}
                    className="text-xs px-2.5 py-1 rounded-full bg-muted hover:bg-primary/10 font-medium"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Price (RM)</Label>
                <Input type="number" placeholder="0 = Free" />
              </div>
              <div className="space-y-1.5">
                <Label>Course Code (optional)</Label>
                <Input placeholder="e.g. MTH 301" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea
                placeholder="Describe the item..."
                className="resize-none"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPostOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setPostOpen(false);
                toast("Listing posted!");
              }}
            >
              Post Listing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
