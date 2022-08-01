import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EditProfileComponent } from "./components/edit-profile/edit-profile.component";
import { SettingsRoutingModule } from "./settings-routing.module";
import { FormValidationModule } from "../../core/modules/form-validation";
import { ChangePasswordComponent } from "./components/change-password/change-password.component";


@NgModule({
    declarations: [
        EditProfileComponent,
        ChangePasswordComponent,
    ],
    imports: [
        CommonModule,
        SettingsRoutingModule,
        FormValidationModule,
    ],
})
export class SettingsModule { }
