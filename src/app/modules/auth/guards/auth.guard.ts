import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../services";
import { AppService } from "../../../app.service";

@Injectable({
    providedIn: "root",
})
export class AuthGuard implements CanActivate {

    constructor(
        private readonly app: AppService,
        private readonly auth: AuthService,
    ) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const isAuthenticated = this.auth.logged;
        if (!isAuthenticated) {
            this.app.load("/auth");
        }
        return isAuthenticated;
    }

}

