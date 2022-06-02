import { Injectable } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from "@angular/common/http";
import { Observable } from "rxjs";
import { SessionStorageService } from "../../../core/services";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private readonly sessionService: SessionStorageService) { }

    intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const token = this.sessionService.getTokenData()?.token;
        if (token) {
            const authRequest: HttpRequest<unknown> = req.clone({
                headers: req.headers.set("Authorization", `${token}`),
            });
            return next.handle(authRequest);
        }
        return next.handle(req.clone());
    }
}
