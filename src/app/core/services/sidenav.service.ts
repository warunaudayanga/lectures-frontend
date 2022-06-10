import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class SidenavService {

    private _opened: boolean = false;

    private sidenavToggleListener: Subject<boolean> = new Subject<boolean>()

    get opened(): boolean {
        return this._opened;
    }

    get closed(): boolean {
        return !this._opened;
    }

    public open(): void {
        this._opened = true;
        this.sidenavToggleListener.next(true);
    }

    public close(): void {
        this._opened = false;
        this.sidenavToggleListener.next(false);
    }

    public toggle(): void {
        this._opened = !this._opened;
        this.sidenavToggleListener.next(this._opened);
    }

    public getSidenavToggleListener(): Observable<boolean> {
        return this.sidenavToggleListener.asObservable();
    }
}
