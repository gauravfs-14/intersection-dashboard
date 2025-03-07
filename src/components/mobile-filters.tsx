"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { FilterIcon } from "lucide-react";
import FilterBar from "./filter-bar";
import { FilterOptions, FilterState } from "@/types/IntersectionData";

interface MobileFiltersProps {
  filters: FilterState;
  filterOptions: FilterOptions;
  updateFilter: (
    category: keyof FilterState,
    value: string | number,
    checked: boolean
  ) => void;
  clearFilters: () => void;
  totalCount: number;
  filteredCount: number;
}

export default function MobileFilters({
  filters,
  filterOptions,
  updateFilter,
  clearFilters,
  totalCount,
  filteredCount,
}: MobileFiltersProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <FilterIcon className="h-4 w-4" />
          <span>Filters</span>
          {Object.values(filters).some((f) => f.length > 0) && (
            <span className="ml-1 rounded-full bg-primary w-5 h-5 text-[10px] flex items-center justify-center text-primary-foreground">
              {Object.values(filters).reduce(
                (acc, curr) => acc + curr.length,
                0
              )}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] p-0">
        <FilterBar
          filters={filters}
          filterOptions={filterOptions}
          updateFilter={updateFilter}
          clearFilters={clearFilters}
          totalCount={totalCount}
          filteredCount={filteredCount}
          className="border-0"
        />
      </SheetContent>
    </Sheet>
  );
}
