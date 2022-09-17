import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { firstValueFrom, Observable } from "rxjs";
import { AuthService } from "../services";
import { AppService } from "../../../app.service";
import { LocalStorageService } from "../../../core/services";

@Injectable({
    providedIn: "root",
})
export class AuthGuard implements CanActivate {

    constructor(
        private readonly app: AppService,
        private readonly auth: AuthService,
        private readonly router: Router,
        private readonly storageService: LocalStorageService,
    ) {}

    // noinspection JSUnusedLocalSymbols
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.autoAuth();
    }

    async autoAuth(): Promise<boolean> {
        const token = this.storageService.getTokenData();
        if (!token?.token) {
            await this.router.navigateByUrl("/auth");
            return false;
        }
        this.app.startLoading();
        try {
            const authData = await firstValueFrom(this.auth.refreshToken(token?.token!));
            this.auth.setLoggedIn(authData);
            this.app.stopLoading();
            return true;
        } catch (e: any) {
            await this.router.navigateByUrl("/auth");
            this.app.stopLoading();
            return false;
        }
    }

}

