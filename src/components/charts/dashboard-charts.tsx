"use client";

import { IntersectionData, FilterState } from "@/types/IntersectionData";
import BarChart from "./bar-chart";
import LineChart from "./line-chart";
import { useMemo } from "react";

interface DashboardChartsProps {
  data: IntersectionData[];
  filters: FilterState;
  updateFilter: (
    category: keyof FilterState,
    value: string | number,
    checked: boolean
  ) => void;
  layout?: "row" | "grid";
}

export default function DashboardCharts({
  data,
  filters,
  updateFilter,
  layout = "grid",
}: DashboardChartsProps) {
  // Generate data for charts
  const typeChartData = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach((item) => {
      counts[item.type] = (counts[item.type] || 0) + 1;
    });

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [data]);

  const statusChartData = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach((item) => {
      counts[item.status] = (counts[item.status] || 0) + 1;
    });

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [data]);

  const approachesChartData = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach((item) => {
      counts[item.approaches] = (counts[item.approaches] || 0) + 1;
    });

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [data]);

  const yearChartData = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach((item) => {
      const year = item.yearCompleted.toString();
      counts[year] = (counts[year] || 0) + 1;
    });

    return Object.entries(counts)
      .filter(([year]) => year !== "0" && parseInt(year) > 1990)
      .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
      .map(([name, value]) => ({ name, value }));
  }, [data]);

  // Wrapper function to match the expected types in BarChart
  const handleFilterChange = (key: string, value: string, checked: boolean) => {
    updateFilter(key as keyof FilterState, value, checked);
  };

  if (layout === "row") {
    return (
      <div className="grid grid-cols-2 gap-6 h-full">
        <BarChart
          data={statusChartData}
          title="Intersections by Status"
          filterKey="status"
          activeFilters={filters.status}
          onFilterChange={handleFilterChange}
          height={180}
        />
        <LineChart
          data={yearChartData}
          title="Intersections by Year Completed"
          height={180}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart
          data={typeChartData}
          title="Intersections by Type"
          filterKey="type"
          activeFilters={filters.type}
          onFilterChange={handleFilterChange}
          height={220}
        />
        <BarChart
          data={statusChartData}
          title="Intersections by Status"
          filterKey="status"
          activeFilters={filters.status}
          onFilterChange={handleFilterChange}
          height={220}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart
          data={approachesChartData}
          title="Intersections by Approach Count"
          filterKey="approaches"
          activeFilters={filters.approaches}
          onFilterChange={handleFilterChange}
          height={220}
        />
        <LineChart
          data={yearChartData}
          title="Intersections by Year Completed"
          height={220}
        />
      </div>
    </div>
  );
}
