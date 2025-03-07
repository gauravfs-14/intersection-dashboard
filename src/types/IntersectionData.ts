interface IntersectionData {
    id: number;
    lat: number;
    lng: number;
    intersection: string;
    txdotDistrict: string;
    cityState: string;
    county: string;
    onSystem?: string;
    type: string;
    status: string;
    yearCompleted?: number;
    previousControlType?: string;
    approaches?: string;
    laneType?: string;
    icdFt?: number;
    icdM?: number;
    otherControlType?: string;
    comments?: string;
}