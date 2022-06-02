import { Component, ViewChild } from "@angular/core";
import { DataTable, DataTableData } from "../../../../core/modules/data-table/interfaces";
import { AppService } from "../../../../app.service";
import { DialogService } from "../../../../core/modules/dialog";
import { LecturerService } from "../../services";
import { rowHeight, statusFormat, statusWidth, tableOptions, userNameWidth } from "../../../../core/data";
import { LecturerEntity } from "../../interfaces";
import { FormControlData, ViewOptions } from "../../../../core/modules/dialog/interfaces";
import { Validators } from "@angular/forms";
import { toTitleCase } from "../../../../core/utils";
import { EntityComponent } from "../../../../core/components";
import { ErrorResponse, HttpError } from "../../../../core/interfaces";
import { EnumValue } from "@angular/compiler-cli/src/ngtsc/partial_evaluator";
import { CommonError } from "../../../../core/enums";

@Component({
    selector: "app-lecturer",
    templateUrl: "./lecturer.component.html",
    styleUrls: ["./lecturer.component.scss"],
})
export class LecturerComponent extends EntityComponent<LecturerEntity> {

    @ViewChild("dataTable") public dataTable!: DataTable

    titles?: string[];

    constructor(
        private readonly appService: AppService,
        private readonly dialogService: DialogService,
        private readonly lecturerService: LecturerService,
    ) {
        super(appService, dialogService, lecturerService, { name: "lecturer", key: "" });
        this.data = {
            dataSource: [], totalItems: 0, rowHeight, option: tableOptions,
            headers: ["Name", "Email", "Mobile", "Status", "Changed By"],
            keys: ["name", "email", "mobile", "status", "createdBy.name"],
            searchKeys: ["name", "email", "mobile"],
            widths: ["auto", "auto", "85px", statusWidth, userNameWidth],
            aligns: ["left", "center", "center", "center", "center"],
            classOf: { 5: ["consolas"] },
            formatOf: { 4: statusFormat },
        } as DataTableData<LecturerEntity, 5>;
    }

    protected onInit(): void {
        this.lecturerService.getTitles()
            .subscribe({
                next: titles => {
                    this.titles = titles;
                },
                error: (err: HttpError<ErrorResponse<EnumValue & CommonError>>) => {
                    this.loading = false;
                    AppService.log(err);
                    this.app.error(err.error?.message ?? CommonError.ERROR);
                },
            });
    }

    protected formData(lecturer?: LecturerEntity): FormControlData<LecturerEntity>[] {
        return [
            { type: "select", name: "title", label: "Title", value: lecturer?.title ?? this.titles?.[0],
                options: { values: this.titles }, required: true },
            { type: "text", name: "firstName", label: "First Name", value: lecturer?.firstName ?? "", required: true,
                validators: [Validators.minLength(3)] },
            { type: "text", name: "lastName", label: "Last Name", value: lecturer?.lastName ?? "", required: true,
                validators: [Validators.minLength(3)] },
            { type: "email", name: "email", label: "E-mail", value: lecturer?.email ?? "",
                validators: [Validators.email] },
            { type: "text", name: "mobile", label: "Phone", value: lecturer?.mobile ?? "",
                validators: [Validators.max(12)] },
        ] as FormControlData<LecturerEntity, undefined>[];
    }

    protected viewDialogData(lecturer: LecturerEntity): ViewOptions<LecturerEntity, 6> {
        return {
            title: "View Lecturer",
            entity: lecturer,
            headers: ["Title", "First Name", "Last Name", "E-mail", "Mobile", "Status"],
            keys: ["title", "firstName", "lastName", "email", "mobile", "status"],
            formatOf: { 6: toTitleCase },
        } as ViewOptions<LecturerEntity, 6>;
    }

}
