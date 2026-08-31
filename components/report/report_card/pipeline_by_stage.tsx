"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { useAnalyticsPipelineStage } from "@/hooks/report/report_pipeline_stage";

const chartConfig = {
  desktop: {
    label: "Pipeline",
    color: "#4a0f0a",
  },
} satisfies ChartConfig;

const STAGE_COLORS: Record<string, string> = {
  Lead: "#D97706", // Orange
  Contact: "#2563EB", // Blue
  Qualified: "#7C3AED", // Purple
  Proposal: "#DB2777", // Pink
  Negotiation: "#0891B2", // Cyan
  Won: "#065F46", // Emerald
};

const FALLBACK_COLOR = "#6B7280";

const truncate = (value: string, max = 8) =>
  value.length > max ? `${value.slice(0, max)}…` : value;

function useIsSmallScreen(breakpoint = 640) {
  const [isSmall, setIsSmall] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint}px)`);

    const update = () => setIsSmall(mql.matches);

    update();

    mql.addEventListener("change", update);

    return () => mql.removeEventListener("change", update);
  }, [breakpoint]);

  return isSmall;
}

export default function PipelineByStage() {
  const { data: chartData } = useAnalyticsPipelineStage();
  const isSmallScreen = useIsSmallScreen();

  console.log("chartData:", chartData);
  console.log("isArray:", Array.isArray(chartData));

  return (
    <div className="w-full min-w-0 pt-6">
      <ChartContainer
        config={chartConfig}
        className="w-full h-[300px] sm:h-[340px] lg:h-[380px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData ?? []}
            margin={{
              top: 6,
              right: 8,
              left: 0,
              bottom: isSmallScreen ? 20 : 6,
            }}
          >
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={isSmallScreen ? 8 : 10}
              axisLine={false}
              interval={0}
              tick={{ fontSize: 11 }}
              tickFormatter={(value) =>
                truncate(String(value), isSmallScreen ? 10 : 8)
              }
              angle={isSmallScreen ? -35 : 0}
              textAnchor={isSmallScreen ? "end" : "middle"}
              height={isSmallScreen ? 50 : 30}
            />

            <YAxis
              width={40}
              tickLine={false}
              tickMargin={4}
              axisLine={false}
              tick={{ fontSize: 11 }}
              tickFormatter={(value) =>
                typeof value === "number"
                  ? Intl.NumberFormat("en", {
                      notation: "compact",
                    }).format(value)
                  : String(value)
              }
              allowDecimals={false}
            />

            <Tooltip
              cursor={{ fill: "rgba(226, 114, 91, 0.08)" }}
              formatter={(value) =>
                value != null ? Number(value).toLocaleString() : ""
              }
            />

            <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={60}>
              {(chartData ?? []).map((entry) => (
                <Cell
                  key={entry.name}
                  fill={STAGE_COLORS[entry.name] ?? FALLBACK_COLOR}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
