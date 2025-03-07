"use client";

import React, { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
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
import { ChartBarIcon, Expand, Minimize2 } from "lucide-react"; // Added icons for expand/collapse
import { cn } from "@/lib/utils";

// Custom tooltip component for consistent styling
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700 rounded-md shadow-md p-2 text-sm backdrop-blur-sm">
        <p className="font-medium mb-1 text-slate-900 dark:text-slate-100">{`${label}`}</p>
        <p className="text-purple-600 dark:text-purple-400 font-semibold">{`Count: ${payload[0].value}`}</p>
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
  // limit prop is no longer used since limit will be computed dynamically.
}

// Define a single color theme for the side chart (different from bar chart)
const chartTheme = {
  base: "#8b5cf6", // Purple
  hover: "#7c3aed", // Darker purple
  selected: "#a78bfa", // Lighter purple
};

export default function SideChart({
  data,
  filters,
  filterKey,
  updateFilter,
  title,
}: SideChartProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Compute limit based on expansion state
  const computedLimit = isExpanded
    ? data.map((item) => item[filterKey]).filter(Boolean).length
    : 5;

  const chartData = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach((item) => {
      const key = item[filterKey];
      if (key) counts[key] = (counts[key] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, computedLimit);
  }, [data, filterKey, computedLimit]);

  const handleClick = (entry: { name: string; value: number }) => {
    updateFilter(
      filterKey,
      entry.name,
      !(filters[filterKey] as string[]).includes(entry.name)
    );
  };

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <Card
      className={cn(
        "transition-all duration-300 relative overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900",
        isExpanded
          ? "fixed inset-5 z-999"
          : "w-full max-w-md mx-auto rounded-md shadow-md h-full" // improved minimized styling
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
          <ChartBarIcon className="text-purple-500 dark:text-purple-400 size-5" />
          <h3 className="font-medium text-sm">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {chartData.length} items
          </div>
          <button onClick={toggleExpand} className="p-1">
            {isExpanded ? <Minimize2 size={16} /> : <Expand size={16} />}
          </button>
        </div>
      </div>

      {/* Chart content */}
      <div className="p-3 h-full pb-3">
        <ResponsiveContainer width="100%" height="100%" minHeight={100}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 10, left: 5, bottom: 5 }}
            barGap={2}
            onClick={(data) => {
              if (data && data.activePayload && data.activePayload[0]) {
                const entry = data.activePayload[0].payload;
                handleClick(entry);
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
              {/* Create consistent gradients for this chart */}
              <linearGradient id="sideBarBase" x1="0" y1="0" x2="1" y2="0">
                <stop
                  offset="0%"
                  stopColor={chartTheme.base}
                  stopOpacity={0.85}
                />
                <stop
                  offset="100%"
                  stopColor={chartTheme.base}
                  stopOpacity={0.6}
                />
              </linearGradient>
              <linearGradient id="sideBarHover" x1="0" y1="0" x2="1" y2="0">
                <stop
                  offset="0%"
                  stopColor={chartTheme.hover}
                  stopOpacity={0.95}
                />
                <stop
                  offset="100%"
                  stopColor={chartTheme.hover}
                  stopOpacity={0.75}
                />
              </linearGradient>
              <linearGradient id="sideBarSelected" x1="0" y1="0" x2="1" y2="0">
                <stop
                  offset="0%"
                  stopColor={chartTheme.selected}
                  stopOpacity={0.9}
                />
                <stop
                  offset="100%"
                  stopColor={chartTheme.selected}
                  stopOpacity={0.7}
                />
              </linearGradient>
            </defs>

            <XAxis
              type="number"
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
              domain={[0, "dataMax"]}
            />

            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 11, fill: "#64748b" }}
              width={80}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => {
                // Truncate long labels
                return value.length > 12
                  ? `${value.substring(0, 10)}...`
                  : value;
              }}
            />

            <Tooltip content={<CustomTooltip />} />

            <Bar
              dataKey="value"
              fill="url(#sideBarBase)"
              cursor="pointer"
              animationDuration={800}
              animationBegin={0}
              radius={[0, 4, 4, 0]}
              barSize={20}
              minPointSize={2}
            >
              {chartData.map((entry, index) => {
                const isSelected = (filters[filterKey] as string[]).includes(
                  entry.name
                );
                const isHovered = index === hoverIndex;

                // All bars use the same color scheme, just different states
                let fillUrl = "url(#sideBarBase)";
                if (isHovered) fillUrl = "url(#sideBarHover)";
                if (isSelected) fillUrl = "url(#sideBarSelected)";

                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={fillUrl}
                    stroke={
                      isHovered
                        ? chartTheme.hover
                        : isSelected
                        ? chartTheme.selected
                        : chartTheme.base
                    }
                    strokeWidth={1}
                    style={{
                      filter:
                        isSelected || isHovered
                          ? `drop-shadow(0 1px 2px ${chartTheme.base}40)`
                          : "none",
                      transition: "filter 0.2s ease",
                    }}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Fallback when no data is available */}
      {chartData.length === 0 && (
        <div className="flex items-center justify-center h-[100px] text-sm text-slate-500 dark:text-slate-400">
          No data available
        </div>
      )}

      {/* Decorative bottom bar */}
      <div
        className={cn(
          "absolute bottom-0 left-0 h-1 bg-gradient-to-r from-purple-500 to-violet-500 transition-all duration-300",
          isHovering ? "w-full" : "w-1/5"
        )}
      />
    </Card>
  );
}
