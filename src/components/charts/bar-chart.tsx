"use client";

import { useState } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { FilterState } from "@/types/IntersectionData";

interface BarChartProps {
  data: Array<{ name: string; value: number }>;
  title: string;
  filterKey: keyof FilterState;
  activeFilters: string[] | number[];
  onFilterChange: (
    category: keyof FilterState,
    value: string | number,
    checked: boolean
  ) => void;
}

export default function BarChart({
  data,
  title,
  filterKey,
  activeFilters,
  onFilterChange,
}: BarChartProps) {
  const handleBarClick = (entry: { name: string; value: number }) => {
    // Type-safe check for inclusion
    const isActive = activeFilters.some(
      (filter) => filter.toString() === entry.name.toString()
    );
    onFilterChange(filterKey, entry.name, !isActive);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart
              data={data}
              margin={{ top: 5, right: 20, left: 0, bottom: 25 }}
              barSize={20}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                tick={{ fontSize: 10 }}
                height={60}
              />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="value"
                fill="#8884d8"
                cursor="pointer"
                onClick={handleBarClick}
              >
                {data.map((entry, index) => {
                  // Type-safe check for cell highlighting
                  const isSelected = activeFilters.some(
                    (filter) => filter.toString() === entry.name.toString()
                  );

                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={isSelected ? "#ff7300" : "#8884d8"}
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
