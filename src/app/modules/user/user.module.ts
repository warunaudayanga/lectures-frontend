import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
// import { ManageUserComponent } from "./components/manage-user/manage-user.component";
import { UserRoutingModule } from "./user-routing.module";
import { DataTableModule } from "../../core/modules/data-table/data-table.module";
import { ManageRolesComponent } from "./components/manage-roles/manage-roles.component";


@NgModule({
    declarations: [
        // ManageUserComponent,
        ManageRolesComponent,
    ],
    imports: [
        CommonModule,
        UserRoutingModule,
        DataTableModule,
    ],
})
export class UserModule { }
