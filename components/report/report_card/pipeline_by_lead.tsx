"use client";

import { PieChart, Pie, Tooltip, ResponsiveContainer } from "recharts";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { useAnalyticsLeadSource } from "@/hooks/report/report_lead_source";

const COLORS = ["#4a0f0a", "#5C2622", "#6E3E3A", "#805753", "#D4614A"];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#4a0f0a",
  },
} satisfies ChartConfig;

export default function PipelineByLead() {
  const { data: chartData } = useAnalyticsLeadSource();

  const dataWithColors =
    chartData?.map((item, i) => ({
      ...item,
      fill: COLORS[i % COLORS.length],
    })) ?? [];

  return (
    <div className="w-full min-w-0">
      {/* Chart */}
      <ChartContainer
        config={chartConfig}
        className="w-full h-[280px] sm:h-[320px] lg:h-[350px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={dataWithColors}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius="70%"
              paddingAngle={4}
            />

            <Tooltip
              formatter={(value) =>
                value != null ? Number(value).toLocaleString() : ""
              }
            />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center mt-2 px-2 min-w-0">
        {dataWithColors.map((item) => (
          <div key={item.name} className="flex items-center gap-2 min-w-0">
            <span
              className="inline-block w-3 h-3 shrink-0 rounded-sm"
              style={{ background: item.fill }}
            />

            <span className="text-xs sm:text-sm whitespace-nowrap">
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
