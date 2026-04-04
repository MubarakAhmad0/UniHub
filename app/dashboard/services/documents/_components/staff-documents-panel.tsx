"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Download,
  FileText,
  FileSpreadsheet,
  Users,
  Briefcase,
} from "lucide-react";
import { toast } from "sonner";

export function StaffDocumentsPanel() {
  return (
    <div className="space-y-6 pt-4">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Staff HR Documents */}
        <Card className="border-0 shadow-sm bg-card">
          <CardHeader>
            <CardTitle className="text-lg">HR & Employment</CardTitle>
            <CardDescription>
              Request official staff documents from Human Resources.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              {
                title: "Employment Verification Letter",
                desc: "For banking or visa applications",
              },
              {
                title: "Recent Payslip (PDF)",
                desc: "Current month payroll statement",
              },
              { title: "EA Form (Tax)", desc: "Annual taxation statement" },
            ].map((doc, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-3 border rounded-md"
              >
                <div className="flex gap-3 items-center">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{doc.title}</p>
                    <p className="text-xs text-muted-foreground">{doc.desc}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toast("Document request sent to HR.")}
                >
                  Request
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Course Documents */}
        <Card className="border-0 shadow-sm bg-card">
          <CardHeader>
            <CardTitle className="text-lg">
              Course Materials (MTH 301)
            </CardTitle>
            <CardDescription>
              Generate documents for your active enrolled classes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center p-3 border rounded-md">
              <div className="flex gap-3 items-center">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Class Attendance Roster</p>
                  <p className="text-xs text-muted-foreground">
                    PDF list of all enrolled students
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => toast("Generating PDF document...")}
              >
                <Download className="h-4 w-4 mr-1" /> PDF
              </Button>
            </div>

            <div className="flex justify-between items-center p-3 border rounded-md">
              <div className="flex gap-3 items-center">
                <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Grading Template</p>
                  <p className="text-xs text-muted-foreground">
                    CSV template for final marks
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => toast("Downloading CSV template...")}
              >
                <Download className="h-4 w-4 mr-1" /> CSV
              </Button>
            </div>

            <div className="flex justify-between items-center p-3 border rounded-md">
              <div className="flex gap-3 items-center">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    Student Registration Verification
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Select a student to generate letter
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => toast("Opening selector dialog...")}
              >
                Generate...
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
