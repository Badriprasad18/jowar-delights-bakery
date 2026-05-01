import { OrderList } from "@/components/jowar/OrderList";
import { Package } from "lucide-react";

export function MyOrdersView() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-10">
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground">My Orders</h1>
        <p className="text-muted-foreground">Track your COD orders</p>
      </div>
      <h2 className="flex items-center gap-2 font-serif text-xl font-bold"><Package className="h-5 w-5 text-primary" />Order History</h2>
      <OrderList scope="mine" canEdit={false} />
    </div>
  );
}
