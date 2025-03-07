"use client";

import React, { useState, useEffect, JSX } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "react-leaflet-markercluster/styles";
import { ScrollArea } from "../ui/scroll-area";
import { Spinner } from "../ui/spinner";
import { IntersectionData } from "@/types/IntersectionData";
import { useTheme } from "next-themes";

// Define the custom icon (declared outside the component so it's not recreated)
const customIcon = new L.DivIcon({
  html: `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
    <g id="SVGRepo_iconCarrier">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M3.37892 10.2236L8 16L12.6211 10.2236C13.5137 9.10788 14 7.72154 14 6.29266V6C14 2.68629 11.3137 0 8 0C4.68629 0 2 2.68629 2 6V6.29266C2 7.72154 2.4863 9.10788 3.37892 10.2236ZM8 8C9.10457 8 10 7.10457 10 6C10 4.89543 9.10457 4 8 4C6.89543 4 6 4.89543 6 6C6 7.10457 6.89543 8 8 8Z" fill="#FF0000"></path>
    </g>
  </svg>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
  className: "custom-icon",
});

// Map tile URLs for light and dark themes
const mapTiles = {
  light: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  dark: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
};

// Popup component for marker details.
function MarkerPopup({ data }: { data: IntersectionData }) {
  return (
    <Popup className="dark:bg-gray-800 dark:text-white">
      <div className="p-2 dark:bg-gray-800 dark:text-white">
        <h3 className="font-semibold text-lg mb-2">{data.intersection}</h3>
        <ScrollArea className="h-[180px]">
          <ul className="space-y-1 text-sm">
            <li>
              <strong>City/State: </strong>
              {data.cityState || "N/A"}
            </li>
            <li>
              <strong>County: </strong>
              {data.county || "N/A"}
            </li>
            <li>
              <strong>Type: </strong>
              {data.type}
            </li>
            <li>
              <strong>Status: </strong>
              {data.status}
            </li>
            <li>
              <strong>Year Completed: </strong>
              {data.yearCompleted}
            </li>
            <li>
              <strong>Previous Control Type: </strong>
              {data.previousControlType || "N/A"}
            </li>
            <li>
              <strong>Approaches: </strong>
              {data.approaches}
            </li>
            <li>
              <strong>Lane Type: </strong>
              {data.laneType}
            </li>
            <li>
              <strong>Inner Circle Diameter (ft): </strong>
              {data.icdFt}
            </li>
            <li>
              <strong>Inner Circle Diameter (m): </strong>
              {data.icdM}
            </li>
            <li>
              <strong>TxDOT District: </strong>
              {data.txdotDistrict || "N/A"}
            </li>
            <li>
              <strong>On System: </strong>
              {data.onSystem || "N/A"}
            </li>
            {data.comments && (
              <li>
                <strong>Comments: </strong>
                {data.comments}
              </li>
            )}
          </ul>
        </ScrollArea>
      </div>
    </Popup>
  );
}

interface MapPanelProps {
  data: IntersectionData[];
}

export default function MapPanel({ data }: MapPanelProps) {
  const [loading, setLoading] = useState(true);
  const [markers, setMarkers] = useState<JSX.Element[]>([]);
  const { theme } = useTheme();

  // Turn off the spinner after data is available.
  useEffect(() => {
    if (data && data.length > 0) {
      const timer = setTimeout(() => setLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [data]);

  // Incrementally add markers in chunks so the UI remains responsive.
  useEffect(() => {
    if (!data || data.length === 0) return;

    let index = 0;
    const chunkSize = 100; // Adjust this value based on your dataset and performance needs.
    let accumulatedMarkers: JSX.Element[] = [];

    function addMarkersChunk() {
      // Create a chunk of markers.
      const chunk = data
        .slice(index, index + chunkSize)
        .filter((item) => item.lat && item.lng)
        .map((item, i) => (
          <Marker
            key={`${index + i}-${item.id}`}
            position={[parseFloat(item.lat), parseFloat(item.lng)]}
            icon={customIcon}
          >
            <MarkerPopup data={item} />
          </Marker>
        ));

      accumulatedMarkers = accumulatedMarkers.concat(chunk);
      setMarkers([...accumulatedMarkers]); // Update state with the new markers.

      index += chunkSize;
      if (index < data.length) {
        // Schedule the next chunk after yielding to the event loop.
        setTimeout(addMarkersChunk, 0);
      }
    }

    addMarkersChunk();
  }, [data]);

  if (loading) return <Spinner />;

  // Determine which map tiles to use based on theme
  const currentMapTiles = theme === "dark" ? mapTiles.dark : mapTiles.light;

  return (
    <div className="relative h-full w-full rounded-lg overflow-hidden border z-50">
      <MapContainer
        center={[31.5, -99.5]} // Center of Texas
        zoom={6}
        scrollWheelZoom={true}
        className={`h-full w-full ${
          theme === "dark" ? "dark-map" : "light-map"
        }`}
      >
        <TileLayer
          attribution={currentMapTiles.attribution}
          url={currentMapTiles.url}
        />
        <MarkerClusterGroup>{markers}</MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}
