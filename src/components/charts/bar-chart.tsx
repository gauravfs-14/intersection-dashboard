"use client";

import React, { useState } from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent } from "../ui/card";
import { BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

// Custom tooltip for consistent styling
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700 rounded-md shadow-md p-3 text-sm backdrop-blur-sm">
        <p className="font-medium mb-1 text-slate-900 dark:text-slate-100">{`${label}`}</p>
        <p className="text-indigo-600 dark:text-indigo-400 font-semibold">{`Count: ${payload[0].value}`}</p>
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

// Define a single color theme for the bar chart
const chartTheme = {
  base: "#6366f1", // Indigo
  hover: "#4f46e5", // Darker indigo
  selected: "#818cf8", // Lighter indigo
};

export default function BarChart({
  data,
  title,
  filterKey,
  activeFilters,
  onFilterChange,
  height = 220,
}: BarChartProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const handleBarClick = (entry: { name: string; value: number }) => {
    const isActive = activeFilters.includes(entry.name);
    onFilterChange(filterKey, entry.name, !isActive);
  };

  return (
    <Card
      className="w-full shadow-sm transition-all duration-300 flex flex-col border border-slate-200 dark:border-slate-700 relative overflow-hidden bg-white dark:bg-slate-900"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setHoverIndex(null);
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <BarChart3 className="text-indigo-500 dark:text-indigo-400 size-5" />
          <h3 className="font-medium text-sm">{title}</h3>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {data.length} items
        </div>
      </div>

      <CardContent className="px-4 py-4 pt-2 flex-1 flex items-center justify-center">
        <div className="w-full" style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart
              data={data}
              margin={{ top: 10, right: 10, left: 5, bottom: 30 }}
              barSize={30}
              barGap={2}
              className="transition-all duration-300"
              onClick={(data) => {
                if (data && data.activePayload && data.activePayload[0]) {
                  const entry = data.activePayload[0].payload;
                  handleBarClick(entry);
                }
              }}
            >
              <defs>
                {/* Create consistent gradients for this chart */}
                <linearGradient id="barColorBase" x1="0" y1="0" x2="0" y2="1">
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
                <linearGradient id="barColorHover" x1="0" y1="0" x2="0" y2="1">
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
                <linearGradient
                  id="barColorSelected"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
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

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
                strokeOpacity={0.8}
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
                width={30}
                tick={{ fontSize: 10 }}
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "rgba(0,0,0,0.04)" }}
              />

              <Bar
                dataKey="value"
                fill="url(#barColorBase)"
                cursor="pointer"
                animationDuration={1200}
                animationBegin={200}
                radius={[4, 4, 0, 0]}
                onMouseEnter={(data, index) => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(null)}
              >
                {data.map((entry, index) => {
                  const isSelected = activeFilters.includes(entry.name);
                  const isHovered = index === hoverIndex;

                  // All bars use the same color scheme, just different states
                  let fillUrl = "url(#barColorBase)";
                  if (isHovered) fillUrl = "url(#barColorHover)";
                  if (isSelected) fillUrl = "url(#barColorSelected)";

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
                        filter: isSelected
                          ? `drop-shadow(0 2px 4px ${chartTheme.selected}40)`
                          : isHovered
                          ? `drop-shadow(0 2px 4px ${chartTheme.hover}40)`
                          : "none",
                        transition: "filter 0.3s ease",
                      }}
                    />
                  );
                })}
              </Bar>
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>

      {/* Decorative bottom bar */}
      <div
        className={cn(
          "absolute bottom-0 left-0 h-1 bg-gradient-to-r from-indigo-500 to-indigo-400 transition-all duration-300",
          isHovering ? "w-full" : "w-1/5"
        )}
      />
    </Card>
  );
}
