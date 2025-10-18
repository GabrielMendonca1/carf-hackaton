import { LucideIcon } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4 text-center animate-in fade-in zoom-in-95 duration-500",
        className
      )}
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 border-2 border-primary/20">
          <Icon className="h-12 w-12 text-primary/60" strokeWidth={1.5} />
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-md mb-6">
        {description}
      </p>

      {actionLabel && onAction && (
        <Button onClick={onAction} variant="outline" className="gap-2">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
