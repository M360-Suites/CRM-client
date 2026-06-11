"use client";
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
import { useAnalyticsPipelineStage } from "@/hooks/analytics/analytics_pipeline_stage";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#E2725B",
  },
} satisfies ChartConfig;

export default function PipelineByStage() {
  const { data: chartData } = useAnalyticsPipelineStage();
  console.log("Pipeline by stage data:", chartData);
  return (
    <ChartContainer
      config={chartConfig}
      className="w-full pt-6 min-h-[260px] max-h-[400px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 6, right: 8, left: 0, bottom: 6 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="name"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            interval={0}
            tick={{ fontSize: 11 }}
            tickFormatter={(value) => String(value)}
          />
          <YAxis
            width={40}
            tickLine={false}
            tickMargin={4}
            axisLine={false}
            tick={{ fontSize: 11 }}
            tickFormatter={(value) =>
              typeof value === "number"
                ? Intl.NumberFormat("en", { notation: "compact" }).format(value)
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
  );
}
