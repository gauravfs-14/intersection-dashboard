"use client";

import FilterBar from "@/components/filter-bar";
import MobileFilters from "@/components/mobile-filters";
import MapPanel from "@/components/panels/map-panel";
import DashboardCharts from "@/components/charts/dashboard-charts";
import SideChart from "@/components/charts/side-chart";
import StatCard from "@/components/stats-card";
import useIntersectionData from "@/hooks/useIntersectionData";
import { useMemo } from "react";
import { Card } from "@/components/ui/card";

export default function HomePage() {
  const {
    data,
    totalCount,
    filteredCount,
    filters,
    filterOptions,
    updateFilter,
    clearFilters,
  } = useIntersectionData();

  // Prepare stats for quick display
  const stats = useMemo(() => {
    const typeCount = Object.keys(
      data.reduce((acc, item) => {
        acc[item.type] = true;
        return acc;
      }, {} as Record<string, boolean>)
    ).length;

    const statusCount = Object.keys(
      data.reduce((acc, item) => {
        acc[item.status] = true;
        return acc;
      }, {} as Record<string, boolean>)
    ).length;

    const cityCount = Object.keys(
      data.reduce((acc, item) => {
        if (item.cityState) acc[item.cityState] = true;
        return acc;
      }, {} as Record<string, boolean>)
    ).length;

    const countyCount = Object.keys(
      data.reduce((acc, item) => {
        if (item.county) acc[item.county] = true;
        return acc;
      }, {} as Record<string, boolean>)
    ).length;

    const avgIcdFt = data.length
      ? data.reduce((sum, item) => sum + item.icdFt, 0) / data.length
      : 0;

    return {
      intersections: filteredCount,
      types: typeCount,
      statuses: statusCount,
      cities: cityCount,
      counties: countyCount,
      avgIcdFt: avgIcdFt.toFixed(1),
    };
  }, [data, filteredCount]);

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6">
      {/* Desktop Filters - hidden on mobile */}
      <div className="hidden md:block w-64 shrink-0">
        <FilterBar
          filters={filters}
          filterOptions={filterOptions}
          updateFilter={updateFilter}
          clearFilters={clearFilters}
          totalCount={totalCount}
          filteredCount={filteredCount}
        />
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold md:hidden">
            TX Intersections Dashboard
          </h1>
          <div className="md:hidden">
            <MobileFilters
              filters={filters}
              filterOptions={filterOptions}
              updateFilter={updateFilter}
              clearFilters={clearFilters}
              totalCount={totalCount}
              filteredCount={filteredCount}
            />
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <StatCard title="Intersections" value={stats.intersections} />
          <StatCard title="Types" value={stats.types} />
          <StatCard title="Statuses" value={stats.statuses} />
          <StatCard title="Cities" value={stats.cities} />
          <StatCard title="Counties" value={stats.counties} />
          <StatCard title="Avg ICD (ft)" value={stats.avgIcdFt} />
        </div>

        {/* Main Grid - 3x3 */}
        <div className="grid grid-cols-3 gap-6 h-[calc(100vh-220px)] grid-rows-3">
          {/* First column - 3 side charts */}
          <div className="col-span-1 flex flex-col h-full gap-2 row-span-3">
            <div className="h-1/3 pb-4">
              <SideChart
                data={data}
                filters={filters}
                filterKey="type"
                updateFilter={updateFilter}
                title="By Type"
              />
            </div>
            <div className="h-1/3 pb-4">
              <SideChart
                data={data}
                filters={filters}
                filterKey="laneType"
                updateFilter={updateFilter}
                title="By Lane Type"
              />
            </div>
            <div className="h-1/3">
              <SideChart
                data={data}
                filters={filters}
                filterKey="approaches"
                updateFilter={updateFilter}
                title="By Approach Count"
              />
            </div>
          </div>

          {/* Map area - spanning middle 2x2 area */}
          <div className="col-span-2 row-span-2">
            <Card className="h-full">
              <MapPanel data={data} />
            </Card>
          </div>

          {/* Bottom row - 2 additional charts */}
          <div className="col-span-2 col-start-2">
            <DashboardCharts
              data={data}
              filters={filters}
              updateFilter={updateFilter}
              layout="row"
            />
          </div>
        </div>
        {filteredCount > 0 && (
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Showing {filteredCount} of {totalCount} intersections
          </div>
        )}
      </div>
    </div>
  );
}
