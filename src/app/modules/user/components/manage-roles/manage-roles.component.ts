import { Component, ViewChild } from "@angular/core";
import { EntityComponent } from "../../../../core/components";
import { RoleEntity } from "../../interfaces";
import { Columns, DataTable, DataTableData, Option } from "../../../../core/modules/data-table/interfaces";
import { ViewOptions } from "../../../../core/modules/dialog/interfaces";
import { AppService } from "../../../../app.service";
import { DialogService } from "../../../../core/modules/dialog";
import { RoleService } from "../../services/role.service";
import { HttpError } from "../../../../core/interfaces";
import { AuthError } from "../../../auth/enum";
import { each, toLowerCase, toTitleCase } from "../../../../core/utils";
import { Validators } from "@angular/forms";
import { rowHeight, statusFormat, statusWidth, userNameWidth } from "../../../../core/data";
import { FormControlData } from "../../../../core/modules/form-validation/interfaces";

@Component({
    selector: "app-manage-roles",
    templateUrl: "./manage-roles.component.html",
    styleUrls: ["./manage-roles.component.scss"],
})
export class ManageRolesComponent extends EntityComponent<RoleEntity> {

    @ViewChild("dataTable") public dataTable!: DataTable;

    permissions?: string[];

    constructor(
        protected readonly app: AppService,
        private readonly dialogService: DialogService,
        private readonly roleService: RoleService,
    ) {
        super(app, dialogService, roleService, { name: "role", key: "name" });
        this.data = {
            dataSource: [], totalItems: 0, rowHeight,
            headers: ["Name", "Status", "Changed By"],
            keys: ["name", "status", "createdBy.name"],
            searchKeys: ["name"],
            widths: ["auto", statusWidth, userNameWidth],
            aligns: ["left", "center", "center"],
            classOf: { 3: ["consolas"] },
            formatOf: { 2: statusFormat },
            option: {
                width: "175px",
                main: { html: "<i class='icofont icofont-ui-add'></i>",
                    colorClass: "btn-app-primary-invert", disabled: !this.app.can(this.app.Do.ROLE_CREATE) },
                common: [
                    { html: "<i class='icofont icofont-ui-note'></i>",
                        colorClass: "btn-app-primary", disabled: !this.app.can(this.app.Do.ROLE_GET) },
                    { html: "<i class='icofont icofont-ui-edit'></i>",
                        colorClass: "btn-warning", disabled: !this.app.can(this.app.Do.ROLE_UPDATE_PERMISSIONS) },
                    { html: "<i class='icofont icofont-ui-fire-wall'></i>",
                        colorClass: "btn-dark", disabled: !this.app.can(this.app.Do.ROLE_UPDATE_STATUS) },
                    { html: "<i class='icofont icofont-ui-delete'></i>",
                        colorClass: "btn-danger", disabled: !this.app.can(this.app.Do.ROLE_DELETE) },
                ] as Columns<Option, 4>,
            },
        } as DataTableData<RoleEntity, 3>;
    }

    protected onInit(): void {
        this.roleService.getPermissions()
            .subscribe({
                next: permissions => {
                    this.permissions = permissions;
                },
                error: (err: HttpError<AuthError>) => {
                    this.app.error(err.error.message);
                    AppService.log(err);
                },
            });
    }

    private viewTemplate(permissions: string[]): string {
        let template = "";
        permissions.forEach(p => {
            template += `<div>${p}</div>`;
        });
        return template;
    }

    protected formData(role?: RoleEntity): FormControlData<RoleEntity>[] {
        return [
            { type: "text", name: "name", label: "Name", value: role?.name ?? "", required: true,
                validators: [Validators.minLength(3)] },
            { type: "select", name: "permissions", label: "Permissions", value: role?.permissions ?? [],
                options: {
                    searchable: true,
                    multiple: true,
                    values: this.permissions,
                    labels: each(this.permissions!, toLowerCase, toTitleCase),
                }, required: true },
        ] as FormControlData<RoleEntity>[];
    }

    protected viewDialogData(role: RoleEntity): ViewOptions<RoleEntity, 3> {
        return {
            title: "View Role",
            entity: role,
            headers: ["Name", "Permissions", "Status"],
            formatOf: { 2: (p) => this.viewTemplate(p) },
            keys: ["name", "permissions", "status"],
        } as ViewOptions<RoleEntity, 3>;
    }

}
