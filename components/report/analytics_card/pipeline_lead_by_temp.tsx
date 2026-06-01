"use client";
import { PieChart, Pie, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { useReportLeadTemp } from "@/hooks/report/report_by_leadtemp";

const COLORS = ["#E2725B", "#FFD9C0", "#F5B7A3", "#E8A898", "#D4614A"];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#E2725B",
  },
} satisfies ChartConfig;

export default function PipelineByLeadTemp() {
  const { data: chartData } = useReportLeadTemp();
  console.log("data for temp:", chartData);

  const dataWithColors =
    chartData?.map((item, i) => ({
      ...item,
      fill: COLORS[i % COLORS.length],
    })) ?? [];

  const total = dataWithColors.reduce((sum, item) => sum + item.value, 0);

  return (
    <ChartContainer config={chartConfig} className="w-full pt-6">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={dataWithColors}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            innerRadius={50}
            paddingAngle={4}
            label
          >
            {/* center label */}
            <text x="50%" y="42%" textAnchor="middle" dominantBaseline="middle">
              <tspan x="50%" dy="0" fontSize={13} fill="#888" fontWeight={400}>
                Total
              </tspan>
              <tspan
                x="50%"
                dy="20"
                fontSize={22}
                fontWeight={600}
                fill="#1a1a1a"
              >
                {total.toLocaleString()}
              </tspan>
            </text>
          </Pie>
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
