import { Component, ViewChild } from "@angular/core";
import { CourseEntity, CourseModuleEntity } from "../../interfaces";
import { Columns, DataTable, DataTableData, Option } from "../../../../core/modules/data-table/interfaces";
import { HttpError } from "../../../../core/interfaces";
import { AuthError } from "../../../auth/enum";
import { AppService } from "../../../../app.service";
import { CourseService } from "../../services";
import { ViewOptions } from "../../../../core/modules/dialog/interfaces";
import { Validators } from "@angular/forms";
import { EntityComponent } from "../../../../core/components";
import { DialogService } from "../../../../core/modules/dialog";
import { each, toTitleCase } from "../../../../core/utils";
import { Status } from "../../../../core/enums";
import { rowHeight, statusFormat, statusWidth, tableOptions, titleFormat, userNameWidth } from "../../../../core/data";
import { FormControlData } from "../../../../core/modules/form-validation/interfaces";

@Component({
    selector: "app-course",
    templateUrl: "./course.component.html",
    styleUrls: ["./course.component.scss"],
})
export class CourseComponent extends EntityComponent<CourseEntity>{

    @ViewChild("dataTable") public dataTable!: DataTable

    courseTypes?: string[];

    constructor(
        protected readonly app: AppService,
        private readonly dialogService: DialogService,
        private readonly courseService: CourseService,
    ) {
        super(app, dialogService, courseService, { name: "course", key: "code" });
        this.data = {
            dataSource: [], totalItems: 0, rowHeight,
            headers: ["Name", "Code", "Year", "Type", "Status", "Changed By"],
            keys: ["name", "code", "year", "type", "status", "updatedBy.name"],
            searchKeys: ["name", "code"],
            widths: ["auto", "70px", "80px", "80px", statusWidth, userNameWidth],
            aligns: ["left", "center", "center", "center", "center", "center"],
            classOf: { 4: ["nowrap"], 6: ["consolas"] },
            formatOf: { 4: titleFormat, 5: statusFormat },
            option: { ...tableOptions, width: "175px",
                main: { html: "<i class='icofont icofont-ui-add'></i>",
                    colorClass: "btn-app-primary-invert", disabled: !this.app.can(this.app.Do.COURSE_CREATE) },
                common: [
                    { html: "<i class='icofont icofont-ui-note'></i>",
                        colorClass: "btn-app-primary", disabled: !this.app.can(this.app.Do.COURSE_GET) },
                    { html: "<i class='icofont icofont-ui-edit'></i>",
                        colorClass: "btn-warning", disabled: !this.app.can(this.app.Do.COURSE_UPDATE) },
                    { html: "<i class='icofont icofont-ui-fire-wall'></i>",
                        colorClass: "btn-dark", disabled: !this.app.can(this.app.Do.COURSE_UPDATE_STATUS) },
                    { html: "<i class='icofont icofont-ui-delete'></i>",
                        colorClass: "btn-danger", disabled: !this.app.can(this.app.Do.COURSE_DELETE) },
                ] as Columns<Option, 4> },
        } as DataTableData<CourseEntity, 6>;
    }

    protected onInit(): void {
        this.courseService.getTypes()
            .subscribe({
                next: courseTypes => {
                    this.courseTypes = courseTypes;
                },
                error: (err: HttpError<AuthError>) => {
                    this.app.error(err.error.message);
                    AppService.log(err);
                },
            });
    }

    protected formData(course?: CourseEntity): FormControlData<CourseEntity>[] {
        return [
            { type: "text", name: "name", label: "Name", value: course?.name ?? "", required: true,
                validators: [Validators.minLength(3)] },
            { type: "text", name: "code", label: "Code", value: course?.code ?? "", required: true,
                validators: [Validators.minLength(3)] },
            { type: "number", name: "year", label: "Year", value: String(course?.year) ?? "", required: true,
                validators: [Validators.minLength(3)] },
            { type: "select", name: "type", label: "Status", value: course?.type ?? this.courseTypes?.[0],
                options: { values: this.courseTypes, labels: each(this.courseTypes!, titleFormat) }, required: true },
        ] as FormControlData<CourseEntity>[];
    }

    protected viewDialogData(course?: CourseEntity): ViewOptions<CourseEntity, 5, CourseModuleEntity> {
        return {
            title: "View Course",
            entity: course,
            headers: ["Name", "Code", "Type", "Modules", "Status"],
            keys: ["name", "code", "type", "modules", "status"],
            formatOf: {
                3: titleFormat,
                4: (modules: CourseModuleEntity[]) => (
                    `<ul class="ps-0">${modules.map(m => `<br><li class="small nowrap">${m.name}</li>`).join("")}</ul>`
                ),
                5: toTitleCase,
            },
            omitSeparator: [4],
        } as ViewOptions<CourseEntity, 5, CourseModuleEntity>;
    }
}
