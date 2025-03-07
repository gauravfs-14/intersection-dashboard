"use client";
import React from "react";
import { FilterState, FilterOptions } from "../types/IntersectionData";

// Import Shadcn components
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

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

  // Render filter options for a category
  const renderFilterOptions = (
    category: keyof FilterState,
    options: (string | number)[]
  ) => {
    return (
      <ScrollArea className="h-[200px]">
        <div className="space-y-1 p-1">
          {options.map((option) => (
            <div
              key={`${category}-${option}`}
              className="flex items-center space-x-2 py-1"
            >
              <Checkbox
                id={`${category}-${option}`}
                checked={filters[category].includes(option as never)}
                onCheckedChange={(checked) =>
                  updateFilter(category, option, checked === true)
                }
              />
              <label
                htmlFor={`${category}-${option}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {option}
              </label>
            </div>
          ))}
        </div>
      </ScrollArea>
    );
  };

  return (
    <aside className={`sidebar h-screen border-r ${className}`}>
      <div className="flex h-full flex-col">
        <div className="sticky top-0 z-10 bg-background pt-6 px-4">
          <h1 className="text-2xl font-bold">TX Intersection Dashboard</h1>
          <Separator className="my-4" />
          <CardHeader className="pb-2 px-0">
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
            <div className="text-sm text-muted-foreground flex flex-col gap-2 items-left">
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
          {/* <Separator className="my-2" /> */}
        </div>

        <ScrollArea className="flex-1 px-4 pb-4">
          <Accordion type="multiple" className="w-full">
            <AccordionItem value="type">
              <AccordionTrigger className="flex justify-between py-2">
                <span>Intersection Type</span>
                {getActiveFilterCount("type") > 0 && (
                  <Badge variant="secondary" className="ml-auto mr-2">
                    {getActiveFilterCount("type")}
                  </Badge>
                )}
              </AccordionTrigger>
              <AccordionContent>
                {renderFilterOptions("type", filterOptions.type)}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="status">
              <AccordionTrigger className="flex justify-between py-2">
                <span>Status</span>
                {getActiveFilterCount("status") > 0 && (
                  <Badge variant="secondary" className="ml-auto mr-2">
                    {getActiveFilterCount("status")}
                  </Badge>
                )}
              </AccordionTrigger>
              <AccordionContent>
                {renderFilterOptions("status", filterOptions.status)}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="yearCompleted">
              <AccordionTrigger className="flex justify-between py-2">
                <span>Year Completed</span>
                {getActiveFilterCount("yearCompleted") > 0 && (
                  <Badge variant="secondary" className="ml-auto mr-2">
                    {getActiveFilterCount("yearCompleted")}
                  </Badge>
                )}
              </AccordionTrigger>
              <AccordionContent>
                {renderFilterOptions(
                  "yearCompleted",
                  filterOptions.yearCompleted
                )}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="txdotDistrict">
              <AccordionTrigger className="flex justify-between py-2">
                <span>District</span>
                {getActiveFilterCount("txdotDistrict") > 0 && (
                  <Badge variant="secondary" className="ml-auto mr-2">
                    {getActiveFilterCount("txdotDistrict")}
                  </Badge>
                )}
              </AccordionTrigger>
              <AccordionContent>
                {renderFilterOptions(
                  "txdotDistrict",
                  filterOptions.txdotDistrict
                )}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="cityState">
              <AccordionTrigger className="flex justify-between py-2">
                <span>City/State</span>
                {getActiveFilterCount("cityState") > 0 && (
                  <Badge variant="secondary" className="ml-auto mr-2">
                    {getActiveFilterCount("cityState")}
                  </Badge>
                )}
              </AccordionTrigger>
              <AccordionContent>
                {renderFilterOptions("cityState", filterOptions.cityState)}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="county">
              <AccordionTrigger className="flex justify-between py-2">
                <span>County</span>
                {getActiveFilterCount("county") > 0 && (
                  <Badge variant="secondary" className="ml-auto mr-2">
                    {getActiveFilterCount("county")}
                  </Badge>
                )}
              </AccordionTrigger>
              <AccordionContent>
                {renderFilterOptions("county", filterOptions.county)}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="onSystem">
              <AccordionTrigger className="flex justify-between py-2">
                <span>System</span>
                {getActiveFilterCount("onSystem") > 0 && (
                  <Badge variant="secondary" className="ml-auto mr-2">
                    {getActiveFilterCount("onSystem")}
                  </Badge>
                )}
              </AccordionTrigger>
              <AccordionContent>
                {renderFilterOptions("onSystem", filterOptions.onSystem)}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="previousControlType">
              <AccordionTrigger className="flex justify-between py-2">
                <span>Previous Control Type</span>
                {getActiveFilterCount("previousControlType") > 0 && (
                  <Badge variant="secondary" className="ml-auto mr-2">
                    {getActiveFilterCount("previousControlType")}
                  </Badge>
                )}
              </AccordionTrigger>
              <AccordionContent>
                {renderFilterOptions(
                  "previousControlType",
                  filterOptions.previousControlType
                )}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="approaches">
              <AccordionTrigger className="flex justify-between py-2">
                <span>Approaches</span>
                {getActiveFilterCount("approaches") > 0 && (
                  <Badge variant="secondary" className="ml-auto mr-2">
                    {getActiveFilterCount("approaches")}
                  </Badge>
                )}
              </AccordionTrigger>
              <AccordionContent>
                {renderFilterOptions("approaches", filterOptions.approaches)}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="laneType">
              <AccordionTrigger className="flex justify-between py-2">
                <span>Lane Type</span>
                {getActiveFilterCount("laneType") > 0 && (
                  <Badge variant="secondary" className="ml-auto mr-2">
                    {getActiveFilterCount("laneType")}
                  </Badge>
                )}
              </AccordionTrigger>
              <AccordionContent>
                {renderFilterOptions("laneType", filterOptions.laneType)}
              </AccordionContent>
            </AccordionItem>
          </Accordion>

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
        </ScrollArea>
      </div>
    </aside>
  );
};

export default FilterBar;
