export const MarkerCategory = {
    Other: 0,
    Shop: 1,
    ServiceStation: 2,
    Quest: 3,
} as const 

export type MarkerCategory = 
    (typeof MarkerCategory)[keyof typeof MarkerCategory]