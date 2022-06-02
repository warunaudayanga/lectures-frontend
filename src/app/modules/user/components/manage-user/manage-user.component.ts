// import { Component, OnInit, ViewChild } from "@angular/core";
// import { EntityComponent } from "../../../../core/components";
// import { UserEntity } from "../../../auth/interfaces";
// import { FormControlData } from "../../../../core/modules/dialog/interfaces";
// import { CourseEntity } from "../../../lectures/interfaces";
// import { AppService } from "../../../../app.service";
// import { DialogService } from "../../../../core/modules/dialog";
// import { UserService } from "../../services";
// import { DataTable } from "../../../../core/modules/data-table/interfaces";
//
// @Component({
//     selector: "app-manage-user",
//     templateUrl: "./manage-user.component.html",
//     styleUrls: ["./manage-user.component.scss"],
// })
// export class ManageUserComponent extends EntityComponent<UserEntity> implements OnInit {
//
//     @ViewChild("dataTable") dataTable!: DataTable;
//
//     constructor(
//         private readonly appService: AppService,
//         private readonly dialogService: DialogService,
//         private readonly userService: UserService,
//     ) {
//         super(appService, dialogService, userService, { name: "course", key: "username" });
//     }
//
//     protected add(): void {
//     }
//
//     protected createFormData(entity: any): FormControlData<CourseEntity>[] {
//         return [];
//     }
//
//     protected edit(entity: UserEntity): void {
//     }
//
//     protected view(entity: UserEntity): void {
//     }
//
// }
