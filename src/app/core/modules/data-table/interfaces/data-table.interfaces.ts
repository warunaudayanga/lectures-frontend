import { Columns, CSSMeasurement, IObject } from "./common.interfaces";

export interface Option {
    html: string,
    colorClass?: string;
    disabled?: ((value?: any) => boolean) | boolean;
}

export type Func = (value: any) => any;

export interface DataTableData<Entity, cols extends number, SubEntity = IObject> {
    dataSource: Entity[];
    totalItems: number;
    rowHeight: number
    headers: Columns<string, cols>;
    widths?: Columns<CSSMeasurement | undefined, cols>;
    aligns?: Columns<"left" | "right" | "center" | undefined, cols>;
    // @ts-ignore
    keys: Columns<keyof Entity | `${keyof Entity}.${keyof SubEntity}` | string | number | symbol, cols>;
    // @ts-ignore
    searchKeys?: (keyof Entity | `${keyof Entity}.${keyof SubEntity}` | string | number | symbol)[];
    format?: Columns<Function | undefined, cols>;
    classOf?: { [i: number]: string[] };
    formatOf?: { [i: number]: Func | Func[] };
    option?: {
        itemsPerPage?: number
        width: CSSMeasurement;
        main?: Option;
        common: Columns<Option, 1 | 2 | 3 | 4 | 5>;
    },
    disabledIds?: string[];
}

export declare class DataTable {
    update(): void
}
