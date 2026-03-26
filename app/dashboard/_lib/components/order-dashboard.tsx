"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Bell, Trophy } from "lucide-react";
import type { DashboardSummary } from "../actions";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

export default function OrderDashboard({
  dashboardSummary,
}: {
  dashboardSummary: DashboardSummary;
}) {
  const isAlertToday = true;
  const isWarningTomorrow = true;

  const chartData = [
    { name: "Today", value: 100 },
    { name: "Tomorrow", value: 200 },
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Order Dashboard</h1>
        <Button>
          Generate Report
          <ArrowUpRight className="ml-2 h-4 w-4" />
        </Button>
      </div> */}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Orders Today
                </CardTitle>
                <Bell
                  className={`h-4 w-4 ${isAlertToday ? "text-red-500" : "text-muted-foreground"}`}
                />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {400}
                </div>
                <Progress
                  value={(400 / 1000) * 100}
                  className="mt-2"
                />
                {isAlertToday && (
                  <Badge variant="destructive" className="mt-2">
                    High volume alert
                  </Badge>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Orders Tomorrow
                </CardTitle>
                <AlertTriangle
                  className={`h-4 w-4 ${isWarningTomorrow ? "text-yellow-500" : "text-muted-foreground"}`}
                />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {400}
                </div>
                <Progress
                  value={(400 / 500) * 100}
                  className="mt-2"
                />
                {isWarningTomorrow && (
                  <Badge variant="destructive" className="mt-2">
                    Approaching high volume
                  </Badge>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Top Flower Today
                </CardTitle>
                <Trophy className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {"Placeholder"}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {100} orders
                </p>
              </CardContent>
            </Card>
          </div>

          {(isAlertToday || isWarningTomorrow) && (
            <Alert variant={isAlertToday ? "destructive" : "default"}>
              <AlertTitle>
                {isAlertToday
                  ? "High Order Volume Alert"
                  : "Approaching High Order Volume"}
              </AlertTitle>
              <AlertDescription>
                {isAlertToday
                  ? "Today's orders have exceeded 500. Please ensure adequate staffing and inventory."
                  : "Tomorrow's orders are approaching 200. Consider preparing additional resources."}
              </AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Top Selling Items</CardTitle>
              <CardDescription>
                Best performing products for today and tomorrow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="today">
                <TabsList className="mb-4">
                  <TabsTrigger value="today">Today</TabsTrigger>
                  <TabsTrigger value="tomorrow">Tomorrow</TabsTrigger>
                </TabsList>
                <TabsContent value="today">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                   
                  </div>
                </TabsContent>
                <TabsContent value="tomorrow">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                   
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Volume Comparison</CardTitle>
              <CardDescription>Today vs Tomorrow</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
