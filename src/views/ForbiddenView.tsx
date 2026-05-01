import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { View } from "@/components/jowar/Navbar";

export function ForbiddenView({
  setView,
  reason,
}: {
  setView: (v: View) => void;
  reason?: string;
}) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 py-10 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/15">
        <ShieldAlert className="h-9 w-9 text-destructive" />
      </div>
      <h1 className="font-serif text-2xl font-bold text-foreground">Access not allowed</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {reason || "This page is restricted to a different role. Head back to your dashboard or browse our menu."}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Button onClick={() => setView("home")} variant="outline">Go Home</Button>
        <Button onClick={() => setView("shop")}>Browse Shop</Button>
      </div>
    </div>
  );
}