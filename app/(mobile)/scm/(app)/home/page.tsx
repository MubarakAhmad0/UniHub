import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  ArrowUpDown,
  ClipboardCheck,
  Clock,
  Package,
  PackageSearch,
  Plus,
  TrendingUp,
} from "lucide-react";

const Home = () => {
  const recentTransfers = [
    {
      id: 1,
      from: "Warehouse A",
      to: "Store B",
      items: 12,
      status: "In Transit",
      date: "2024-01-09",
    },
    {
      id: 2,
      from: "Store C",
      to: "Warehouse A",
      items: 5,
      status: "Completed",
      date: "2024-01-08",
    },
  ];

  return (
    <div className="space-y-6 p-4">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <Package className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">Total Stock</span>
          </div>
          <p className="text-2xl font-semibold">1,234</p>
          <div className="flex items-center text-xs text-primary">
            <TrendingUp className="h-3 w-3 mr-1" />
            <span>+5% from last week</span>
          </div>
        </Card>

        <Card className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <ArrowUpDown className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">Pending</span>
          </div>
          <p className="text-2xl font-semibold">8</p>
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            <span>Updated just now</span>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col items-center justify-center gap-2"
          >
            <Plus className="h-5 w-5" />
            <span className="text-sm">New Transfer</span>
          </Button>

          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col items-center justify-center gap-2"
          >
            <ClipboardCheck className="h-5 w-5" />
            <span className="text-sm">Stock Check</span>
          </Button>

          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col items-center justify-center gap-2"
          >
            <PackageSearch className="h-5 w-5" />
            <span className="text-sm">Find Item</span>
          </Button>

          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col items-center justify-center gap-2"
          >
            <Package className="h-5 w-5" />
            <span className="text-sm">Inventory</span>
          </Button>
        </div>
      </div>

      {/* Recent Transfers */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Transfers</h2>
          <Button variant="ghost" className="text-sm h-8 px-2">
            View all
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-3">
          {recentTransfers.map((transfer) => (
            <Card key={transfer.id} className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{transfer.from}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{transfer.to}</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {transfer.items} items
                </span>
                <span
                  className={cn(
                    "px-2 py-1 rounded-full text-xs",
                    transfer.status === "Completed"
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {transfer.status}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
