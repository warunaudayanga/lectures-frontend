import { DialogLevel } from "../enums";
import { FormGroup, ValidatorFn } from "@angular/forms";
import { PromptDialogComponent } from "../components";
import { Columns, CSSLength, IObject, ObjectKeys } from "./common.interfaces";
import { BaseEntity } from "../../../entity";

export interface DialogButtons {
    ok?: string;
    cancel?: string;
}

export interface DialogOptions {
    title: string,
    message?: string,
    icon?: string,
    colorClass?: string;
    level?: DialogLevel;
    buttons?: DialogButtons;
    width?: CSSLength
}

export interface AlertOptions extends DialogOptions {
    confirm?: boolean
}

export type AlertData = AlertOptions;

export interface ViewOptions<Entity extends BaseEntity, cols extends number, SubEntity = IObject> extends DialogOptions {
    entity: Entity,
    headers: Columns<string, cols>;
    // @ts-ignore
    keys: Columns<ObjectKeys<Entity, SubEntity> | string | number | symbol, cols>;
    format?: Columns<Function | undefined, cols>;
    formatOf?: { [i: number]: (value: any) => any },
    omitSeparator?: number[]
}

export type ViewData<Entity extends BaseEntity, cols extends number, SubEntity = IObject> = ViewOptions<Entity, cols, SubEntity>;

export interface FormControlData<Entity, SubEntity = IObject> {
    type: "checkbox" | "color" | "date" | "datetime-local" |
        "email" | "file" | "hidden" | "image" | "month" | "number" |
        "password" | "radio" | "range" | "reset" | "search" |
        "submit" | "tel" | "text" | "time" | "url" | "week" | "select";
    label: string;
    // @ts-ignore
    name: keyof Entity | keyof SubEntity | `${keyof Entity}.${keyof SubEntity}` | string | number | symbol;
    options?: {
        values: string[],
        labels?: string[],
        multiple?: boolean
    }
    value?: string | number;
    required?: boolean;
    unchanged?: boolean;
    validators?: ValidatorFn[]
}

export interface PromptOptions<Entity, SubEntity = IObject> extends DialogOptions {
    formData: FormControlData<Entity, SubEntity>[],
    wait?: boolean
}

export type PromptData<Entity, SubEntity> = PromptOptions<Entity, SubEntity>;

export interface PromptResponse {
    prompt: PromptDialogComponent;
    form: FormGroup;
}
