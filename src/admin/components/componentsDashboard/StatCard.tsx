import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
}

const StatCard = ({ title, value, icon: Icon }: StatCardProps) => {
  return (
    <div className="relative overflow-hidden bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {title}
          </p>
          <p className="mt-2 text-3xl font-semibold text-foreground tracking-tight">
            {value}
          </p>
        </div>
        <div className="h-10 w-10 rounded-lg bg-muted/60 border border-border flex items-center justify-center text-primary">
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
