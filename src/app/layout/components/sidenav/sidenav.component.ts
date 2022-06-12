import { Component, OnDestroy, OnInit } from "@angular/core";
import { MenuItem } from "../../interfaces";
import { AuthService } from "../../../modules/auth/services";
import { Subscription } from "rxjs";
import { menuItems } from "../../data";
import { NavigationEnd, Router } from "@angular/router";
import { AppService } from "../../../app.service";
import { SidenavService } from "../../../core/services";

@Component({
    selector: "app-sidenav",
    templateUrl: "./sidenav.component.html",
    styleUrls: ["./sidenav.component.scss"],
})
export class SidenavComponent implements OnInit, OnDestroy {

    path?: string;

    logged: boolean = false;

    menu: MenuItem[] = menuItems;

    sidenavSubscription!: Subscription;

    loggedInSubscription!: Subscription;

    routerSubscription!: Subscription;

    opened: boolean = false;

    constructor(
        public readonly app: AppService,
        private readonly authService: AuthService,
        private router: Router,
        private readonly sidenavService: SidenavService,
    ) {}

    ngOnInit(): void {
        this.logged = this.authService.logged;
        this.opened = this.sidenavService.opened;
        this.sidenavSubscription = this.sidenavService.getSidenavToggleListener()
            .subscribe(opened => {
                this.opened = opened;
            });
        this.routerSubscription = this.router.events.subscribe({
            next: event => {
                if (!this.path && event instanceof NavigationEnd) {
                    this.path = event.url;
                    const item = this.menu.find(i => Boolean(i.children?.find(i => i.path === this.path)));
                    if (item) item.opened = true;
                }
            },
        });
        this.loggedInSubscription = this.authService.getLoggedInListener()
            .subscribe(logged => {
                this.logged = logged;
                if (!logged) {
                    this.path = this.menu[0].path;
                    this.menu.forEach(item => {
                        item.opened = false;
                    });
                }
            });
    }

    status(item: MenuItem): void {
        item.active = item.path === this.path;
        item.children?.forEach(item => this.status(item));
    }

    close(item: MenuItem): void {
        item.opened = Boolean(item.children?.find(i => i.active));
    }

    select(selectedItem: MenuItem): void {
        if (selectedItem.path) this.path = selectedItem.path;
        this.menu.forEach(item => this.status(item));
        if (!selectedItem.for) {
            this.menu.filter(i => i.id !== selectedItem.id).forEach(item => this.close(item));
        }
        if (selectedItem.children) this.toggle(selectedItem);
        else this.sidenavService.close();
    }

    toggle(item: MenuItem): void {
        if (item.opened) {
            if (!item.children?.find(i => i.active)) item.opened = false;
        } else {
            item.opened = true;
        }
    }

    ngOnDestroy(): void {
        this.loggedInSubscription.unsubscribe();
        this.routerSubscription.unsubscribe();
    }

    can(item: MenuItem): boolean {
        if (item.children) {
            let can = false;
            for (const child of item.children) {
                if (this.app.can(child.permission)) {
                    can = true;
                }
            }
            return can;
        }
        return this.app.can(item.permission);
    }
}
