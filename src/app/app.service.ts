// noinspection JSUnusedGlobalSymbols

import { EventEmitter, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { PromptOptions, PromptResponse, ViewOptions } from "./core/modules/dialog/interfaces";
import { LoaderService } from "./core/modules/loader";
import { DialogService } from "./core/modules/dialog";
import { IObject } from "./core/interfaces";
import { BaseEntity } from "./core/entity";
import { AuthService } from "./modules/auth/services";
import { Permission } from "./modules/auth/enum/permission.enum";
import { UserEntity } from "./modules/user/interfaces/user.interface";
import { Breakpoint } from "./core/enums";
import { IndividualConfig } from "ngx-toastr/toastr/toastr-config";

@Injectable({
    providedIn: "root",
})
export class AppService {

    public Do = Permission;

    private readonly _width: number;

    private readonly _height: number;

    private _loading: boolean = false;

    public Breakpoint = Breakpoint;

    public initialBreakpoint: Breakpoint;

    private readonly toastConfig: Partial<IndividualConfig>;

    constructor(
        private readonly router: Router,
        private readonly dialog: DialogService,
        public readonly toast: ToastrService,
        private readonly loader: LoaderService,
        private readonly authService: AuthService,
        // , private readonly swUpdate: SwUpdate
    ) {
        this._width = window.innerWidth;
        this._height = window.innerHeight;
        this.toastConfig = { positionClass: this.mdDown ? "toast-top-center" : "toast-top-right" };
        this.dialog.maxWidth = this.lgDown ? "90vw" : "85vw";
        if (this._width > Breakpoint.XXL) {
            this.initialBreakpoint = Breakpoint.XXL;
        } else if (this._width > Breakpoint.XL) {
            this.initialBreakpoint = Breakpoint.XL;
        } else if (this._width > Breakpoint.LG) {
            this.initialBreakpoint = Breakpoint.LG;
        } else if (this._width > Breakpoint.MD) {
            this.initialBreakpoint = Breakpoint.MD;
        } else if (this._width > Breakpoint.SM) {
            this.initialBreakpoint = Breakpoint.SM;
        } else {
            this.initialBreakpoint = Breakpoint.XS;
        }
        this.dialog.initialBreakpoint = this.initialBreakpoint;

        // swUpdate.available.subscribe(event => {
        //     console.log("current version is", event.current);
        //     console.log("available version is", event.available);
        // });
        // swUpdate.activated.subscribe(event => {
        //     console.log("old version was", event.previous);
        //     console.log("new version is", event.current);
        // });
    }

    get xs(): boolean {
        return Breakpoint.XS <= this._width && this._width < Breakpoint.SM;
    }

    get sm(): boolean {
        return Breakpoint.SM <= this._width && this._width < Breakpoint.MD;
    }

    get smUp(): boolean {
        return Breakpoint.SM <= this._width;
    }

    get md(): boolean {
        return Breakpoint.MD <= this._width && this._width < Breakpoint.LG;
    }

    get mdUp(): boolean {
        return Breakpoint.MD <= this._width;
    }

    get mdDown(): boolean {
        return this._width < Breakpoint.MD;
    }

    get lg(): boolean {
        return Breakpoint.LG <= this._width && this._width < Breakpoint.XL;
    }

    get lgUp(): boolean {
        return Breakpoint.LG <= this._width;
    }

    get lgDown(): boolean {
        return this._width < Breakpoint.LG;
    }

    get xl(): boolean {
        return Breakpoint.XL <= this._width && this._width < Breakpoint.XXL;
    }

    get xlUp(): boolean {
        return Breakpoint.XL <= this._width;
    }

    get xlDown(): boolean {
        return this._width < Breakpoint.XL;
    }

    get xxl(): boolean {
        return Breakpoint.XXL <= this._width;
    }

    get xxlDown(): boolean {
        return this._width < Breakpoint.XXL;
    }

    can(Do?: Permission): boolean {
        if (!Do) return true;
        return Boolean(this.authService.user?.role?.permissions.includes(Do));
    }

    get loading(): boolean {
        return this._loading;
    }

    set loading(loading: boolean) {
        this._loading = loading;
    }

    get user(): UserEntity | undefined {
        return this.authService.user;
    }

    get width(): number {
        return this._width;
    }

    get height(): number {
        return this._height;
    }

    public load(path: string, params?: {}): void {
        if (params) {
            this.router.navigate([path], { queryParams: params }).then();
        } else {
            this.router.navigateByUrl(path).then();
        }
    }

    public success(message: string): void {
        this.toast.success(message, undefined, this.toastConfig);
    }

    public info(message: string): void {
        this.toast.info(message, undefined, this.toastConfig);
    }

    public error(message: string): void {
        this.toast.error(message, undefined, this.toastConfig);
    }

    public warning(message: string): void {
        this.toast.warning(message, undefined, this.toastConfig);
    }

    public infoDialog(message: string, confirm?: boolean): Observable<boolean> {
        return this.dialog.info(message, confirm);
    }

    public successDialog(message: string, confirm?: boolean): Observable<boolean> {
        return this.dialog.success(message, confirm);
    }

    public warningDialog(message: string, confirm?: boolean): Observable<boolean> {
        return this.dialog.warning(message, confirm);
    }

    public errorDialog(message: string, confirm?: boolean): Observable<boolean> {
        return this.dialog.error(message, confirm);
    }

    public viewDialog(options: ViewOptions<IObject & BaseEntity, number>): Observable<boolean> {
        return this.dialog.view(options);
    }

    public promptDialog(options: PromptOptions<IObject & BaseEntity>): EventEmitter<PromptResponse> {
        return this.dialog.prompt(options);
    }

    public startLoading(): void {
        this._loading = true;
        this.loader.startLoading();
    }

    public stopLoading(): void {
        this.loader.stopLoading();
        this._loading = false;
    }

    public static log(data: any): void {
        // eslint-disable-next-line no-console
        console.log(data);
    }

}
