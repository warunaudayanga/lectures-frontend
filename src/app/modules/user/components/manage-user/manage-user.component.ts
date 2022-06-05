import { Component, ViewChild } from "@angular/core";
import { EntityComponent } from "../../../../core/components";
import { UserEntity } from "../../../auth/interfaces";
import { AppService } from "../../../../app.service";
import { DialogService } from "../../../../core/modules/dialog";
import { UserService } from "../../services";
import { Columns, DataTable, DataTableData, Option } from "../../../../core/modules/data-table/interfaces";
import { HttpError, IObject } from "src/app/core/interfaces";
import { FormControlData } from "src/app/core/modules/form-validation/interfaces";
import { rowHeight, statusFormat, statusWidth, tableOptions, userNameWidth } from "../../../../core/data";
import { Validators } from "@angular/forms";
import { PromptResponse, ViewOptions } from "../../../../core/modules/dialog/interfaces";
import { RoleService } from "../../services/role.service";
import { RoleEntity } from "../../interfaces";
import { AuthError } from "../../../auth/enum";
import { CourseService } from "../../../lectures/services";
import { CourseEntity } from "../../../lectures/interfaces";
import { toFirstCase, toTitleCase, yesNo } from "../../../../core/utils";
import { EnumValue } from "@angular/compiler-cli/src/ngtsc/partial_evaluator";
import { CommonError } from "../../../../core/enums";
import { tag } from "../../../../core/templates/chip.template";

@Component({
    selector: "app-manage-user",
    templateUrl: "./manage-user.component.html",
    styleUrls: ["./manage-user.component.scss"],
})
export class ManageUserComponent extends EntityComponent<UserEntity> {

    @ViewChild("dataTable") dataTable!: DataTable;

    roles?: RoleEntity[];

    courses?: CourseEntity[];

    constructor(
        protected readonly app: AppService,
        private readonly dialogService: DialogService,
        private readonly userService: UserService,
        private readonly roleService: RoleService,
        private readonly courseService: CourseService,
    ) {
        super(app, dialogService, userService, { name: "user", key: "username" });
        this.data = {
            dataSource: [], totalItems: 0, rowHeight, option: { ...tableOptions,
                main: { html: "<i class='icofont icofont-ui-add'></i>",
                    colorClass: "btn-app-primary-invert", disabled: !this.app.can(this.app.Do.USER_CREATE) },
                width: "210px",
                common: [
                    { html: "<i class='icofont icofont-ui-note'></i>",
                        colorClass: "btn-app-primary", disabled: !this.app.can(this.app.Do.USER_GET) },
                    { html: "<i class='icofont icofont-ui-edit'></i>",
                        colorClass: "btn-warning", disabled: !this.app.can(this.app.Do.USER_UPDATE) },
                    { html: "<i class='icofont icofont-ui-fire-wall'></i>",
                        colorClass: "btn-dark", disabled: !this.app.can(this.app.Do.USER_UPDATE_STATUS) },
                    { html: "<i class='icofont icofont-cop-badge'></i>",
                        colorClass: "btn-dark", disabled: !this.app.can(this.app.Do.USER_UPDATE_ROLE) },
                    { html: "<i class='icofont icofont-ui-delete'></i>",
                        colorClass: "btn-danger", disabled: !this.app.can(this.app.Do.USER_DELETE) },
                ] as Columns<Option, 5> },
            headers: ["Name", "Student ID", "Course", "Role", "Status", "Changed By"],
            keys: ["name", "studentIdString", "course.code", "role.name", "status", "updatedBy.name"],
            searchKeys: ["name"],
            widths: ["auto", "auto", "85px", "85px", statusWidth, userNameWidth],
            aligns: ["left", "left", "center", "center", "center", "center"],
            classOf: { 6: ["consolas"] },
            formatOf: {
                4: (str: string): string => tag(["Admin", "l1"], ["Representative", "l2"], ["Student", "l3"])(toFirstCase(str)),
                5: statusFormat,
                6: (str: string): string => str || "Registered",
            },
        } as DataTableData<UserEntity, 6>;
    }

