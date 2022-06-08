import { ValidatorFn } from "@angular/forms";
import { IObject } from "./common.interfaces";

export interface FormControlDataOptions<SubEntity> {
    values: string[] | number[] | IObject[],
    labels?: string[],
    valueKey?: keyof SubEntity,
    labelKey?: keyof SubEntity,
    multiple?: boolean,
    searchable?: boolean,
    clearable?: boolean,
}

export interface FormControlData<Entity, SubEntity = IObject> {
    type: "checkbox" | "color" | "date" | "datetime-local" |
        "email" | "file" | "hidden" | "image" | "month" | "number" |
        "password" | "radio" | "range" | "reset" | "search" |
        "submit" | "tel" | "text" | "time" | "url" | "week" | "select";
    label?: string;
    styleClass?: string[],
    // @ts-ignore
    name: keyof Entity | keyof SubEntity | `${keyof Entity}.${keyof SubEntity}` | string | number | symbol;
    options?: FormControlDataOptions<SubEntity>
    value?: string | number | IObject;
    required?: boolean;
    unchanged?: boolean;
    validators?: ValidatorFn[]
}
