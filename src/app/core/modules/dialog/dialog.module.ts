import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatDialogModule } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { ReactiveFormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { AlertDialogComponent, ViewDialogComponent, PromptDialogComponent } from "./components";
import { MomentModule } from "ngx-moment";
import { FormValidationModule } from "../form-validation";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";

@NgModule({
    declarations: [PromptDialogComponent, AlertDialogComponent, ViewDialogComponent],
    imports: [
        CommonModule,
        MatDialogModule,
        MatDividerModule,
        ReactiveFormsModule,
        FormValidationModule,
        NgSelectModule,
        MomentModule,
        MatSlideToggleModule,
    ],
})
export class DialogModule { }

