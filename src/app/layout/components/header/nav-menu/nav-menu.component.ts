import { Component } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "../../../../modules/auth/services";

@Component({
    selector: "app-nav-menu",
    templateUrl: "./nav-menu.component.html",
    styleUrls: ["./nav-menu.component.scss"],
})
export class NavMenuComponent {

    profileImage?: string;

    logged: boolean = false;

    loggedSubscription: Subscription;

    constructor(private readonly authService: AuthService) {
        this.logged = authService.logged;
        this.loggedSubscription = authService.getLoggedInListener()
            .subscribe(logged => {
                this.logged = logged;
                this.profileImage = this.authService.user?.profileImage;
            });
    }

    logout(): void {
        this.authService.logout();
    }

}
