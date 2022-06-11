import { Injectable } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from "@angular/common/http";
import { Observable } from "rxjs";
import { LocalStorageService } from "../../../core/services";
import { AuthService } from "../services";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private auth: AuthService, private readonly storageService: LocalStorageService) { }

    intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const token = this.storageService.getTokenData()?.token;
        if (token) {
            const authRequest: HttpRequest<unknown> = req.clone({
                headers: req.headers.set("Authorization", `${token}`),
            });
            return next.handle(authRequest);
        }
        return next.handle(req.clone());
    }
}
