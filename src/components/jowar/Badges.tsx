import { Leaf, HeartPulse, ShieldCheck } from "lucide-react";

export function HealthBadges({ className = "" }: { className?: string }) {
  const items = [
    { icon: Leaf, label: "Gluten-Free" },
    { icon: HeartPulse, label: "Diabetic-Friendly" },
    { icon: ShieldCheck, label: "No Preservatives" },
  ];
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {items.map(({ icon: Icon, label }) => (
        <span
          key={label}
          className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
        >
          <Icon className="h-3.5 w-3.5" />
          {label}
        </span>
      ))}
    </div>
  );
}