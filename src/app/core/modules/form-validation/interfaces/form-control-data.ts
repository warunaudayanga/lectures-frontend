import { AbstractControlOptions, ValidatorFn } from "@angular/forms";
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
    type: "checkbox" | "color" | "date" | "datetime" | "datetime-local" |
        "email" | "file" | "hidden" | "image" | "month" | "number" | "tag" |
        "password" | "radio" | "range" | "reset" | "search" | "textarea" |
        "submit" | "tel" | "text" | "time" | "url" | "week" | "select" | "form-group";
    label?: string;
    rows?: number;
    info?: string;
    styleClass?: string[],
    // @ts-ignore
    name: keyof Entity | keyof SubEntity | `${keyof Entity}.${keyof SubEntity}` | string | number | symbol;
    options?: FormControlDataOptions<SubEntity>
    value?: string | number | IObject;
    required?: boolean;
    readonly?: boolean;
    unchanged?: boolean;
    // @ts-ignore
    matchesWith?: keyof Entity | keyof SubEntity | `${keyof Entity}.${keyof SubEntity}`;
    validators?: ValidatorFn[];
    formControlData?: FormControlData<Entity, SubEntity>;
}

export interface FormGroupData<Entity, SubEntity = IObject> {
    formControlData: FormControlData<Entity, SubEntity>[],
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
}
