import { Component, ViewChild } from "@angular/core";
import { EntityComponent } from "../../../../core/components";
import { RoleEntity } from "../interfaces";
import { DataTable, DataTableData } from "../../../../core/modules/data-table/interfaces";
import { FormControlData, ViewOptions } from "../../../../core/modules/dialog/interfaces";
import { AppService } from "../../../../app.service";
import { DialogService } from "../../../../core/modules/dialog";
import { RoleService } from "../../services/role.service";
import { HttpError } from "../../../../core/interfaces";
import { AuthError } from "../../../auth/enum";
import { each, toLowerCase, toTitleCase } from "../../../../core/utils";
import { Validators } from "@angular/forms";
import { rowHeight, statusFormat, statusWidth, tableOptions, userNameWidth } from "../../../../core/data";

@Component({
    selector: "app-manage-roles",
    templateUrl: "./manage-roles.component.html",
    styleUrls: ["./manage-roles.component.scss"],
})
export class ManageRolesComponent extends EntityComponent<RoleEntity> {

    @ViewChild("dataTable") public dataTable!: DataTable;

    permissions?: string[];

    constructor(
        private readonly appService: AppService,
        private readonly dialogService: DialogService,
        private readonly roleService: RoleService,
    ) {
        super(appService, dialogService, roleService, { name: "role", key: "name" });
        this.data = {
            dataSource: [], totalItems: 0, rowHeight, option: tableOptions,
            headers: ["Name", "Status", "Changed By"],
            keys: ["name", "status", "createdBy.name"],
            searchKeys: ["name"],
            widths: ["auto", statusWidth, userNameWidth],
            aligns: ["left", "center", "center"],
            classOf: { 3: ["consolas"] },
            formatOf: { 2: statusFormat },
        } as DataTableData<RoleEntity, 3>;
    }

    protected onInit(): void {
        this.roleService.getPermissions()
            .subscribe({
                next: permissions => {
                    this.permissions = permissions;
                },
                error: (err: HttpError<AuthError>) => {
                    this.appService.error(err.error.message);
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
            { type: "select", name: "permissions", label: "Status", value: role?.permissions ?? [],
                options: {
                    multiple: true,
                    values: this.permissions,
                    labels: each(this.permissions!, toLowerCase, toTitleCase),
                }, required: true },
        ] as FormControlData<RoleEntity, undefined>[];
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
