import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "../../../modules/auth/services";
import { SidenavService } from "../../../core/services";

@Component({
    selector: "app-header",
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit, OnDestroy {

    logged: boolean = false;

    loggedInSubscription!: Subscription;

    constructor(
        private readonly authService: AuthService,
        private readonly sidenavService: SidenavService,
    ) {}

    ngOnInit(): void {
        this.logged = this.authService.logged;
        this.loggedInSubscription = this.authService.getLoggedInListener()
            .subscribe(loggedIn => {
                this.logged = loggedIn;
            });
    }

    ngOnDestroy(): void {
        this.loggedInSubscription.unsubscribe();
    }

    logout(): void {
        this.authService.logout();
    }

    toggle(): void {
        this.sidenavService.toggle();
    }
}
