"use client";
import React from "react";
import { FilterState, FilterOptions } from "../types/IntersectionData";

import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { MultiSelect } from "@/components/ui/multi-select";

interface FilterBarProps {
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
  className?: string;
}

const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  filterOptions,
  updateFilter,
  clearFilters,
  totalCount,
  filteredCount,
  className = "",
}) => {
  // Get active filter count for each category
  const getActiveFilterCount = (category: keyof FilterState): number => {
    return filters[category].length;
  };

  // Get total active filter count
  const totalActiveFilters = Object.keys(filters).reduce(
    (count, category) => count + filters[category as keyof FilterState].length,
    0
  );

  // NEW: Helper to update entire filter category based on MultiSelect changes.
  const handleMultiSelectChange = (
    category: keyof FilterState,
    newSelected: (string | number)[]
  ) => {
    const currentSelection = filters[category];
    (filterOptions[category] as (string | number)[]).forEach((option) => {
      const isInNew = newSelected.includes(option);
      const isCurrentlySelected = (
        currentSelection as (string | number)[]
      ).includes(option);
      if (isInNew && !isCurrentlySelected) {
        updateFilter(category, option, true);
      } else if (!isInNew && isCurrentlySelected) {
        updateFilter(category, option, false);
      }
    });
  };

  // NEW: Beautify category key names.
  const beautifyKey = (key: string) =>
    key.charAt(0).toUpperCase() + key.slice(1);

  return (
    <aside className={`sidebar h-screen border-r ${className} pb-8`}>
      <ScrollArea className="h-full pb-4">
        <div className="flex flex-col">
          <div className="bg-background pt-6 px-2">
            {/* Header content */}
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-2xl font-bold">
                Texas Intersection Dashboard
              </h1>
              {/* <ThemeToggle /> */}
            </div>
            <Separator className="my-4" />
            <CardHeader className="pb-2 px-0">
              {/* ...existing header inner content... */}
              <div className="flex items-center justify-between">
                <CardTitle>Filters</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  disabled={totalActiveFilters === 0}
                >
                  Clear All
                </Button>
              </div>
              <div className="text-sm text-muted-foreground flex flex-col gap-2">
                <span>
                  Showing {filteredCount} of {totalCount}
                </span>
                {totalActiveFilters > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {totalActiveFilters} active{" "}
                    {totalActiveFilters === 1 ? "filter" : "filters"}
                  </Badge>
                )}
              </div>
            </CardHeader>
          </div>

          <CardContent className="mt-4 px-2 mr-2">
            {/* Filters content */}
            {Object.keys(filterOptions).map((categoryKey) => {
              const category = categoryKey as keyof FilterState;
              return (
                <div key={category} className="mb-4">
                  <label className="block text-sm font-semibold mb-1">
                    {beautifyKey(category)}
                  </label>
                  <MultiSelect
                    options={(
                      filterOptions[category] as (string | number)[]
                    ).map((option) => ({
                      label: option.toString(),
                      value: option.toString(),
                    }))}
                    value={filters[category].map((val) => val.toString())}
                    onValueChange={(newSelected) =>
                      handleMultiSelectChange(category, newSelected)
                    }
                    placeholder={`Select ${beautifyKey(category).slice(
                      0,
                      8
                    )}...`}
                  />
                </div>
              );
            })}
            {totalActiveFilters > 0 && (
              <div className="mt-4">
                <Separator className="my-4" />
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    {totalActiveFilters} active{" "}
                    {totalActiveFilters === 1 ? "filter" : "filters"}
                  </div>
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    Clear All Filters
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </div>
      </ScrollArea>
    </aside>
  );
};

export default FilterBar;
