// noinspection JSUnusedGlobalSymbols

import { AfterViewInit, Component, ElementRef, EventEmitter, Inject, Input, Output, QueryList, ViewChild, ViewChildren } from "@angular/core";
import moment from "moment";
import { toTitleCase } from "../../../../utils";
import { NgSelectComponent } from "@ng-select/ng-select";
import { UntypedFormControl, UntypedFormGroup, ValidatorFn, Validators } from "@angular/forms";
import { DOCUMENT } from "@angular/common";
import { IObject } from "../../../dialog/interfaces";
import { AppForm, FormControlData, FormControlDataOptions, FormGroupData } from "../../interfaces";
import { BaseEntity } from "../../../../entity";
import { AppService } from "../../../../../app.service";

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: "wx-form",
    templateUrl: "./form.component.html",
    styleUrls: ["./form.component.scss"],
})
export class FormComponent implements AfterViewInit, AppForm {

    initialized: boolean = false;

    @ViewChild("submitButton") submitButton!: ElementRef<HTMLButtonElement>;

    @ViewChildren("select") ngSelectList!: QueryList<NgSelectComponent>;

    @Input() update: boolean = false;

    @Input() formData?: FormGroupData<any, any> | FormControlData<any, any>[];

    @Input() size: "small" | "large" | "" = ""; // 31 38 48

    // eslint-disable-next-line @angular-eslint/no-output-on-prefix
    @Output() onSubmit: EventEmitter<UntypedFormGroup> = new EventEmitter();

    public formControlData?: FormControlData<any, any>[];

    public formGroup?: UntypedFormGroup;

    public requiredHTML = " <span class='text-danger'>*</span>";

    public normalTypes = ["color", "datetime-local", "email", "image", "month", "number", "password", "tel", "text", "time"];

    constructor(@Inject(DOCUMENT) readonly document: Document, public readonly app: AppService) {}

    init(): boolean {
        if (!this.initialized) {
            if (this.formData) {
                const groupData: { [key: string]: UntypedFormControl } = {};
                this.formControlData = Array.isArray(this.formData) ? this.formData : this.formData.formControlData;
                this.formControlData.forEach(input => {
                    let validators: ValidatorFn[] = [];
                    if (input.validators?.length) validators = input.validators;
                    if (input.required) validators.push(Validators.required);
                    groupData[this.getName(input.name)] = new UntypedFormControl(input.value ?? "", validators);
                });
                this.formGroup = new UntypedFormGroup(groupData, (this.formData as FormGroupData<any, any>).validatorOrOpts ?? undefined);
                this.initialized = true;
            }
        }
        return true;
    }

    ngAfterViewInit(): void {
        this.ngSelectList.forEach(select => {
            if (select.element.getAttribute("data-name")){
                (select.element.querySelector("input") as HTMLInputElement).setAttribute("name", <string>select.element.getAttribute("data-name"));
            }
        });
    }

    submit(): void {
        this.submitButton.nativeElement.click();
    }

    submitForm(): void {
        this.onSubmit.emit(this.formGroup);
    }

    getOptionLabel(options: FormControlDataOptions<any>, i: number): string {
        return options?.labels
            ? String(options?.labels?.[i])
            : typeof options?.values[i] === "object"
                ? (options?.values[i] as any)["name"] ?? "No Label"
                : String(options?.values[i]);
    }

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

    getLabel(name: string | number | symbol, label?: string): string {
        return label ? label : toTitleCase(String(name));
    }

    toString(value: any): string {
        return String(value);
    }

    getValues(options: FormControlDataOptions<IObject & BaseEntity>): (string | number)[] {
        if (options.labelKey) {
            return options.values.map(v => (v as IObject & BaseEntity)[options.valueKey!]);
        }
        return options.values as (string | number)[];
    }

    getClassList(size?: "small" | "large" | "", styleClass?: string[], moreStyles?: string[]): string[] {
        return [
            ...(size === "small" ? ["form-control-sm"] : []),
            ...(size === "large" ? ["form-control-lg"] : []),
            ...(styleClass ? styleClass : []),
            ...(moreStyles ? moreStyles : []),
        ];
    }
}
