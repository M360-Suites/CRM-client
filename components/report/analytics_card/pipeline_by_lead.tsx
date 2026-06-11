"use client";
import { PieChart, Pie, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { useAnalyticsLeadSource } from "@/hooks/analytics/analytics_lead_source";

const COLORS = ["#E2725B", "#FFD9C0", "#F5B7A3", "#E8A898", "#D4614A"];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#E2725B",
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
    <ChartContainer
      config={chartConfig}
      className="w-full pt-6 aspect-square min-h-[260px] max-h-[400px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={dataWithColors}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius="80%"
            paddingAngle={4}
          />
          <Tooltip
            formatter={(value) =>
              value != null ? Number(value).toLocaleString() : ""
            }
          />
          <Legend
            verticalAlign="bottom"
            content={() => (
              <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center mt-2 px-2">
                {dataWithColors.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
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
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
