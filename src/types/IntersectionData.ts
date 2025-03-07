export interface IntersectionData {
  id: string;
  lat: string;
  lng: string;
  intersection: string;
  txdotDistrict: string | null;
  cityState: string | null;
  county: string | null;
  onSystem: string | null;
  type: string;
  status: string;
  yearCompleted: number;
  previousControlType: string | null;
  approaches: string;
  laneType: string;
  icdFt: number;
  icdM: number;
  otherControlType: string | null;
  comments: string | null;
}

export interface FilterState {
  txdotDistrict: string[];
  cityState: string[];
  county: string[];
  onSystem: string[];
  type: string[];
  status: string[];
  yearCompleted: number[];
  previousControlType: string[];
  approaches: string[];
  laneType: string[];
}

export interface FilterOptions {
  txdotDistrict: string[];
  cityState: string[];
  county: string[];
  onSystem: string[];
  type: string[];
  status: string[];
  yearCompleted: number[];
  previousControlType: string[];
  approaches: string[];
  laneType: string[];
}
