import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ManageRolesComponent } from "./components/manage-roles/manage-roles.component";
// import { ManageUserComponent } from "./components/manage-user/manage-user.component";

const routes: Routes = [
    { path: "", redirectTo: "roles" },
    // { path: "manage", component: ManageUserComponent },
    { path: "roles", component: ManageRolesComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [],
})
export class UserRoutingModule { }
