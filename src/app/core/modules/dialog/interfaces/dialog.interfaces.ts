import { DialogLevel } from "../enums";
import { FormGroup } from "@angular/forms";
import { PromptDialogComponent } from "../components";
import { Columns, CSSLength, IObject, ObjectKeys } from "./common.interfaces";
import { BaseEntity } from "../../../entity";
import { FormControlData } from "../../form-validation/interfaces";

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
    width?: CSSLength,
    updateForm?: boolean,
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

export interface PromptOptions<Entity, SubEntity = IObject> extends DialogOptions {
    formData: FormControlData<Entity, SubEntity>[],
    wait?: boolean
}

export type PromptData<Entity, SubEntity> = PromptOptions<Entity, SubEntity>;

export interface PromptResponse {
    prompt: PromptDialogComponent;
    form: FormGroup;
}
