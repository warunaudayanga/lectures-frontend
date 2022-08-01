import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PageNotFoundComponent } from "./common/components";
import { RouteGuard } from "./core/guards";
import { AuthGuard } from "./modules/auth/guards";

const routes: Routes = [
    { path: "", loadChildren: () => import("./modules/lectures/lectures.module").then(m => m.LecturesModule), canActivate: [AuthGuard] },
    { path: "auth", loadChildren: () => import("./modules/auth/auth.module").then(m => m.AuthModule), canActivate: [RouteGuard] },
    { path: "user", loadChildren: () => import("./modules/user/user.module").then(m => m.UserModule), canActivate: [AuthGuard] },
    { path: "settings", loadChildren: () => import("./modules/settings/settings.module").then(m => m.SettingsModule), canActivate: [AuthGuard] },
    { path: "**", component: PageNotFoundComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule { }
