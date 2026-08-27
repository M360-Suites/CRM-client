"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { useAnalyticsPipelineStage } from "@/hooks/report/report_pipeline_stage";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#E2725B",
  },
} satisfies ChartConfig;

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
            data={chartData}
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

            <Bar
              dataKey="value"
              fill="var(--color-desktop)"
              radius={4}
              maxBarSize={60}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
