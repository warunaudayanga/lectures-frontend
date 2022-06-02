import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "../../../modules/auth/services";

@Component({
    selector: "app-content",
    templateUrl: "./content.component.html",
    styleUrls: ["./content.component.scss"],
})
export class ContentComponent implements OnInit, OnDestroy {

    logged: boolean = false;

    loggedInSubscription!: Subscription;

    constructor(private readonly authService: AuthService) {}

    ngOnInit(): void {
        this.logged = this.authService.logged;
        this.loggedInSubscription = this.authService.getLoggedInListener()
            .subscribe(logged => {
                this.logged = logged;
            });
    }

    ngOnDestroy(): void {
        this.loggedInSubscription.unsubscribe();
    }

}
