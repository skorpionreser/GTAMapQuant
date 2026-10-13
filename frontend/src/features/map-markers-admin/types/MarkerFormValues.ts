import type { MarkerCategory } from "../../map/types/MarkerCategory";

export interface MarkerFormValues{
    name: string,
    description: string,
    category: MarkerCategory
    isStandard: boolean,
    x: string,
    y: string,
}
