"use client";

import { useState } from "react";
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
import { Card, CardContent } from "../ui/card";
import { LineChart as LineChartIcon, Expand, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Custom tooltip for consistent styling
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const color = payload[0]?.stroke || payload[0]?.color || "#6366f1";
    return (
      <div className="bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700 rounded-md shadow-md p-3 text-sm backdrop-blur-sm">
        <p className="font-medium mb-1 text-slate-900 dark:text-slate-100">{`Year: ${label}`}</p>
        <p style={{ color }}>{`Count: ${payload[0].value}`}</p>
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

// Define a color palette for the line/area chart
const colorPalette = [
  { base: "#6366f1", hover: "#4f46e5", selected: "#818cf8" }, // Indigo
  { base: "#06b6d4", hover: "#0891b2", selected: "#67e8f9" }, // Cyan
  { base: "#10b981", hover: "#059669", selected: "#34d399" }, // Emerald
  { base: "#f97316", hover: "#ea580c", selected: "#fb923c" }, // Orange
  { base: "#8b5cf6", hover: "#7c3aed", selected: "#a78bfa" }, // Purple
];

export default function LineChart({
  data,
  title,
  filterKey,
  activeFilters = [],
  onFilterChange,
}: LineChartProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

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

  // Determine which color to use based on the data series
  // For line charts we'll use a single color since it's one series
  const colorSet = colorPalette[0];

  return (
    <Card
      className={cn(
        "transition-all duration-300 relative overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900",
        isExpanded
          ? "fixed inset-5 z-999"
          : "w-full max-w-md mx-auto rounded-md shadow-md"
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setHoverIndex(null);
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <LineChartIcon className="text-sky-500 dark:text-sky-400 size-5" />
          <h3 className="font-medium text-sm">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {data.length} items
          </div>
          <button onClick={toggleExpand} className="p-1">
            {isExpanded ? <Minimize2 size={16} /> : <Expand size={16} />}
          </button>
        </div>
      </div>

      <CardContent className="px-4 pb-4 pt-2 flex-1 flex items-center justify-center h-full">
        {/* Replace fixed height style with a full height container */}
        <div className="w-full h-full">
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
              onMouseMove={(data) => {
                if (data && data.activeTooltipIndex !== undefined) {
                  setHoverIndex(data.activeTooltipIndex);
                }
              }}
              onMouseLeave={() => setHoverIndex(null)}
            >
              <defs>
                {colorPalette.map((color, index) => (
                  <linearGradient
                    key={`gradient-${index}`}
                    id={`colorValue-${index}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={color.base}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={color.base}
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                ))}

                {/* Selected gradient */}
                <linearGradient id="colorSelected" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={colorSet.selected}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={colorSet.selected}
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

              {/* Update the area with color mapping */}
              <Area
                type="monotone"
                dataKey="value"
                stroke={colorSet.base}
                strokeWidth={2}
                fill={`url(#colorValue-0)`}
                activeDot={{
                  r: 6,
                  stroke: colorSet.base,
                  strokeWidth: 2,
                  fill: "#fff",
                  cursor: "pointer",
                  onClick: (props: any) => {
                    if (props && props.payload) {
                      handleClick(props.payload);
                    }
                  },
                }}
                animationDuration={1200}
                animationBegin={300}
                style={{ cursor: "pointer" }}
              >
                {data.map((entry, index) => {
                  // For multiple data series in the future, we could use colorPalette[index % colorPalette.length]
                  const colorIndex = 0;

                  // Check if the entry is selected, handling type conversion for yearCompleted
                  const entryValue =
                    filterKey === "yearCompleted"
                      ? parseInt(entry.name, 10)
                      : entry.name;

                  const isSelected = activeFilters.includes(entryValue);
                  const isHovered = index === hoverIndex;

                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        isSelected
                          ? "url(#colorSelected)"
                          : `url(#colorValue-${colorIndex})`
                      }
                      stroke={
                        isSelected
                          ? colorSet.selected
                          : isHovered
                          ? colorSet.hover
                          : colorSet.base
                      }
                      strokeWidth={isHovered || isSelected ? 3 : 2}
                    />
                  );
                })}
              </Area>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>

      {/* Decorative bottom bar */}
      <div
        className={cn(
          "absolute bottom-0 left-0 h-1 bg-gradient-to-r from-sky-500 to-indigo-500 transition-all duration-300",
          isHovering ? "w-full" : "w-1/5"
        )}
      />
    </Card>
  );
}
