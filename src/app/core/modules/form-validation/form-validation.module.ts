import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormDirective, FormControlDirective } from "./directives";

@NgModule({
    declarations: [FormDirective, FormControlDirective],
    imports: [
        CommonModule,
    ],
    exports: [
        FormDirective,
        FormControlDirective,
    ],
})
export class FormValidationModule { }
