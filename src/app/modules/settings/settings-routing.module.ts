import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RoleGuard } from "../auth/guards";
import { EditProfileComponent } from "./components/edit-profile/edit-profile.component";
import { ChangePasswordComponent } from "./components/change-password/change-password.component";

const routes: Routes = [
    { path: "profile", component: EditProfileComponent, canActivate: [RoleGuard] },
    { path: "password", component: ChangePasswordComponent, canActivate: [RoleGuard] },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [],
})
export class SettingsRoutingModule { }
