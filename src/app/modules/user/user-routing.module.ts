import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ManageUserComponent, ManageRolesComponent } from "./components";
import { RoleGuard } from "../auth/guards";
import { Permission } from "../auth/enum/permission.enum";

const routes: Routes = [
    { path: "", redirectTo: "roles" },
    { path: "manage", component: ManageUserComponent, canActivate: [RoleGuard], data: {
        permission: Permission.USER_VIEW,
    } },
    { path: "roles", component: ManageRolesComponent, canActivate: [RoleGuard], data: {
        permission: Permission.ROLE_VIEW,
    } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [],
})
export class UserRoutingModule { }
