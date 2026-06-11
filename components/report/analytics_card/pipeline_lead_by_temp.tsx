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

  const dataWithColors =
    chartData?.map((item, i) => ({
      ...item,
      fill: COLORS[i % COLORS.length],
    })) ?? [];

  const total = dataWithColors.reduce((sum, item) => sum + item.value, 0);

  return (
    <ChartContainer
      config={chartConfig}
      className="w-full pt-6 aspect-square max-h-[400px] min-h-[260px]"
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
            innerRadius="45%"
            paddingAngle={4}
          />
          {/* center label — sibling of Pie, not child */}
          <text x="50%" y="45%" textAnchor="middle" dominantBaseline="middle">
            <tspan x="50%" dy="0" fontSize={13} fill="#888" fontWeight={400}>
              Total
            </tspan>
            <tspan
              x="50%"
              dy="22"
              fontSize={22}
              fontWeight={600}
              fill="#1a1a1a"
            >
              {total.toLocaleString()}
            </tspan>
          </text>
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
                      className="w-3 h-3 shrink-0 rounded-sm"
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
