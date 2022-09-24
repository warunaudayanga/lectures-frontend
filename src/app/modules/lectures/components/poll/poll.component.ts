import { Component, OnInit } from "@angular/core";
import { PollService } from "../../services/poll.service";
import { AppService } from "../../../../app.service";
import { DialogService } from "../../../../core/modules/dialog";
import { EntityComponent } from "../../../../core/components";
import { PollAdditionalData, PollEntity } from "../../interfaces/poll";
import { HttpError, IObject } from "../../../../core/interfaces";
import { EnumValue } from "@angular/compiler-cli/src/ngtsc/partial_evaluator";
import { CommonError } from "../../../../core/enums";
import { each, toLowerCase, toTitleCase } from "../../../../core/utils";
import { FormControlData } from "../../../../core/modules/form-validation/interfaces";
import { Validators } from "@angular/forms";
import { regex } from "../../../../core/data";
import { ViewOptions } from "src/app/core/modules/dialog/interfaces";
import { PollTheme } from "./poll-card/poll-card.component";
import { SelectOptionsDialogComponent } from "./select-options-dialog/select-options-dialog.component";
import { SelectDialogResponse, TagOptions } from "../../interfaces/poll/select-dialog-response";
import { PollSelection } from "../../interfaces/poll/poll-option.interface";
import { DialogLevel } from "../../../../core/modules/dialog/enums";

@Component({
    selector: "app-poll",
    templateUrl: "./poll.component.html",
    styleUrls: ["./poll.component.scss"],
})
export class PollComponent extends EntityComponent<PollEntity> implements OnInit {
    public dataTable = undefined;

    loading: boolean = false;

    polls?: PollEntity[];

    tagOptions: TagOptions[] = [];

    constructor(
        public readonly app: AppService,
        protected readonly dialogService: DialogService,
        public readonly pollService: PollService,
    ) {
        super(app, dialogService, pollService, { name: "poll", key: "" });
    }

    ngOnInit(): void {
        this.getAll();
    }

    setOptionsPrompt(): void {
        const dialogRef = this.dialog.open<SelectOptionsDialogComponent, any, SelectDialogResponse>(SelectOptionsDialogComponent, {
            width: "600px",
            disableClose: true,
            data: {
                title: "Add Options",
                wait: true,
                icon: "icofont icofont-ui-add",
                colorClass: "app-primary",
                buttons: { ok: "Next" },
            },
            panelClass: ["dialog-container", "primary"],
            maxWidth: this.dialogService.maxWidth,
        });
        dialogRef.componentInstance.emitter
            .subscribe((response: SelectDialogResponse) => {
                if (response.options) {
                    this.tagOptions = response.options ?? [];
                    response.prompt.close();
                    this.add();
                }
            });
    }

    protected formData(poll?: Partial<PollEntity>): FormControlData<PollEntity, IObject>[] {
        const tagInputs: FormControlData<PollEntity, IObject>[] = [];
        if (this.tagOptions) {
            for (let i = 0; i < this.tagOptions.length; i++) {
                const value = poll?.options?.selections?.find(s => s.name === this.tagOptions[i].name)?.values ?? [];
                if (this.tagOptions?.[i]?.name) {
                    tagInputs.push({
                        type: "tag", name: this.tagOptions[i].name!, value, required: true,
                        info: `Option ${i + 1} (Press \`Enter\` to add)`, readonly: true,
                        label: `${this.tagOptions[i].label} ${this.tagOptions[i].multiple ? "<br>(multi choice)" : ""}`,
                    });
                }
            }
        }
        return [
            { type: "text", name: "name", value: poll?.name ?? "", required: true, readonly: true },
            { type: "text", name: "code", info: "only `-`, `_` letters and numbers  are allowed",
                value: poll?.code ?? "", validators: [Validators.pattern(regex.pollCode)], readonly: true },
            { type: "textarea", name: "description", value: poll?.description ?? "", rows: 2 },
            ...tagInputs,
            { type: "select", name: "color", value: poll?.options?.themeClass ?? PollTheme.PRIMARY, required: true,
                options: { values: Object.values(PollTheme), labels: each(Object.values(PollTheme), toLowerCase, toTitleCase) } },
            { type: "checkbox", name: "requireIdentity", value: poll?.requireIdentity ?? false, readonly: true },
            { type: "checkbox", name: "updatable", value: poll?.updatable ?? true },
            { type: "checkbox", name: "removable", value: poll?.removable ?? true },
        ] as FormControlData<PollEntity>[];
    }

    // noinspection JSUnusedLocalSymbols
    protected viewDialogData(entity: PollEntity): ViewOptions<PollEntity, number, IObject> {
        throw new Error("Method not implemented.");
    }

    getAll(): void {
        this.app.startLoading();
        this.pollService.getAll()
            .subscribe({
                next: res => {
                    this.app.stopLoading();
                    this.polls = res.data;
                },
                error: (err: HttpError<EnumValue & CommonError>) => {
                    this.app.error(err.error?.message ?? CommonError.ERROR);
                    this.app.stopLoading();
                    AppService.log(err);
                },
            });

    }

    toEntity(formValues: Partial<PollEntity> & PollAdditionalData): Partial<PollEntity> {
        const selections: PollSelection[] = [];
        for (const tagOption of this.tagOptions) {
            if (tagOption?.name) selections.push({ ...tagOption, values: formValues[tagOption?.name] ?? [] });
        }
        return {
            name: formValues.name,
            code: formValues.code ?? undefined,
            description: formValues.description,
            options: { selections, themeClass: formValues.color },
            requireIdentity: formValues.requireIdentity,
            updatable: formValues.updatable,
            removable: formValues.removable,
        };
    }

    onAdd(): void {
        this.setOptionsPrompt();
    }

    protected afterAdd(poll: PollEntity): void {
        this.polls?.push(poll);
    }

    onEdit(poll: PollEntity): void {
        this.tagOptions = poll.options?.selections?.map(s => ({
            name: s.name,
            label: s.label,
            multiple: s.multiple,
        })) ?? [];
        const pollAdditional: Partial<PollEntity & PollAdditionalData> = {
            ...poll,
            code: poll.code ?? undefined,
            color: poll.options?.themeClass ?? PollTheme.PRIMARY,
        };
        for (const tagOption of this.tagOptions) {
            if (tagOption?.name) pollAdditional[tagOption?.name] = poll.options?.selections?.find(s => s.name === tagOption.name)?.values ?? [];
        }
        this.edit<PollAdditionalData>(pollAdditional);
    }

    // noinspection JSUnusedLocalSymbols
    protected beforeAdd(formValues: Partial<PollEntity> & PollAdditionalData, data?: Partial<PollEntity>): Partial<PollEntity> {
        return this.toEntity(formValues);
    }

    // noinspection JSUnusedLocalSymbols
    protected beforeEdit(formValues: any, data?: Partial<PollEntity>): Partial<PollEntity> {
        return { ...this.toEntity(formValues), name: undefined, code: undefined, options: undefined };
    }

    onDelete(poll: PollEntity): void {
        this.dialogService.confirm(`Are you sure you want to delete poll '${poll.name}'`, DialogLevel.WARNING)
            .subscribe(result => {
                if (result) {
                    this.entityService?.delete(poll.id)
                        .subscribe({
                            next: () => {
                                this.app.success("Poll deleted successfully");
                                this.polls = this.polls?.filter(p => p.id !== poll.id);
                            }, error: (err: HttpError<EnumValue & CommonError>) => {
                                this.app.error(err.error?.message ?? CommonError.ERROR);
                                AppService.log(err);
                            },
                        });
                }
            });
    }
}
