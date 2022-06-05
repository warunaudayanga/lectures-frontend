import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormDirective, FormControlDirective } from "./directives";
import { FormComponent } from "./components";
import { ReactiveFormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";

@NgModule({
    declarations: [FormDirective, FormControlDirective, FormComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgSelectModule,
        MatSlideToggleModule,
        BsDatepickerModule,
    ],
    exports: [
        FormDirective,
        FormControlDirective,
        FormComponent,
    ],
})
export class FormValidationModule { }
