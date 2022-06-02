import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "../../../modules/auth/services";

@Component({
    selector: "app-header",
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit, OnDestroy {

    logged: boolean = false;

    loggedInSubscription!: Subscription;

    constructor(private readonly authService: AuthService) {}

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
}
