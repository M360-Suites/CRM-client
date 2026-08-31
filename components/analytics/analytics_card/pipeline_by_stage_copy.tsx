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
import { useAnalyticsPipelineStage } from "@/hooks/analytics/analytics_pipeline_stage";
import { useUserStore } from "@/stores/user/user_store";

const chartConfig = {
  desktop: {
    label: "Pipeline Revenue",
    color: "#4a0f0a",
  },
} satisfies ChartConfig;

const STAGE_COLORS: Record<string, string> = {
  Lead: "#D97706",
  Contact: "#2563EB",
  Qualified: "#7C3AED",
  Proposal: "#DB2777",
  Negotiation: "#0891B2",
  Won: "#065F46",
};

const FALLBACK_COLORS = ["#4a0f0a", "#5C2622", "#6E3E3A", "#805753", "#D4614A"];

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

const nairaFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  notation: "compact",
  maximumFractionDigits: 1,
});

const nairaCompactAxis = new Intl.NumberFormat("en-NG", {
  notation: "compact",
});

export default function PipelineByStage() {
  const { pipelineStateTimeframe } = useUserStore();

  const { data: chartData } = useAnalyticsPipelineStage({
    timeframe: pipelineStateTimeframe,
  });

  const isSmallScreen = useIsSmallScreen();

  const totalRevenue =
    chartData?.reduce((sum, stage) => sum + (stage.value ?? 0), 0) ?? 0;

  return (
    <div className="w-full min-w-0">
      <div className="flex items-baseline justify-end px-1 pb-2">
        <span className="text-lg font-semibold" style={{ color: "#4a0f0a" }}>
          {nairaFormatter.format(totalRevenue)}
        </span>
      </div>

      <ChartContainer
        config={chartConfig}
        className="w-full h-[280px] sm:h-[340px] lg:h-[290px] pt-6 min-w-0"
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
                  ? nairaCompactAxis.format(value)
                  : String(value)
              }
              allowDecimals={false}
            />

            <Tooltip
              cursor={{ fill: "rgba(226, 114, 91, 0.08)" }}
              formatter={(value) =>
                value != null ? nairaFormatter.format(Number(value)) : ""
              }
            />

            <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={60}>
              {(chartData ?? []).map((entry) => (
                <Cell
                  key={entry.name}
                  fill={STAGE_COLORS[entry.name] ?? "#6B7280"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
