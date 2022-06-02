// noinspection JSUnusedGlobalSymbols

import { AfterViewInit, Component, EventEmitter, Inject, Output, QueryList, ViewChildren } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { DialogButtons, IObject, PromptData, PromptResponse } from "../../interfaces";
import { FormControl, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import moment from "moment";
import { NgSelectComponent } from "@ng-select/ng-select";
import { DOCUMENT } from "@angular/common";
import { getIconAndColor, toFirstCase } from "../../utils";
import { toTitleCase } from "../../../../utils";

@Component({
    selector: "app-alert-dialog",
    templateUrl: "./prompt-dialog.component.html",
    styleUrls: ["../common.scss", "./prompt-dialog.component.scss"],
})
export class PromptDialogComponent implements AfterViewInit {

    @ViewChildren("select") ngSelectList!: QueryList<NgSelectComponent>;

    @Output() emitter: EventEmitter<PromptResponse> = new EventEmitter();

    public style: { icon: string, colorClass: string };

    public buttons?: DialogButtons | undefined;

    public formGroup: FormGroup;

    public requiredHTML = " <span class='text-danger'>*</span>"

    public normalTypes = ["color", "datetime-local", "email", "image", "month", "number", "password", "tel", "text", "time"]

    constructor(
        @Inject(MAT_DIALOG_DATA) public dialogData: PromptData<IObject, IObject>,
        @Inject(DOCUMENT) readonly document: Document,
        private readonly dialogRef: MatDialogRef<boolean>,
    ) {

        this.style = getIconAndColor(dialogData);

        this.buttons = dialogData.buttons;

        const groupData: {[key: string]: FormControl} = {};

        this.dialogData.formData.forEach(input => {
            let validators: ValidatorFn[] = [];
            if (input.validators?.length) validators = input.validators;
            if (input.required) validators.push(Validators.required);
            groupData[this.getName(input.name)] = new FormControl(input.value ?? "", validators);
        });

        this.formGroup = new FormGroup(groupData);
    }

    ngAfterViewInit(): void {
        this.ngSelectList.forEach(select => {
            if (select.element.getAttribute("data-name")){
                (select.element.querySelector("input") as HTMLInputElement).setAttribute("name", <string>select.element.getAttribute("data-name"));
            }
        });
    }

    submit(): void {
        this.emitter.emit({ prompt: this, form: this.formGroup });
        if (!this.dialogData.wait) {
            this.close();
        }
    }

    close(): void {
        this.dialogRef.close(false);
    }

    getOptionValue(options: { values: string[]; labels?: string[] }, i: number): string {
        return options?.labels ? options?.labels?.[i] : toFirstCase(options?.values[i]);
    }

    // @ts-ignore
    getName(name?: string | number | symbol): string {
        const names = String(name).split(".");
        return names[names.length ? names.length - 1 : 0];
    }

    dateChange(date: Date, element: HTMLInputElement): void {
        element.value = moment(date).format("YYYY-MM-DD");
    }

    focusNext(name?: string): void {
        if (name && name !== "null") {
            const element = document.querySelector(`[name="${name}"]`) as HTMLInputElement;
            element.focus();
            element.select();
        } else {
            const element = document.querySelector("[type=\"submit\"]") as HTMLButtonElement;
            if (element) element.focus();
        }
    }

    getLabel(label: string, name: string | number | symbol): string {
        return label ? label : toTitleCase(String(name));
    }
}
