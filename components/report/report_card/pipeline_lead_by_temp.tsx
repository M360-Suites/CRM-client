"use client";

import { PieChart, Pie, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { useReportLeadTemp } from "@/hooks/report/report_by_leadtemp";

const COLORS = ["#4a0f0a", "#5C2622", "#6E3E3A", "#805753", "#D4614A"];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#4a0f0a",
  },
} satisfies ChartConfig;

export default function PipelineByLeadTemp() {
  const { data: chartData } = useReportLeadTemp();

  const dataWithColors =
    chartData?.map((item, i) => ({
      ...item,
      fill: COLORS[i % COLORS.length],
    })) ?? [];

  const total = dataWithColors.reduce(
    (sum, item) => sum + Number(item.value),
    0,
  );

  return (
    <ChartContainer
      config={chartConfig}
      className="w-full h-[320px] sm:h-[360px] lg:h-[400px] min-w-0"
    >
      <ResponsiveContainer
        width="100%"
        height="100%"
        minWidth={0}
        minHeight={0}
      >
        <PieChart margin={{ top: 10, right: 10, bottom: 50, left: 10 }}>
          <Pie
            data={dataWithColors}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="45%"
            innerRadius="42%"
            outerRadius="65%"
            paddingAngle={4}
          />

          <text x="50%" y="33%" textAnchor="middle" dominantBaseline="middle">
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
              <div className="flex w-full flex-wrap justify-center gap-x-4 gap-y-2 px-2 pt-2">
                {dataWithColors.map((item) => (
                  <div
                    key={item.name}
                    className="flex min-w-0 items-center gap-2"
                  >
                    <span
                      className="h-3 w-3 shrink-0 rounded-sm"
                      style={{ background: item.fill }}
                    />

                    <span className="truncate text-xs sm:text-sm">
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
