"use client";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
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
  return (
    <ChartContainer config={chartConfig} className="h-full w-full pt-6">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="name"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => String(value)}
        />

        <YAxis
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) =>
            typeof value === "number" ? value.toLocaleString() : String(value)
          }
        />
        {/* use an actual data key from chartData (value or count) */}
        <Bar dataKey="value" fill="var(--color-desktop)" radius={4} />
        {/* <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} /> */}
      </BarChart>
    </ChartContainer>
  );
}
