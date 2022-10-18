import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormDirective, FormControlDirective } from "./directives";
import { FormComponent } from "./components";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { TagInputComponent } from "./components/tag-input/tag-input.component";

@NgModule({
    declarations: [FormDirective, FormControlDirective, FormComponent, TagInputComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgSelectModule,
        MatSlideToggleModule,
        BsDatepickerModule,
        FormsModule,
        MatDatepickerModule,
    ],
    exports: [
        FormDirective,
        FormControlDirective,
        FormComponent,
        TagInputComponent,
    ],
})
export class FormValidationModule { }
