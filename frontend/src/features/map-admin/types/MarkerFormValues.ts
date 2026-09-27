import type { MarkerCategory } from "../../map/types/MarkerCategory";

export interface MarkerFormValues{
    name: string,
    description: string,
    category: MarkerCategory
    x: string,
    y: string,
}