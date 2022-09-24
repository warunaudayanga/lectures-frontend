import { Component, EventEmitter, Inject, Output, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { DialogButtons, IObject, PromptData } from "../../../../../core/modules/dialog/interfaces";
import { getIconAndColor } from "../../../../../core/modules/dialog/utils";
import { AppForm } from "../../../../../core/modules/form-validation/interfaces";
import { FormControl, Validators } from "@angular/forms";
import { SelectDialogResponse } from "../../../interfaces/poll/select-dialog-response";
import { AppService } from "../../../../../app.service";
import { toCamelCase, toSentenceCase } from "../../../../../core/utils";

export interface InputData {
    name: string;
    control: FormControl;
    multi: boolean;
}

@Component({
    selector: "app-select-options-dialog",
    templateUrl: "./select-options-dialog.component.html",
    styleUrls: [
        "../../../../../core/modules/dialog/components/prompt/prompt-dialog.component.scss",
        "../../../../../core/modules/dialog/components/common.scss",
        "./select-options-dialog.component.scss",
    ],
})
export class SelectOptionsDialogComponent {

    @ViewChild("form") form!: AppForm;

    @Output() emitter: EventEmitter<SelectDialogResponse> = new EventEmitter();

    public style: { icon: string, colorClass: string };

    public buttons?: DialogButtons | undefined;

    inputs: InputData[] = [
        { name: "Option 1", control: new FormControl("", Validators.required), multi: false },
    ];

    constructor(
        private readonly appService: AppService,
        @Inject(MAT_DIALOG_DATA) public dialogData: PromptData<IObject, IObject>,
        private readonly dialogRef: MatDialogRef<boolean>,
    ) {
        this.style = getIconAndColor(dialogData);
        this.buttons = dialogData.buttons;
    }

    addOption(): void {
        const name = `Option ${(this.inputs?.length ?? 0) + 1}`;
        const control = new FormControl("", Validators.required);
        this.inputs.push({ name, control, multi: false });
    }

    removeOption(input: InputData): void {
        this.inputs = this.inputs.filter(inp => inp !== input);
        for (let i = 0; i < this.inputs.length; i++) {
            this.inputs[i].name = `option-${i + 1}`;
        }
    }

    close(): void {
        this.dialogRef.close(false);
    }

    submit(): void {
        const values: string[] = [];
        for (const input of this.inputs) {
            if (!input.control.value) {
                this.appService.error("Please fill all options or remove empty Options");
                return;
            }
            if (values.includes(input.control.value)) {
                this.appService.error("Options must be unique");
                return;
            }
            values.push(input.control.value);
        }
        this.emitter.emit({ prompt: this,
            options: this.inputs.map(inp => ({ name: toCamelCase(inp.control.value), label: inp.control.value, multiple: inp.multi })) });
        if (!this.dialogData.wait) {
            this.close();
        }
    }

    getName(name: string): string {
        return toSentenceCase(name);
    }
}
