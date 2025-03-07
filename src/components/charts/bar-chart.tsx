"use client";

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

// Custom tooltip for consistent styling
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

interface BarChartProps {
  data: Array<{ name: string; value: number }>;
  title: string;
  filterKey: string;
  activeFilters: string[];
  onFilterChange: (key: string, value: string, checked: boolean) => void;
  height?: number;
}

export default function BarChart({
  data,
  title,
  filterKey,
  activeFilters,
  onFilterChange,
  height = 220,
}: BarChartProps) {
  const handleBarClick = (entry: { name: string; value: number }) => {
    const isActive = activeFilters.includes(entry.name);
    onFilterChange(filterKey, entry.name, !isActive);
  };

  // Define colors for consistent styling
  const baseColor = "#6366f1"; // Indigo
  const selectedColor = "#f59e0b"; // Amber

  return (
    <Card className="w-full shadow-sm hover:shadow-md transition-shadow flex flex-col">
      <CardHeader className="pb-2 pt-4 px-4 text-center">
        <CardTitle className="text-md font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0 flex-1 flex items-center justify-center">
        <div className="w-full" style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart
              data={data}
              margin={{ top: 10, right: 10, left: 5, bottom: 30 }}
              barSize={30}
              barGap={2}
            >
              <defs>
                <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={baseColor} stopOpacity={1} />
                  <stop offset="100%" stopColor={baseColor} stopOpacity={0.7} />
                </linearGradient>
                <linearGradient id="colorSelected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={selectedColor} stopOpacity={1} />
                  <stop
                    offset="100%"
                    stopColor={selectedColor}
                    stopOpacity={0.7}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                tick={{ fontSize: 10 }}
                height={60}
                axisLine={{ stroke: "#e2e8f0" }}
                tickLine={{ stroke: "#e2e8f0" }}
              />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="value"
                fill="url(#colorBar)"
                cursor="pointer"
                onClick={handleBarClick}
                animationDuration={1000}
                animationBegin={200}
                radius={[4, 4, 0, 0]}
              >
                {data.map((entry, index) => {
                  const isSelected = activeFilters.includes(entry.name);
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        isSelected ? "url(#colorSelected)" : "url(#colorBar)"
                      }
                      style={{
                        filter: isSelected
                          ? "drop-shadow(0 0 3px rgba(245, 158, 11, 0.5))"
                          : "none",
                      }}
                    />
                  );
                })}
              </Bar>
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
