// noinspection JSUnusedGlobalSymbols

import { Component, EventEmitter, Inject, Output, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { DialogButtons, IObject, PromptData, PromptResponse } from "../../interfaces";
import { UntypedFormGroup } from "@angular/forms";
import { getIconAndColor } from "../../utils";
import { AppForm } from "../../../form-validation/interfaces";

@Component({
    selector: "app-alert-dialog",
    templateUrl: "./prompt-dialog.component.html",
    styleUrls: ["../common.scss", "./prompt-dialog.component.scss"],
})
export class PromptDialogComponent {

    @ViewChild("form") form!: AppForm;

    @Output() emitter: EventEmitter<PromptResponse> = new EventEmitter();

    public style: { icon: string, colorClass: string };

    public buttons?: DialogButtons | undefined;

    constructor(
        @Inject(MAT_DIALOG_DATA) public dialogData: PromptData<IObject, IObject>,
        private readonly dialogRef: MatDialogRef<boolean>,
    ) {
        this.style = getIconAndColor(dialogData);
        this.buttons = dialogData.buttons;
    }

    onSubmit(formGroup: UntypedFormGroup): void {
        this.emitter.emit({ prompt: this, form: formGroup });
        if (!this.dialogData.wait) {
            this.close();
        }
    }

    close(): void {
        this.dialogRef.close(false);
    }

    submit(): void {
        this.form.submit();
    }
}
