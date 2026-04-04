"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, UserCircle2, MapPin, Key } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export function StaffProfileForm() {
  return (
    <div className="space-y-6">
      {/* Visibility Toggle */}
      <Card className="border-0 shadow-sm bg-primary/5">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="font-semibold text-sm">
              Public Directory Visibility
            </h3>
            <p className="text-xs text-muted-foreground">
              When enabled, your office location and bio are exposed to
              students.
            </p>
          </div>
          <Switch
            defaultChecked
            onCheckedChange={(checked) => toast(`Visibility set to ${checked}`)}
          />
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Mock HR Immutable Data */}
        <Card className="border-0 shadow-sm bg-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Key className="h-4 w-4 text-muted-foreground" /> Employee Record
            </CardTitle>
            <CardDescription>HR data cannot be modified here.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Staff ID</Label>
              <div className="font-mono text-sm pl-0">EMP-2023-8821</div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">
                Faculty & Department
              </Label>
              <div className="text-sm">
                Faculty of Engineering
                <br />
                <span className="text-muted-foreground">
                  Dept of Architecture
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">
                Designation
              </Label>
              <Badge variant="secondary" className="mt-1">
                Senior Lecturer
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Office details */}
        <Card className="border-0 shadow-sm bg-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" /> Office &
              Availability
            </CardTitle>
            <CardDescription>
              Manage where students can find you.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Physical Location</Label>
              <Input
                defaultValue="Building C, Room 402"
                placeholder="e.g. Block A, Room 12"
              />
            </div>
            <div className="space-y-2">
              <Label>Standard Office Hours (Drop-in)</Label>
              <div className="flex gap-2">
                <Select defaultValue="mon">
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mon">Monday</SelectItem>
                    <SelectItem value="tue">Tuesday</SelectItem>
                    <SelectItem value="wed">Wednesday</SelectItem>
                    <SelectItem value="thu">Thursday</SelectItem>
                    <SelectItem value="fri">Friday</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  defaultValue="14:00 - 16:00"
                  placeholder="HH:MM - HH:MM"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bio and Research */}
      <Card className="border-0 shadow-sm bg-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <UserCircle2 className="h-4 w-4 text-muted-foreground" /> Biography
            & Research
          </CardTitle>
          <CardDescription>
            Write a brief bio for your public directory profile.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Academic Biography</Label>
            <Textarea
              rows={4}
              defaultValue="I specialize in sustainable architecture and urban design principles. My academic background focuses on integrating green technologies into high-density commercial spaces."
            />
          </div>
          <div className="space-y-2">
            <Label>Research Interests (comma separated)</Label>
            <Input defaultValue="Sustainability, Urban Planning, Green Tech" />
          </div>
          <div className="pt-2 flex justify-end">
            <Button onClick={() => toast.success("Academic identity updated.")}>
              <Save className="h-4 w-4 mr-2" /> Save Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
