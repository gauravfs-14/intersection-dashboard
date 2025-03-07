"use client";

import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

// Custom tooltip for consistent styling
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 border rounded-md shadow-md p-2 text-sm">
        <p className="font-medium">{`Year: ${label}`}</p>
        <p className="text-[#6366f1]">{`Count: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

interface LineChartProps {
  data: Array<{ name: string; value: number }>;
  title: string;
  filterKey?: string;
  activeFilters?: (string | number)[];
  onFilterChange?: (
    key: string,
    value: string | number,
    checked: boolean
  ) => void;
  height?: number;
}

export default function LineChart({
  data,
  title,
  filterKey,
  activeFilters = [],
  onFilterChange,
  height = 220,
}: LineChartProps) {
  // Improved click handler with better type safety and number conversion for years
  const handleClick = (entry: { name: string; value: number } | null) => {
    if (!filterKey || !onFilterChange || !entry) return;

    // Handle the case where filterKey is yearCompleted by converting to number
    let value: string | number = entry.name;

    // If this is a year filter, convert to number
    if (filterKey === "yearCompleted") {
      value = parseInt(entry.name, 10);
    }

    const isActive = activeFilters.includes(value);
    onFilterChange(filterKey, value, !isActive);
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
            <AreaChart
              data={data}
              margin={{ top: 10, right: 20, left: 5, bottom: 30 }}
              onClick={(data) => {
                // Handle clicks on the chart area
                if (data && data.activePayload && data.activePayload[0]) {
                  handleClick(data.activePayload[0].payload);
                }
              }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorSelected" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={selectedColor}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={selectedColor}
                    stopOpacity={0.1}
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
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10 }}
                width={30}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke={baseColor}
                strokeWidth={2}
                fill="url(#colorValue)"
                activeDot={{
                  r: 6,
                  stroke: baseColor,
                  strokeWidth: 2,
                  fill: "#fff",
                  cursor: "pointer",
                  onClick: (props: any) => {
                    // Handle clicks on dots with correct access pattern
                    if (props && props.payload) {
                      handleClick(props.payload);
                    }
                  },
                }}
                animationDuration={1200}
                animationBegin={300}
                style={{ cursor: "pointer" }}
              >
                {/* Render cells for all data points, similar to BarChart implementation */}
                {data.map((entry, index) => {
                  // Check if the entry is selected, handling type conversion for yearCompleted
                  const entryValue =
                    filterKey === "yearCompleted"
                      ? parseInt(entry.name, 10)
                      : entry.name;

                  const isSelected = activeFilters.includes(entryValue);

                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        isSelected ? "url(#colorSelected)" : "url(#colorValue)"
                      }
                      stroke={isSelected ? selectedColor : baseColor}
                    />
                  );
                })}
              </Area>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
