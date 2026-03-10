export type Placement = "home_screen" | "ride_summary" | "map_view";
export type Status = "active" | "inactive";

export const PLACEMENTS: { value: Placement; label: string }[] = [
  { value: "home_screen", label: "Home Screen" },
  { value: "ride_summary", label: "Ride Summary" },
  { value: "map_view", label: "Map View" },
];

export interface AdSpot {
  id: string;
  title: string;
  imageUrl: string;
  placement: Placement;
  status: Status;
  createdAt: string;
  deactivatedAt?: string;
  ttlMinutes?: number;
}

export interface CreateAdSpotRequest {
  title: string;
  imageUrl: string;
  placement: Placement;
  ttlMinutes?: number;
}
