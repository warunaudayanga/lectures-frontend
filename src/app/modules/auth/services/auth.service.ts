import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, Subject, tap } from "rxjs";
import { Router } from "@angular/router";
import { environment } from "../../../../environments/environment";
import { AuthData, UserEntity } from "../interfaces";
import { LocalStorageService } from "../../../core/services";
import { RegisterDto, LoginDto } from "../dto";
import { UserService } from "../../user/services";
import { LoaderService } from "../../../core/modules/loader";

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
        private readonly userService: UserService,
        private readonly loader: LoaderService,
        private readonly storageService: LocalStorageService,
    ) {}

    refreshToken(token: string): Observable<AuthData> {
        return this.http.post<AuthData>(`${this.authApiUrl}/refresh`, {}, { headers: { "Authorization": token } });
    }

    register(registerDto: RegisterDto): Observable<UserEntity> {
        return this.http.post<UserEntity>(`${this.authApiUrl}/register`, registerDto);
    }

    login(loginDto: LoginDto): Observable<AuthData> {
        return this.http.post<AuthData>(`${this.authApiUrl}/login`, loginDto)
            .pipe(tap(authData => this.setLoggedIn(authData)));
    }

    setLoggedIn(authData: AuthData): void {
        this.storageService.clear();
        this.storageService.setUserId(authData.user.id);
        this.storageService.setTokenData(authData);
        this.logged = true;
        this.user = authData.user;
        this.loggedInListener.next(true);
        this.userListener.next(authData.user);
    }

    logout(): void {
        this.logged = false;
        this.loggedInListener.next(false);
        this.userListener.next(undefined);
        this.storageService.clear();
        const ignored = this.router.navigateByUrl("/auth");
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
