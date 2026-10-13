import type { MarkerCategory } from "../../map/types/MarkerCategory";

export interface CreateMapMarkerRequest{
    name: string,
    description: string | null,
    category: MarkerCategory,
    isStandard: boolean,
    x: number,
    y: number,
}
