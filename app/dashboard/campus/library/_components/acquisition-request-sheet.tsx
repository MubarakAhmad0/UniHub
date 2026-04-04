"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

export function AcquisitionRequestSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [title, setTitle] = useState("");
  const [source, setSource] = useState("");
  const [type, setType] = useState<string>("Book");
  const [isbn, setIsbn] = useState("");
  const [justification, setJustification] = useState("");

  const handleSubmit = () => {
    if (!title || !justification) {
      toast.error("Please fill in the title and justification.");
      return;
    }
    toast.success("Acquisition request submitted to library admin.");
    onOpenChange(false);
    // Reset form
    setTitle("");
    setSource("");
    setType("Book");
    setIsbn("");
    setJustification("");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Request Resource Acquisition</SheetTitle>
          <SheetDescription>
            Submit a request for the library to purchase new materials or
            equipment.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 py-6">
          <div className="space-y-1.5">
            <Label htmlFor="req-title">Title</Label>
            <Input
              id="req-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title of resource..."
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="req-source">Author / Source</Label>
            <Input
              id="req-source"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="Author, publisher, or URL..."
            />
          </div>
          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="req-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Book", "Journal", "Equipment", "Software"].map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="req-isbn">ISBN / URL (Optional)</Label>
            <Input
              id="req-isbn"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              placeholder="ISBN or product link"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="req-just">Justification</Label>
            <Textarea
              id="req-just"
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder="Why is this resource needed?"
              className="resize-none"
              rows={3}
            />
          </div>
        </div>
        <SheetFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Submit Request</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
