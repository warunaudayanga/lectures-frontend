import { Component, HostListener, OnDestroy, OnInit } from "@angular/core";
import { AuthService } from "./modules/auth/services";
import { Subscription } from "rxjs";
import { ShortcutService } from "./core/services";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit, OnDestroy {
    // noinspection JSUnusedGlobalSymbols
    title = "lectures-frontend";

    logged: boolean = false;

    loggedInSubscription!: Subscription;

    constructor(
        private readonly authService: AuthService,
        private readonly shortcutService: ShortcutService,
    ) {}

    async ngOnInit(): Promise<void> {
        this.logged = this.authService.logged;
        this.loggedInSubscription = this.authService.getLoggedInListener()
            .subscribe(logged => {
                this.logged = logged;
            });
        await this.authService.autoAuth();
    }

    ngOnDestroy(): void {
        this.loggedInSubscription.unsubscribe();
    }

    @HostListener("document:keyup")
    registerRelease(): void {
        this.shortcutService.registerRelease();
    }

    @HostListener("document:keydown", ["$event"])
    handleKeyboardEvent(event: KeyboardEvent): void {
        this.shortcutService.handleShortcut(event);
    }

}
