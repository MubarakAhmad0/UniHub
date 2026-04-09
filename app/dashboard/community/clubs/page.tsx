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
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Instagram,
  MessageCircle,
  Search,
  Users,
  Plus,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth/use-auth";
import { ClubsManagePanel } from "./_components/clubs-manage-panel";

/* ── Mock data ────────────────────────────────────────────────────── */

type MemberStatus = "none" | "pending" | "member";
type JoinMethod = "open" | "application";

type Club = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  founded: number;
  members: number;
  joinMethod: JoinMethod;
  isActive: boolean;
  upcomingEvents: { title: string; date: string }[];
  image: string;
  memberStatus: MemberStatus;
  isAdvising?: boolean;
};

const CAT_IMAGE: Record<string, string> = {
  Arts: "/uni images/pexels-davegarcia-31039030.jpg",
  Sports: "/uni images/pexels-an-vuong-462540819-19554793.jpg",
  Academic: "/uni images/pexels-rednguyen-22039132.jpg",
  Cultural: "/uni images/pexels-clement-proust-363898785-24304639.jpg",
  Tech: "/uni images/pexels-davegarcia-31039051.jpg",
  Religious: "/uni images/pexels-shox-31656148.jpg",
  Volunteer: "/uni images/pexels-george-pak-7972556.jpg",
};

const CATEGORIES = [
  "All",
  "Arts",
  "Sports",
  "Academic",
  "Cultural",
  "Tech",
  "Religious",
  "Volunteer",
];

const CAT_GRADIENT: Record<string, string> = {
  Arts: "from-orange-100 to-orange-50",
  Sports: "from-emerald-100 to-emerald-50",
  Academic: "from-blue-100 to-blue-50",
  Cultural: "from-purple-100 to-purple-50",
  Tech: "from-primary/20 to-primary/5",
  Religious: "from-amber-100 to-amber-50",
  Volunteer: "from-rose-100 to-rose-50",
};

const clubs: Club[] = [
  {
    id: "c1",
    name: "Photography Society",
    tagline: "Capturing campus life one frame at a time",
    description:
      "We explore photography as art and documentary. Weekly shoots, monthly exhibitions, and an annual showcase open to the public.",
    category: "Arts",
    founded: 2018,
    members: 84,
    joinMethod: "open",
    isActive: true,
    image: CAT_IMAGE.Arts,
    memberStatus: "none",
    isAdvising: true,
    upcomingEvents: [
      { title: "Golden Hour Shoot", date: "Sat Apr 5 · Campus Rooftop" },
      { title: "Photo Editing Workshop", date: "Wed Apr 9 · Lab 3" },
    ],
  },
  {
    id: "c2",
    name: "Robotics & AI Club",
    tagline: "Building the future, one circuit at a time",
    description:
      "From embedded systems to machine learning — we build, compete, and learn together. Host of the annual campus robotics challenge.",
    category: "Tech",
    founded: 2016,
    members: 120,
    joinMethod: "open",
    isActive: true,
    image: CAT_IMAGE.Tech,
    memberStatus: "member",
    upcomingEvents: [
      { title: "ML Workshop Series #3", date: "Tue Apr 8 · Lab 4" },
    ],
  },
  {
    id: "c3",
    name: "Basketball Club",
    tagline: "Represent the university on court",
    description:
      "Both competitive and recreational play. We field teams in the intercollege league and run open pickup games on weekends.",
    category: "Sports",
    founded: 2010,
    members: 200,
    joinMethod: "open",
    isActive: true,
    image: CAT_IMAGE.Sports,
    memberStatus: "none",
    upcomingEvents: [
      { title: "Intercollege Cup", date: "Sat Apr 12 · Sports Complex" },
    ],
  },
  {
    id: "c4",
    name: "Architecture Design Studio",
    tagline: "Where creativity meets structure",
    description:
      "A space for architecture students to collaborate on design challenges, portfolio reviews, and cross-faculty critique sessions.",
    category: "Academic",
    founded: 2019,
    members: 56,
    joinMethod: "application",
    isActive: true,
    image: CAT_IMAGE.Academic,
    memberStatus: "pending",
    upcomingEvents: [
      { title: "Peer Critique Night", date: "Thu Apr 10 · Studio C" },
    ],
  },
  {
    id: "c5",
    name: "Cultural Heritage Society",
    tagline: "Celebrating the diversity of our campus",
    description:
      "We organise cultural nights, heritage exhibitions, and cuisine fairs that showcase the many backgrounds of our student community.",
    category: "Cultural",
    founded: 2014,
    members: 73,
    joinMethod: "open",
    isActive: true,
    image: CAT_IMAGE.Cultural,
    memberStatus: "none",
    upcomingEvents: [
      {
        title: "Cultural Night: East Meets West",
        date: "Fri Apr 11 · Auditorium",
      },
    ],
  },
  {
    id: "c6",
    name: "Volunteer Corps",
    tagline: "Making a difference beyond the classroom",
    description:
      "Community service, disaster relief volunteering, and campus sustainability drives. Accredited co-curricular hours provided.",
    category: "Volunteer",
    founded: 2013,
    members: 145,
    joinMethod: "open",
    isActive: true,
    image: CAT_IMAGE.Volunteer,
    memberStatus: "none",
    upcomingEvents: [{ title: "Clean Campus Drive", date: "Sun Apr 13 · 8am" }],
  },
];

