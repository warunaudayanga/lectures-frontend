import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent, RegisterComponent } from "./components";

const routes: Routes = [
    { path: "", redirectTo: "login" },
    { path: "login", component: LoginComponent },
    { path: "register", component: RegisterComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [],
})
export class AuthRoutingModule { }
