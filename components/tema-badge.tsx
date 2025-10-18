import type { TemaProcesso } from "@/lib/types/processo";
import { cn } from "@/lib/utils";
import { Scale, Package, DollarSign, FileText } from "lucide-react";

const temaConfig: Record<
  TemaProcesso,
  {
    label: string;
    color: string;
    bgColor: string;
    icon: typeof Scale;
  }
> = {
  IRPJ: {
    label: "IRPJ",
    color: "text-blue-700",
    bgColor: "bg-blue-100 border-blue-200",
    icon: DollarSign,
  },
  IPI: {
    label: "IPI",
    color: "text-purple-700",
    bgColor: "bg-purple-100 border-purple-200",
    icon: Package,
  },
  COFINS: {
    label: "COFINS",
    color: "text-green-700",
    bgColor: "bg-green-100 border-green-200",
    icon: DollarSign,
  },
  PIS: {
    label: "PIS",
    color: "text-emerald-700",
    bgColor: "bg-emerald-100 border-emerald-200",
    icon: DollarSign,
  },
  CSLL: {
    label: "CSLL",
    color: "text-indigo-700",
    bgColor: "bg-indigo-100 border-indigo-200",
    icon: DollarSign,
  },
  ICMS: {
    label: "ICMS",
    color: "text-orange-700",
    bgColor: "bg-orange-100 border-orange-200",
    icon: Scale,
  },
  ISS: {
    label: "ISS",
    color: "text-pink-700",
    bgColor: "bg-pink-100 border-pink-200",
    icon: FileText,
  },
  OUTROS: {
    label: "Outros",
    color: "text-gray-700",
    bgColor: "bg-gray-100 border-gray-200",
    icon: FileText,
  },
};

interface TemaBadgeProps {
  tema: TemaProcesso;
  className?: string;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
}

export function TemaBadge({
  tema,
  className,
  showIcon = true,
  size = "md",
}: TemaBadgeProps) {
  const config = temaConfig[tema];
  const Icon = config.icon;

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-xs px-2.5 py-1",
    lg: "text-sm px-3 py-1.5",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-3.5 w-3.5",
    lg: "h-4 w-4",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-semibold transition-colors",
        config.bgColor,
        config.color,
        sizeClasses[size],
        className
      )}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      <span>{config.label}</span>
    </div>
  );
}
