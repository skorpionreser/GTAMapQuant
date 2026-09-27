import type { MarkerCategory } from "../../map/types/MarkerCategory";

export interface CreateMapMarkerRequest{
    name: string,
    description: string | null,
    category: MarkerCategory,
    x: number,
    y: number,
}