import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { firstValueFrom, Observable } from "rxjs";
import { AuthService } from "../../modules/auth/services";
import { AppService } from "../../app.service";
import { LocalStorageService } from "../services";

@Injectable({
    providedIn: "root",
})
export class RouteGuard implements CanActivate {

    constructor(
        private readonly app: AppService,
        private readonly auth: AuthService,
        private readonly router: Router,
        private readonly storageService: LocalStorageService,
    ) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.autoAuth();
    }

    async autoAuth(): Promise<boolean> {
        const token = this.storageService.getTokenData();
        if (!token?.token) {
            return true;
        }
        this.app.startLoading();
        try {
            const authData = await firstValueFrom(this.auth.refreshToken(token?.token!));
            this.auth.setLoggedIn(authData);
            this.app.stopLoading();
            await this.router.navigateByUrl("/timetable");
            return false;
        } catch (e: any) {
            this.app.stopLoading();
            return true;
        }
        // await this.router.navigateByUrl("/timetable");
    }
}

