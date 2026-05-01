import { OrderList } from "@/components/jowar/OrderList";
import { Package } from "lucide-react";

export function TeamView() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground">Team Dashboard</h1>
        <p className="text-muted-foreground">View and update order status</p>
      </div>
      <h2 className="flex items-center gap-2 font-serif text-xl font-bold"><Package className="h-5 w-5 text-primary" />All Orders</h2>
      <OrderList scope="all" canEdit />
    </div>
  );
}
