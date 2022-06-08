import { SortDir } from "../enums";

export interface SortFields {
    key: string | number | symbol,
    direction: SortDir
}

// @ts-ignore
export type Sort<Entity> = `${keyof Entity}.${SortDir}`;
