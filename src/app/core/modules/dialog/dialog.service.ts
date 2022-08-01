import { EventEmitter, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import {
    DialogButtons,
    PromptOptions,
    PromptResponse,
    AlertOptions,
    ViewOptions,
    IObject, CSSMeasurement,
} from "./interfaces";
import { DialogLevel } from "./enums";
import { Validators } from "@angular/forms";
import { AlertDialogComponent, ViewDialogComponent, PromptDialogComponent } from "./components";
import { BaseEntity } from "../../entity";
import { FormControlData } from "../form-validation/interfaces";
import { Breakpoint } from "../../enums";

@Injectable({
    providedIn: "root",
})
export class DialogService {

    public maxWidth?: CSSMeasurement

    public initialBreakpoint?: Breakpoint

    private alertWidth = "450px";

    private alertClass = "dialog-container";

    constructor(private readonly dialog: MatDialog) { }

    public alert(options: AlertOptions): Observable<boolean> {
        const dialogRef = this.dialog.open(AlertDialogComponent, {
            width: options.width || this.alertWidth,
            disableClose: options.confirm,
            data: options,
            panelClass: [this.alertClass, options.level ?? "primary"],
        });
        return dialogRef.afterClosed();
    }

    public view(options: ViewOptions<IObject & BaseEntity, number>): Observable<boolean> {
        const dialogRef = this.dialog.open(ViewDialogComponent, {
            width: options.width ?? this.alertWidth,
            data: options,
            panelClass: [this.alertClass, options.level ?? "primary"],
            maxWidth: this.maxWidth,
        });
        return dialogRef.componentInstance.emitter;
    }

    public prompt<Entity extends BaseEntity, SubEntity extends IObject>(options: PromptOptions<Entity, SubEntity>): EventEmitter<PromptResponse> {
        const dialogRef = this.dialog.open(PromptDialogComponent, {
            width: options.width || this.alertWidth,
            disableClose: true,
            data: options,
            panelClass: [this.alertClass, "primary"],
            maxWidth: this.maxWidth,
        });
        return dialogRef.componentInstance.emitter as EventEmitter<PromptResponse>;
    }

    public confirm(message: string, level: DialogLevel, buttons?: DialogButtons): Observable<boolean> {
        return this.alert({ title: "Confirm", message, level, confirm: true, buttons });
    }

    public info(message: string, confirm?: boolean): Observable<boolean> {
        return this.alert({ title: "Information", message, level: DialogLevel.INFO, confirm });
    }

    public success(message: string, confirm?: boolean): Observable<boolean> {
        return this.alert({ title: "Success", message, level: DialogLevel.SUCCESS, confirm });
    }

    public warning(message: string, confirm?: boolean): Observable<boolean> {
        return this.alert({ title: "Warning", message, level: DialogLevel.WARNING, confirm });
    }

    public error(message: string, confirm?: boolean): Observable<boolean> {
        return this.alert({ title: "Error", message, level: DialogLevel.ERROR, confirm });
    }

    // noinspection JSUnusedGlobalSymbols
    public sampleAlert(): void {
        this.success("Successfully done nothing");
    }

    // noinspection JSUnusedGlobalSymbols
    public sampleConfirm(): void {
        this.error("Is it successful?", true);
    }

    // noinspection JSUnusedGlobalSymbols
    public samplePrompt(): void {
        const formData: FormControlData<any, any>[] = [
            { type: "email", name: "email", label: "Email", validators: [Validators.required, Validators.email, Validators.minLength(6)] },
            { type: "password", name: "password", label: "Password", validators: [Validators.required, Validators.minLength(6)] },
            { type: "password", name: "confirm", label: "Confirm", validators: [Validators.required, Validators.minLength(6)] },
        ];
        this.prompt({ title: "Register", formData, buttons: { ok: "Save" }, wait: true })
            .subscribe((response: PromptResponse) => {
                if (response.form.valid) {
                    if (response.form.value.password !== response.form.value.confirm) {
                        this.error("Password does not match");
                    } else {
                        response.prompt.close();
                    }
                }
            });
    }
}