export default function ClubsPage() {
  const { hasRole } = useAuth();
  const isAdmin = hasRole("admin");
  const isManager = hasRole("manager");

  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [clubsState, setClubsState] = useState(clubs);

  const filtered = clubsState.filter((c) => {
    const matchCat = activeCategory === "All" || c.category === activeCategory;
    const matchSearch =
      !search || c.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const myClubs = clubsState.filter((c) => c.memberStatus !== "none");
  const myAdvisoryClubs = clubsState.filter((c) => c.isAdvising);

  function handleJoin(id: string) {
    const club = clubsState.find((c) => c.id === id);
    if (!club) return;
    if (club.joinMethod === "open") {
      setClubsState((prev) =>
        prev.map((c) =>
          c.id === id
            ? { ...c, memberStatus: "member", members: c.members + 1 }
            : c,
        ),
      );
      if (selectedClub?.id === id)
        setSelectedClub((c) => (c ? { ...c, memberStatus: "member" } : c));
      toast(`Joined ${club.name}!`);
    } else {
      setClubsState((prev) =>
        prev.map((c) => (c.id === id ? { ...c, memberStatus: "pending" } : c)),
      );
      if (selectedClub?.id === id)
        setSelectedClub((c) => (c ? { ...c, memberStatus: "pending" } : c));
      toast("Application submitted!", {
        description: "The club admin will review your request.",
      });
    }
  }

  function JoinButton({ club }: { club: Club }) {
    if (club.memberStatus === "member")
      return (
        <Button size="sm" variant="secondary" className="text-xs">
          Joined ✓
        </Button>
      );
    if (club.memberStatus === "pending")
      return (
        <Badge
          variant="outline"
          className="text-[10px] text-amber-600 border-amber-300"
        >
          Application Pending
        </Badge>
      );
    if (club.joinMethod === "open")
      return (
        <Button
          size="sm"
          className="text-xs"
          onClick={() => handleJoin(club.id)}
        >
          Join
        </Button>
      );
    return (
      <Button
        size="sm"
        variant="outline"
        className="text-xs"
        onClick={() => handleJoin(club.id)}
      >
        Apply
      </Button>
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
              <BreadcrumbPage>Clubs & Societies</BreadcrumbPage>
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
              Clubs & Societies
            </h1>
            <p className="text-sm text-muted-foreground">
              Discover and join student clubs on campus.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9 w-56"
                placeholder="Search clubs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {isAdmin && (
              <Button onClick={() => toast("Opening Create Club form...")}>
                <Plus className="mr-2 h-4 w-4" />
                Create Club
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="all">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${activeCategory === cat ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"}`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <TabsList className="h-8">
              <TabsTrigger value="all" className="text-xs">
                All Clubs
              </TabsTrigger>
              <TabsTrigger value="my" className="text-xs">
                My Clubs ({myClubs.length})
              </TabsTrigger>
              {isManager && (
                <TabsTrigger value="advisory" className="text-xs">
                  My Advisory Clubs
                </TabsTrigger>
              )}
              {isAdmin && (
                <TabsTrigger value="manage" className="text-xs">
                  Manage
                </TabsTrigger>
              )}
            </TabsList>
          </div>

          <TabsContent value="all" className="mt-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((club) => (
                <Card
                  key={club.id}
                  className="border-0 shadow-sm bg-card overflow-hidden cursor-pointer hover:shadow transition-shadow"
                  onClick={() => setSelectedClub(club)}
                >
                  {/* Banner */}
                  <div className="h-20 relative overflow-hidden">
                    <img
                      src={club.image || CAT_IMAGE[club.category]}
                      alt={club.name}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-black/5" />
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-card" />
                  </div>
                  <CardHeader className="pb-2 pt-3 px-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-sm leading-snug">
                          {club.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {club.tagline}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 space-y-3">
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-medium bg-muted`}
                      >
                        {club.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {club.members}
                      </span>
                    </div>
                    <div
                      className="flex items-center justify-between"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <JoinButton club={club} />
                    </div>
                  </CardContent>
                </Card>
              ))}
              {filtered.length === 0 && (
                <p className="text-sm text-muted-foreground col-span-3 py-8 text-center">
                  No clubs found.
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="my" className="mt-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {myClubs.length === 0 && (
                <p className="text-sm text-muted-foreground col-span-3 py-8 text-center">
                  {"You haven't joined any clubs yet."}
                </p>
              )}
              {myClubs.map((club) => (
                <Card
                  key={club.id}
                  className="border-0 shadow-sm bg-card overflow-hidden cursor-pointer hover:shadow transition-shadow"
                  onClick={() => setSelectedClub(club)}
                >
                  <div className="h-16 relative overflow-hidden">
                    <img
                      src={club.image || CAT_IMAGE[club.category]}
                      alt={club.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <CardContent className="px-4 py-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-sm">{club.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {club.members} members
                      </p>
                    </div>
                    <JoinButton club={club} />
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {isManager && (
            <TabsContent value="advisory" className="mt-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {myAdvisoryClubs.map((club) => (
                  <Card
                    key={club.id}
                    className="border-0 shadow-sm bg-card overflow-hidden cursor-pointer hover:shadow transition-shadow border-indigo-100"
                    onClick={() => setSelectedClub(club)}
                  >
                    <div className="h-16 relative overflow-hidden">
                      <img
                        src={club.image || CAT_IMAGE[club.category]}
                        alt={club.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <CardContent className="px-4 py-3 flex flex-col gap-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-sm">{club.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {club.members} members
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className="text-[10px] bg-indigo-50 text-indigo-700 border-indigo-200"
                        >
                          <ShieldCheck className="h-3 w-3 mr-1" />
                          Advisor
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-amber-600 font-medium">
                          1 Pending Endorsement
                        </span>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-6 text-xs px-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedClub(club);
                          }}
                        >
                          Review
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
              <ClubsManagePanel />
            </TabsContent>
          )}
        </Tabs>
      </main>

      {/* Club detail sheet */}
      <Sheet open={!!selectedClub} onOpenChange={() => setSelectedClub(null)}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          {selectedClub && (
            <>
              <div className="h-28 rounded-md mb-4 overflow-hidden">
                <img
                  src={selectedClub.image || CAT_IMAGE[selectedClub.category]}
                  alt={selectedClub.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <SheetHeader>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary" className="text-[10px]">
                    {selectedClub.category}
                  </Badge>
                  {!selectedClub.isActive && (
                    <Badge variant="destructive" className="text-[10px]">
                      Inactive
                    </Badge>
                  )}
                </div>
                <SheetTitle>{selectedClub.name}</SheetTitle>
                <p className="text-xs text-muted-foreground">
                  {selectedClub.members} members · Founded{" "}
                  {selectedClub.founded}
                </p>
              </SheetHeader>
              <div className="mt-5 space-y-5 text-sm">
                <p className="text-muted-foreground leading-relaxed">
                  {selectedClub.description}
                </p>

                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-2">
                    Upcoming Events
                  </p>
                  <div className="space-y-2">
                    {selectedClub.upcomingEvents.map((e, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        <div>
                          <p className="font-medium">{e.title}</p>
                          <p className="text-muted-foreground">{e.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Instagram className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    Visit Forum Board
                  </Button>
                </div>

                {isManager && selectedClub.isAdvising ? (
                  <div className="pt-4 border-t space-y-4">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                      Advisory Tools
                    </p>
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        className="justify-start shadow-sm"
                        onClick={() => toast("Viewing Member Roster...")}
                      >
                        <Users className="mr-2 h-4 w-4" /> View Full Roster
                      </Button>
                      <Button
                        variant="outline"
                        className="justify-start shadow-sm text-amber-700 bg-amber-50 hover:bg-amber-100 border-amber-200"
                        onClick={() => toast("Endorsed pending event.")}
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" /> Endorse
                        Outstanding Activity
                      </Button>
                      <Button
                        variant="link"
                        className="text-xs text-muted-foreground h-auto p-0 justify-start"
                        onClick={() => toast("Requesting to step down...")}
                      >
                        Step down as Advisor
                      </Button>
                    </div>
                  </div>
                ) : (
                  selectedClub.isActive && (
                    <div className="pt-2" onClick={(e) => e.stopPropagation()}>
                      {/* @ts-ignore – JoinButton accepts club prop */}
                      {(() => {
                        const JB = ({ club }: { club: Club }) => {
                          if (club.memberStatus === "member")
                            return (
                              <Button className="w-full" variant="secondary">
                                Joined ✓
                              </Button>
                            );
                          if (club.memberStatus === "pending")
                            return (
                              <Button
                                className="w-full"
                                variant="outline"
                                disabled
                              >
                                Application Pending
                              </Button>
                            );
                          if (club.joinMethod === "open")
                            return (
                              <Button
                                className="w-full"
                                onClick={() => handleJoin(club.id)}
                              >
                                Join Club
                              </Button>
                            );
                          return (
                            <Button
                              className="w-full"
                              variant="outline"
                              onClick={() => handleJoin(club.id)}
                            >
                              Apply to Join
                            </Button>
                          );
                        };
                        return <JB club={selectedClub} />;
                      })()}
                    </div>
                  )
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
