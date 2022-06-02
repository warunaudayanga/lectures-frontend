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

@Injectable({
    providedIn: "root",
})
export class AppService {

    private readonly _width: number;

    private readonly _height: number;

    constructor(
        private readonly router: Router,
        private readonly dialog: DialogService,
        public readonly toast: ToastrService,
        private readonly loader: LoaderService,
        // , private readonly swUpdate: SwUpdate
    ) {
        this._width = window.innerWidth;
        this._height = window.innerHeight;

        // swUpdate.available.subscribe(event => {
        //     console.log("current version is", event.current);
        //     console.log("available version is", event.available);
        // });
        // swUpdate.activated.subscribe(event => {
        //     console.log("old version was", event.previous);
        //     console.log("new version is", event.current);
        // });
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
        this.toast.success(message);
    }

    public info(message: string): void {
        this.toast.info(message);
    }

    public error(message: string): void {
        this.toast.error(message);
    }

    public warning(message: string): void {
        this.toast.warning(message);
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
        this.loader.startLoading();
    }

    public stopLoading(): void {
        this.loader.stopLoading();
    }

    public static log(data: any): void {
        // eslint-disable-next-line no-console
        console.log(data);
    }

}
