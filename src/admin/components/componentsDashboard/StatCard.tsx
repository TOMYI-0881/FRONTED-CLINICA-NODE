import { Skeleton } from "@/components/ui/skeleton";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  loading?: boolean;
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  loading = false,
}: StatCardProps) => {
  return (
    <div className="rounded-[22px] border border-frost-edge bg-card p-5 shadow-sm backdrop-blur-xl transition-transform hover:-translate-y-1">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {title}
          </p>
          {loading ? (
            <Skeleton className="mt-2 h-9 w-16" />
          ) : (
            <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
              {value}
            </p>
          )}
        </div>
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-coral/15 text-coral">
          <Icon className="size-5" />
        </span>
      </div>
    </div>
  );
};

export default StatCard;