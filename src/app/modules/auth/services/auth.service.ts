import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, Subject, tap } from "rxjs";
import { Router } from "@angular/router";
import { environment } from "../../../../environments/environment";
import { AuthData, UserEntity } from "../interfaces";
import { SessionStorageService } from "../../../core/services";
import { RegisterDto, LoginDto } from "../dto";

@Injectable({
    providedIn: "root",
})
export class AuthService {

    private authApiUrl = environment.apiUrl + "/auth";

    private _logged: boolean = false;

    private _user?: UserEntity;

    get logged(): boolean {
        return this._logged;
    }

    set logged(logged: boolean) {
        this._logged = logged;
    }

    get user(): UserEntity | undefined {
        return this._user;
    }

    set user(value: UserEntity | undefined) {
        this._user = value;
    }

    private loggedInListener: Subject<boolean> = new Subject<boolean>();

    private userListener: Subject<UserEntity | undefined> = new Subject<UserEntity | undefined>();

    constructor(
        private readonly router: Router,
        private readonly http: HttpClient,
        private readonly sessionStorageService: SessionStorageService,
    ) {}

    register(registerDto: RegisterDto): Observable<UserEntity> {
        return this.http.post<UserEntity>(`${this.authApiUrl}/register`, registerDto);
    }

    login(loginDto: LoginDto): Observable<AuthData> {
        return this.http.post<AuthData>(`${this.authApiUrl}/login`, loginDto)
            .pipe(tap(authData => {
                this.sessionStorageService.clear();
                this.sessionStorageService.setUser(authData.user);
                this.sessionStorageService.setTokenData(authData);
                this.logged = true;
                this.user = authData.user;
                this.loggedInListener.next(true);
                this.userListener.next(authData.user);
            }));
    }

    autoAuth(): void {
        const tokens = this.sessionStorageService.getTokenData();
        const user = this.sessionStorageService.getUser();
        if (!tokens || !user) {
            this.sessionStorageService.clear();
            return;
        }
        this.logged = true;
        this.user = user;
        this.loggedInListener.next(true);
        this.userListener.next(user);
    }

    logout(): void {
        const ignored = this.router.navigateByUrl("/auth");
        this.logged = false;
        this.loggedInListener.next(false);
        this.userListener.next(undefined);
        this.sessionStorageService.clear();
    }

    // noinspection JSUnusedGlobalSymbols
    getLoggedInListener(): Observable<boolean> {
        return this.loggedInListener.asObservable();
    }

    // noinspection JSUnusedGlobalSymbols
    getUserListener(): Observable<UserEntity | undefined> {
        return this.userListener.asObservable();
    }

}
