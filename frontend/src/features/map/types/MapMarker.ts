import type { MarkerCategory } from "./MarkerCategory";
export interface MapMarker{
    id: string,
    name: string;
    description: string | null,
    category: MarkerCategory,
    x: number,
    y: number,
}