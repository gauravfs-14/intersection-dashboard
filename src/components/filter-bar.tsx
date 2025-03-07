// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "./ui/select";

import React, { SetStateAction } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export default function FilterBar({
  setMblDisplayPanel,
}: {
  setMblDisplayPanel: React.Dispatch<
    SetStateAction<
      | "map"
      | "severity"
      | "gender"
      | "classification"
      | "ethnicity"
      | "weather"
      | "intersection"
    >
  >;
}) {
  const handleSelect = (
    value:
      | "map"
      | "severity"
      | "gender"
      | "classification"
      | "ethnicity"
      | "weather"
      | "intersection"
  ) => {
    setMblDisplayPanel(value);
  };

  return (
    <>
      <div className="w-full bg-white shadow-md flex items-center p-4 justify-between h-16 mb-4">
        <div className="font-bold text-xl">
          15_24Motorcyclist Crash Dashboard
        </div>
        {/* <div className="flex gap-4">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select State" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>State</SelectLabel>
                <SelectItem value="apple">Texas</SelectItem>
                <SelectItem value="banana">South Dakota</SelectItem>
                <SelectItem value="blueberry">Alaska</SelectItem>
                <SelectItem value="grapes">Florida</SelectItem>
                <SelectItem value="pineapple">California</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Division" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Division</SelectLabel>
                <SelectItem value="apple">1</SelectItem>
                <SelectItem value="banana">2</SelectItem>
                <SelectItem value="blueberry">3</SelectItem>
                <SelectItem value="grapes">4</SelectItem>
                <SelectItem value="pineapple">5</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select County" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>County</SelectLabel>
                <SelectItem value="apple">County 1</SelectItem>
                <SelectItem value="banana">County 2</SelectItem>
                <SelectItem value="blueberry">County 3</SelectItem>
                <SelectItem value="grapes">County 4</SelectItem>
                <SelectItem value="pineapple">County 5</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Municipality" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Municipality</SelectLabel>
                <SelectItem value="apple">Municipality 1</SelectItem>
                <SelectItem value="banana">Municipality 2</SelectItem>
                <SelectItem value="blueberry">Municipality 3</SelectItem>
                <SelectItem value="grapes">Municipality 4</SelectItem>
                <SelectItem value="pineapple">Municipality 5</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

        </div> */}
        <div className="lg:hidden">
          <Select onValueChange={handleSelect}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Panel" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>State</SelectLabel>
                <SelectItem value="map">Map</SelectItem>
                <SelectItem value="severity">Severity</SelectItem>
                <SelectItem value="gender">Gender</SelectItem>
                <SelectItem value="classification">Classification</SelectItem>
                <SelectItem value="ethnicity">Ethnicity</SelectItem>
                <SelectItem value="weather">Weather</SelectItem>
                <SelectItem value="intersection">Intersection</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
}
