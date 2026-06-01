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
    <ChartContainer config={chartConfig} className="h-full w-full pt-6">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={dataWithColors}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            paddingAngle={4}
            label
          />
          <Tooltip
            formatter={(value) =>
              value != null ? Number(value).toLocaleString() : ""
            }
          />
          <Legend
            layout="horizontal"
            align="center"
            verticalAlign="bottom"
            iconSize={10}
            content={() => (
              <div className="flex flex-wrap gap-4 justify-center mt-2">
                {dataWithColors.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <span
                      className="w-4 h-4"
                      style={{ background: item.fill }}
                    />
                    <span className="text-sm">{item.name}</span>
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