    protected onInit(): void {
        this.getAllRoles();
        this.getAllCourses();
    }

    getAllRoles(): void {
        this.roleService.getAll()
            .subscribe({
                next: res => {
                    this.roles = res.data;
                },
                error: (err: HttpError<AuthError>) => {
                    if (err.error.code === AuthError.AUTH_403_ROLE_FORBIDDEN) return;
                    this.app.error(err.error.message);
                    AppService.log(err);
                },
            });
    }

    getAllCourses(): void {
        this.courseService.getAll()
            .subscribe({
                next: res => {
                    this.courses = res.data;
                },
                error: (err: HttpError<AuthError>) => {
                    this.app.error(err.error.message);
                    AppService.log(err);
                },
            });
    }

    protected formData(user?: any): FormControlData<UserEntity>[] {
        return [
            { type: "text", name: "firstName", value: user?.firstName ?? "", required: true,
                validators: [Validators.minLength(3)] },
            { type: "text", name: "lastName", value: user?.lastName ?? "", required: true,
                validators: [Validators.minLength(3)] },
            { type: "text", name: "username", value: user?.username ?? "", required: true,
                validators: [Validators.minLength(3)] },
            { type: "password", name: "password", value: "", unchanged: Boolean(user),
                required: !user, validators: [Validators.minLength(6)] },
            { type: "select", name: "course", value: user?.course ?? this.courses?.[0], styleClass: ["large"],
                options: { values: this.courses, labelKey: "name" }, required: true },
            { type: "number", name: "studentId", label: "Student ID", value: user?.studentId ?? "", required: true,
                validators: [Validators.min(1)] },
            { type: "email", name: "email", value: user?.email ?? "", validators: [Validators.email] },
            { type: "text", name: "phone", value: user?.phone ?? "",
                validators: [Validators.minLength(10), Validators.maxLength(12)] },
        ] as FormControlData<UserEntity>[];
    }

    protected roleFormData(user?: any): FormControlData<UserEntity>[] {
        const defaultRole = this.roles?.find(r => r.name === "STUDENT")!;
        return [
            { type: "select", name: "role", required: true,
                value: {
                    ...user?.role, name: toFirstCase(user.role?.name),
                } ?? { ...defaultRole, name: toFirstCase(defaultRole.name) },
                options: {
                    values: this.roles?.map(r => ({ ...r, name: toFirstCase(r.name) })), labelKey: "name",
                } },
        ] as FormControlData<UserEntity>[];
    }

    protected viewDialogData(user: UserEntity): ViewOptions<UserEntity, number, IObject> {
        return {
            width: "700px",
            title: "View User",
            entity: user,
            headers: ["First Name", "Last Name", "Username", "Student ID", "Role", "Course",
                "E-mail", "Phone", "ID Verified", "Course Verified", "E-mail Verified", "Phone Verified", "Status"],
            keys: ["firstName", "lastName", "username", "studentIdString", "role.name", "course.name",
                "email", "phone", "studentIdVerified", "courseVerified", "emailVerified", "phoneVerified", "status"],
            formatOf: { 5: toTitleCase, 9: yesNo, 10: yesNo, 11: yesNo, 12: yesNo, 13: toTitleCase },
        } as ViewOptions<UserEntity, 13>;
    }

    changeRole(user: UserEntity): void {
        this.generateFormDialog(this.roleFormData(user), true)
            .subscribe((response: PromptResponse) => {
                if (response.form.valid) {
                    this.app.startLoading();
                    this.userService.changeRole(user.id, response.form.value.role)
                        .subscribe({
                            next: () => {
                                response.prompt.close();
                                this.app.stopLoading();
                                this.app.success("User role updated successfully");
                                this.getAll();
                            }, error: (err: HttpError<EnumValue & CommonError>) => {
                                this.app.error(err.error?.message ?? CommonError.ERROR);
                                this.app.stopLoading();
                                AppService.log(err);
                            },
                        });
                }
            });
    }
}
