import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../services";
import { AppService } from "../../../app.service";
import { Permission } from "../enum/permission.enum";

@Injectable({
    providedIn: "root",
})
export class RoleGuard implements CanActivate {

    constructor(private readonly auth: AuthService, private readonly app: AppService) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const permission = route.data.permission as Permission;
        const can = this.app.can(permission);
        if (!can) {
            this.app.load("/");
        }
        return can;
    }

}

