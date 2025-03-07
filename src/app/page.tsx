"use client";

import FilterBar from "@/components/filter-bar";
import MobileFilters from "@/components/mobile-filters";
import MapPanel from "@/components/panels/map-panel";
import DashboardCharts from "@/components/charts/dashboard-charts";
import useIntersectionData from "@/hooks/useIntersectionData";

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Map Panel - takes 2/3 of the space on desktop */}
          <div className="md:col-span-2">
            <MapPanel data={data} />

            {filteredCount > 0 && (
              <div className="mt-2 text-center text-muted-foreground">
                Showing {filteredCount} of {totalCount} intersections
              </div>
            )}
          </div>

          {/* Charts Panel - takes 1/3 of the space on desktop */}
          <div className="md:col-span-1">
            <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card border rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold">{filteredCount}</div>
                  <div className="text-sm text-muted-foreground">
                    Intersections
                  </div>
                </div>
                <div className="bg-card border rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold">
                    {
                      Object.keys(
                        data.reduce((acc, item) => {
                          acc[item.type] = true;
                          return acc;
                        }, {} as Record<string, boolean>)
                      ).length
                    }
                  </div>
                  <div className="text-sm text-muted-foreground">Types</div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Panel - spans full width below map */}
          <div className="md:col-span-3">
            <h2 className="text-xl font-semibold mb-4">Interactive Charts</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Click on any bar to filter the data. Click again to remove the
              filter.
            </p>
            <DashboardCharts
              data={data}
              filters={filters}
              updateFilter={updateFilter}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
