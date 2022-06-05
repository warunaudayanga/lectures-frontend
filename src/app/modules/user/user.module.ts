import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ManageUserComponent, ManageRolesComponent } from "./components";
import { UserRoutingModule } from "./user-routing.module";
import { DataTableModule } from "../../core/modules/data-table/data-table.module";


@NgModule({
    declarations: [
        ManageUserComponent,
        ManageRolesComponent,
    ],
    imports: [
        CommonModule,
        UserRoutingModule,
        DataTableModule,
    ],
})
export class UserModule { }
