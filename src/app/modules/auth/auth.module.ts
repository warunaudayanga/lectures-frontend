import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoginComponent, RegisterComponent } from "./components";
import { AuthRoutingModule } from "./auth.routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";


@NgModule({
    declarations: [
        LoginComponent,
        RegisterComponent,
    ],
    exports: [
        LoginComponent,
    ],
    imports: [
        CommonModule,
        AuthRoutingModule,
        FormsModule,
        ReactiveFormsModule,
    ],
})
export class AuthModule { }
