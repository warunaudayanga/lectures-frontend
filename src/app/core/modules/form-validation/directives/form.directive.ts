import { Directive, ElementRef, HostListener } from "@angular/core";
import { AbstractControl, FormGroup, FormGroupDirective } from "@angular/forms";
import { AppService } from "../../../../app.service";
import { toFirstCase } from "../../../utils";

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: "[formGroup]",
})
export class FormDirective {

    constructor(
        private readonly element: ElementRef,
        private readonly fgDirective: FormGroupDirective,
        private readonly app: AppService,
    ) { }

    @HostListener("submit")
    onSubmit(): void {
        if (this.fgDirective.form.invalid) {
            const controlList = this.getInvalidControls(this.fgDirective.form);
            controlList.forEach((controlData, i) => {
                const controlElement: HTMLInputElement = this.element.nativeElement.querySelector("[name='" + controlData.key + "']");
                if (controlElement) {
                    controlElement.classList.add("is-invalid");
                    if (!i) {
                        const label = this.element.nativeElement.querySelector(`[for="${controlElement.id}"]`)?.innerText
                            .replace(" *", "");
                        const value = controlData.control.value;
                        const errors = controlData.control.errors ? controlData.control.errors : {};
                        controlElement.focus();
                        controlElement.select();
                        // eslint-disable-next-line no-console
                        console.log(errors);
                        if (errors["required"]) {
                            this.app.toast.error(`${toFirstCase(label)} cannot be empty!`);
                        } else if (errors["minlength"]) {
                            this.app.toast.error(`${toFirstCase(label)} must be at least ${errors["minlength"].requiredLength} characters long!`);
                        } else if (errors["maxlength"]) {
                            this.app.toast.error(`${toFirstCase(label)} cannot exceed ${errors["maxlength"].requiredLength} characters!`);
                        } else if (errors["email"]) {
                            this.app.toast.error(`'${value}' is not a valid email address!`);
                        } else if (errors["pattern"]) {
                            const matchWith = controlElement.getAttribute("data-match") || "";
                            this.app.toast.error(`${toFirstCase(label)} does not match ${matchWith ? "with " : ""}${matchWith}!`);
                        }
                    }
                }
            });
        }
    }

    getInvalidControls(group: FormGroup, prevControls?: {key: string, control: AbstractControl}[]): {key: string, control: AbstractControl}[] {
        let controlList: {key: string, control: AbstractControl}[] = [];
        if (prevControls?.length) controlList = prevControls;
        for (const key of Object.keys(group.controls)) {
            const control = group.controls[key];
            if (control instanceof FormGroup) {
                this.getInvalidControls(control, controlList);
            } else if (control.invalid) {
                controlList.push({ key, control });
            }
        }
        return controlList;
    }

}
