import { Component, OnInit } from "@angular/core";
import { PollService } from "../../../../core/services/poll.service";
import { AppService } from "../../../../app.service";
import { DialogService } from "../../../../core/modules/dialog";
import { EntityComponent } from "../../../../core/components";
import { PollEntity } from "../../interfaces/poll";
import { HttpError, IObject } from "../../../../core/interfaces";
import { EnumValue } from "@angular/compiler-cli/src/ngtsc/partial_evaluator";
import { CommonError } from "../../../../core/enums";
import { each, groupBy, toLowerCase, toTitleCase } from "../../../../core/utils";
import { PollData } from "../../interfaces/poll/poll-data,interface";
import { FormControlData } from "../../../../core/modules/form-validation/interfaces";
import { Validators } from "@angular/forms";
import { regex } from "../../../../core/data";
import { ViewOptions } from "src/app/core/modules/dialog/interfaces";
import { PollTheme } from "./poll-card/poll-card.component";

@Component({
    selector: "app-poll",
    templateUrl: "./poll.component.html",
    styleUrls: ["./poll.component.scss"],
})
export class PollComponent extends EntityComponent<PollEntity> implements OnInit {
    public dataTable = undefined;

    loading: boolean = false;

    polls?: PollEntity[];

    constructor(
        protected readonly app: AppService,
        private readonly dialogService: DialogService,
        public readonly pollService: PollService,
    ) {
        super(app, dialogService, pollService, { name: "poll", key: "" });
    }

    ngOnInit(): void {
        this.getAppPolls();
    }

    protected formData(poll?: PollEntity): FormControlData<PollEntity, IObject>[] {
        return [
            { type: "text", name: "name", value: poll?.name ?? "", required: true },
            { type: "text", name: "code", info: "only `-`, `_` letters and numbers  are allowed",
                value: poll?.code ?? "", validators: [Validators.pattern(regex.pollCode)] },
            { type: "textarea", name: "description", value: poll?.description ?? "", rows: 2 },
            { type: "tag", name: "options", value: poll?.options ?? "", required: true, info: "Press `Enter` to add" },
            { type: "select", name: "color", value: poll?.options.themeClass ?? PollTheme.PRIMARY, required: true,
                options: { values: Object.values(PollTheme), labels: each(Object.values(PollTheme), toLowerCase, toTitleCase) } },
            { type: "checkbox", name: "requireIdentity", value: poll?.requireIdentity ?? false },
            { type: "checkbox", name: "updatable", value: poll?.updatable ?? true },
            { type: "checkbox", name: "removable", value: poll?.removable ?? true },
        ] as FormControlData<PollEntity>[];
    }

    // noinspection JSUnusedLocalSymbols
    protected viewDialogData(entity: PollEntity): ViewOptions<PollEntity, number, IObject> {
        throw new Error("Method not implemented.");
    }

    getAppPolls(): void {
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

    getPollData(poll: PollEntity): PollData[] {
        const data: PollData[] = [];
        const keys = poll.options.options;
        const dataMap = groupBy(poll.votes, (vote) => vote.option.option);
        for (const key of keys) {
            data.push({
                name: key,
                count: dataMap.get(key)?.length ?? 0,
            });
        }
        return data;
    }

    protected beforeAdd(formValues: Partial<PollEntity> & { color: PollTheme, options: string[] }, data?: Partial<PollEntity>): PollEntity {
        return super.beforeAdd({
            name: formValues.name,
            code: formValues.code ?? undefined,
            description: formValues.description,
            options: { options: formValues.options, themeClass: formValues.color },
            requireIdentity: formValues.requireIdentity,
            updatable: formValues.updatable,
            removable: formValues.removable,
        }, data);
    }
}
