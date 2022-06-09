import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";
import { HttpError } from "../interfaces";
import { AuthError } from "../../modules/auth/enum";
import { EnumValue } from "@angular/compiler-cli/src/ngtsc/partial_evaluator";
import { AuthService } from "../../modules/auth/services";

@Injectable()
export class ErrorResponseInterceptor implements HttpInterceptor {

    constructor(private readonly authService: AuthService) {}

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return next.handle(request).pipe(catchError((error: HttpError<EnumValue & AuthError>) => {
            if (!(error.error instanceof ErrorEvent)) {
                if (error?.error?.code === AuthError.AUTH_401_INVALID_TOKEN) {
                    this.authService.logout();
                }
            }
            return throwError(() => error);
        }));
    }
}
