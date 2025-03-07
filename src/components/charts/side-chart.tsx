"use client";

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FilterState } from "@/types/IntersectionData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

// Custom tooltip component for consistent styling
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 border rounded-md shadow-md p-2 text-sm">
        <p className="font-medium">{`${label}`}</p>
        <p className="text-primary">{`Count: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

interface SideChartProps {
  data: any[];
  filters: FilterState;
  filterKey: keyof FilterState;
  updateFilter: (
    category: keyof FilterState,
    value: string | number,
    checked: boolean
  ) => void;
  title: string;
  limit?: number;
  height?: number;
}

export default function SideChart({
  data,
  filters,
  filterKey,
  updateFilter,
  title,
  limit = 5,
  height = 140,
}: SideChartProps) {
  const chartData = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach((item) => {
      const key = item[filterKey];
      if (key) counts[key] = (counts[key] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, limit);
  }, [data, filterKey, limit]);

  const handleClick = (entry: { name: string; value: number }) => {
    updateFilter(
      filterKey,
      entry.name,
      !(filters[filterKey] as string[]).includes(entry.name)
    );
  };

  // Define colors for consistent styling
  const baseColor = "#6366f1"; // Indigo
  const selectedColor = "#f59e0b"; // Amber

  return (
    <Card className="h-full shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-3 h-full flex flex-col">
        <h3 className="text-sm font-medium mb-2 text-center">{title}</h3>
        <ResponsiveContainer width="100%" height="100%" minHeight={100}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            barGap={2}
          >
            <XAxis type="number" hide domain={[0, "dataMax"]} />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 10 }}
              width={75}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="value"
              fill={baseColor}
              onClick={handleClick}
              cursor="pointer"
              animationDuration={800}
              animationBegin={0}
              radius={[0, 4, 4, 0]}
            >
              {chartData.map((entry, index) => {
                const isSelected = (filters[filterKey] as string[]).includes(
                  entry.name
                );
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={isSelected ? selectedColor : baseColor}
                    style={{
                      filter: isSelected
                        ? "drop-shadow(0 0 3px rgba(245, 158, 11, 0.5))"
                        : "none",
                    }}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
