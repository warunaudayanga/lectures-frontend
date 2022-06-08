import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../../modules/auth/services";

@Injectable({
    providedIn: "root",
})
export class RouteGuard implements CanActivate {

    constructor(private readonly authService: AuthService, private readonly router: Router) { }

    // noinspection JSUnusedLocalSymbols
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        this.authService.autoAuth();
        const isAuthenticated = this.authService.logged;
        if (isAuthenticated) {
            const ignored = this.router.navigateByUrl("/");
        }
        return !isAuthenticated;
    }

}

