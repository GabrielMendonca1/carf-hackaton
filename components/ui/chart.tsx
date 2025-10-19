"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type ChartConfig = Record<
  string,
  {
    label?: string;
    color?: string;
  }
>;

const ChartContext = React.createContext<ChartConfig | null>(null);

export interface ChartContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig;
}

export function ChartContainer({
  config,
  className,
  children,
  ...props
}: ChartContainerProps) {
  const colorVars = React.useMemo(
    () =>
      Object.entries(config).reduce((acc, [key, value]) => {
        if (value?.color) {
          acc[`--color-${key}`] = value.color;
        }
        return acc;
      }, {} as Record<string, string>),
    [config]
  );

  return (
    <ChartContext.Provider value={config}>
      <div
        className={cn(
          "flex h-[280px] w-full flex-col justify-center",
          className
        )}
        style={colorVars as React.CSSProperties}
        {...props}
      >
        {children}
      </div>
    </ChartContext.Provider>
  );
}

export function useChartConfig() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error("useChartConfig must be used within a ChartContainer");
  }

  return context;
}

type TooltipItem = {
  name: string;
  value: number;
  dataKey: string;
  color?: string;
  payload?: {
    label?: string;
    month?: string;
    name?: string;
    [key: string]: unknown;
  };
};

interface ChartTooltipContentProps {
  active?: boolean;
  label?: string;
  payload?: TooltipItem[];
  className?: string;
}

export function ChartTooltipContent({
  active,
  label,
  payload,
  className,
}: ChartTooltipContentProps) {
  const config = useChartConfig();

  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const resolvedLabel =
    label ??
    payload?.[0]?.payload?.label ??
    payload?.[0]?.payload?.month ??
    payload?.[0]?.payload?.name ??
    "";

  return (
    <div
      className={cn(
        "rounded-md border bg-popover/95 p-3 text-xs shadow-lg backdrop-blur-sm",
        className
      )}
    >
      {resolvedLabel && (
        <div className="mb-2 font-medium text-foreground">{resolvedLabel}</div>
      )}
      <div className="grid gap-1 text-xs">
        {payload.map((item) => {
          const dataConfig = config[item.dataKey];
          const color = dataConfig?.color ?? item.color ?? "hsl(var(--primary))";

          return (
            <div
              key={item.dataKey}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-2 text-muted-foreground">
                <span
                  className="inline-flex h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{
                    backgroundColor: color,
                  }}
                />
                <span>{dataConfig?.label ?? item.name}</span>
              </div>
              <span className="font-medium text-foreground">
                {typeof item.value === "number"
                  ? item.value.toLocaleString("pt-BR", {
                      maximumFractionDigits: Number.isInteger(item.value) ? 0 : 1,
                    })
                  : item.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export type { ChartConfig };
