"use client";
import { useState, useMemo } from "react";
import intersectionData from "../data/intersections.json";
import {
  IntersectionData,
  FilterState,
  FilterOptions,
} from "../types/IntersectionData";

const useIntersectionData = () => {
  // Initialize with the full dataset
  const [data] = useState<IntersectionData[]>(
    intersectionData as IntersectionData[]
  );

  // Initialize with empty filters
  const [filters, setFilters] = useState<FilterState>({
    txdotDistrict: [],
    cityState: [],
    county: [],
    onSystem: [],
    type: [],
    status: [],
    yearCompleted: [],
    previousControlType: [],
    approaches: [],
    laneType: [],
  });

  // Compute available filter options from data
  const filterOptions = useMemo<FilterOptions>(() => {
    return {
      txdotDistrict: [
        ...new Set(
          data
            .map((item) => item.txdotDistrict)
            .filter((val): val is string => !!val)
        ),
      ].sort(),
      cityState: [
        ...new Set(
          data
            .map((item) => item.cityState)
            .filter((val): val is string => !!val)
        ),
      ].sort(),
      county: [
        ...new Set(
          data.map((item) => item.county).filter((val): val is string => !!val)
        ),
      ].sort(),
      onSystem: [
        ...new Set(
          data
            .map((item) => item.onSystem)
            .filter((val): val is string => !!val)
        ),
      ].sort(),
      type: [
        ...new Set(
          data.map((item) => item.type).filter((val): val is string => !!val)
        ),
      ].sort(),
      status: [
        ...new Set(
          data.map((item) => item.status).filter((val): val is string => !!val)
        ),
      ].sort(),
      yearCompleted: [
        ...new Set(
          data
            .map((item) => item.yearCompleted)
            .filter((year): year is number => typeof year === "number")
        ),
      ].sort((a, b) => b - a),
      previousControlType: [
        ...new Set(
          data
            .map((item) => item.previousControlType)
            .filter((val): val is string => !!val)
        ),
      ].sort(),
      approaches: [
        ...new Set(
          data
            .map((item) => item.approaches)
            .filter((val): val is string => !!val)
        ),
      ].sort(),
      laneType: [
        ...new Set(
          data
            .map((item) => item.laneType)
            .filter((val): val is string => !!val)
        ),
      ].sort(),
    };
  }, [data]);

  // Apply filters to data
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Check each filter category and handle null values
      if (filters.txdotDistrict.length > 0) {
        if (item.txdotDistrict === null) return false;
        if (!filters.txdotDistrict.includes(item.txdotDistrict)) return false;
      }

      if (filters.cityState.length > 0) {
        if (item.cityState === null) return false;
        if (!filters.cityState.includes(item.cityState)) return false;
      }

      if (filters.county.length > 0) {
        if (item.county === null) return false;
        if (!filters.county.includes(item.county)) return false;
      }

      if (filters.onSystem.length > 0) {
        if (item.onSystem === null) return false;
        if (!filters.onSystem.includes(item.onSystem)) return false;
      }

      if (filters.type.length > 0 && !filters.type.includes(item.type))
        return false;

      if (filters.status.length > 0 && !filters.status.includes(item.status))
        return false;

      if (
        filters.yearCompleted.length > 0 &&
        !filters.yearCompleted.includes(item.yearCompleted)
      )
        return false;

      // Handle null values in previousControlType
      if (filters.previousControlType.length > 0) {
        if (item.previousControlType === null) return false;
        if (!filters.previousControlType.includes(item.previousControlType))
          return false;
      }

      if (
        filters.approaches.length > 0 &&
        !filters.approaches.includes(item.approaches)
      )
        return false;

      if (
        filters.laneType.length > 0 &&
        !filters.laneType.includes(item.laneType)
      )
        return false;

      return true;
    });
  }, [data, filters]);

  // Function to update filters
  const updateFilter = (
    category: keyof FilterState,
    value: string | number,
    checked: boolean
  ) => {
    setFilters((prev) => {
      const updatedFilter = [...prev[category]];

      if (checked) {
        // Type-safe way to add items to the array
        if (typeof value === "string") {
          (updatedFilter as string[]).push(value);
        } else if (typeof value === "number") {
          (updatedFilter as number[]).push(value);
        }
      } else {
        const index = updatedFilter.indexOf(value as any);
        if (index !== -1) {
          updatedFilter.splice(index, 1);
        }
      }

      return {
        ...prev,
        [category]: updatedFilter,
      };
    });
  };

  // Function to clear all filters
  const clearFilters = () => {
    setFilters({
      txdotDistrict: [],
      cityState: [],
      county: [],
      onSystem: [],
      type: [],
      status: [],
      yearCompleted: [],
      previousControlType: [],
      approaches: [],
      laneType: [],
    });
  };

  return {
    data: filteredData,
    totalCount: data.length,
    filteredCount: filteredData.length,
    filters,
    filterOptions,
    updateFilter,
    clearFilters,
  };
};

export default useIntersectionData;
