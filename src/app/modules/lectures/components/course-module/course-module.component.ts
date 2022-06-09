import { Component, ViewChild } from "@angular/core";
import { Columns, DataTable, DataTableData, Option } from "../../../../core/modules/data-table/interfaces";
import { AppService } from "../../../../app.service";
import { DialogService } from "../../../../core/modules/dialog";
import { CourseModuleService } from "../../services";
import { rowHeight, statusFormat, statusWidth, userNameWidth } from "../../../../core/data";
import { CourseModuleEntity } from "../../interfaces";
import { HttpError } from "../../../../core/interfaces";
import { AuthError } from "../../../auth/enum";
import { ViewOptions } from "../../../../core/modules/dialog/interfaces";
import { Validators } from "@angular/forms";
import { toTitleCase } from "../../../../core/utils";
import { EntityComponent } from "../../../../core/components";
import { FormControlData } from "../../../../core/modules/form-validation/interfaces";

@Component({
    selector: "app-module-module",
    templateUrl: "./course-module.component.html",
    styleUrls: ["./course-module.component.scss"],
})
export class CourseModuleComponent extends EntityComponent<CourseModuleEntity>{

    @ViewChild("dataTable") public dataTable!: DataTable

    departments?: string[];

    constructor(
        protected readonly app: AppService,
        private readonly dialogService: DialogService,
        private readonly moduleService: CourseModuleService,
    ) {
        super(app, dialogService, moduleService, { name: "module", key: "code" });
        this.data = {
            dataSource: [], totalItems: 0, rowHeight,
            headers: ["Name", "Code", "Sem.", "Status", "Changed By"],
            keys: ["name", "code", "semester", "status", "createdBy.name"],
            searchKeys: ["name", "code"],
            widths: ["auto", "auto", "70px", statusWidth, userNameWidth],
            aligns: ["left", "center", "center", "center", "center"],
            classOf: { 5: ["consolas"] },
            formatOf: { 4: statusFormat }, option: {
                width: "175px",
                main: { html: "<i class='icofont icofont-ui-add'></i>",
                    colorClass: "btn-app-primary-invert", disabled: !this.app.can(this.app.Do.MODULE_CREATE) },
                common: [
                    { html: "<i class='icofont icofont-ui-note'></i>",
                        colorClass: "btn-app-primary", disabled: !this.app.can(this.app.Do.MODULE_GET) },
                    { html: "<i class='icofont icofont-ui-edit'></i>",
                        colorClass: "btn-warning", disabled: !this.app.can(this.app.Do.MODULE_UPDATE) },
                    { html: "<i class='icofont icofont-ui-fire-wall'></i>",
                        colorClass: "btn-dark", disabled: !this.app.can(this.app.Do.MODULE_UPDATE_STATUS) },
                    { html: "<i class='icofont icofont-ui-delete'></i>",
                        colorClass: "btn-danger", disabled: !this.app.can(this.app.Do.MODULE_DELETE) },
                ] as Columns<Option, 4>,
            },
        } as DataTableData<CourseModuleEntity, 5>;
    }

    protected onInit(): void {
        this.moduleService.getDepartments()
            .subscribe({
                next: departments => {
                    this.departments = departments;
                },
                error: (err: HttpError<AuthError>) => {
                    this.app.error(err.error.message);
                    AppService.log(err);
                },
            });
    }

    protected formData(module?: CourseModuleEntity): FormControlData<CourseModuleEntity>[] {
        return [
            { type: "text", name: "name", value: module?.name ?? "", required: true,
                validators: [Validators.minLength(3)] },
            { type: "select", name: "department", value: module?.department ?? this.departments?.[0],
                options: { values: this.departments }, required: true },
            { type: "number", name: "semester", value: module?.semester ?? 1, required: true,
                validators: [Validators.min(1), Validators.max(6)] },
            { type: "number", name: "credits", value: module?.credits ?? 1, required: true,
                validators: [Validators.min(1), Validators.max(10)] },
            { type: "text", name: "serial", value: module?.serial ?? "", required: true },
            { type: "checkbox", name: "revised", value: module?.revised ?? true, required: true },
            { type: "checkbox", name: "grouped", value: module?.grouped ?? false, required: true },
        ] as FormControlData<CourseModuleEntity>[];
    }

    protected viewDialogData(module: CourseModuleEntity): ViewOptions<CourseModuleEntity, 8> {
        return {
            title: "View Module",
            entity: module,
            headers: ["Name", "Department", "Semester", "Credits", "Serial", "Revised", "Code", "Status"],
            keys: ["name", "department", "semester", "credits", "serial", "revised", "code", "status"],
            formatOf: { 6: (revised: boolean): string => (revised ? "Yes" : "No"), 8: toTitleCase },
        } as ViewOptions<CourseModuleEntity, 8>;
    }

}
