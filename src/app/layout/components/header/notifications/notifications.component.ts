import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { MatMenu } from "@angular/material/menu";

@Component({
    selector: "app-notifications",
    templateUrl: "./notifications.component.html",
    styleUrls: ["./notifications.component.scss"],
})
export class NotificationsComponent implements AfterViewInit {

    @ViewChild("notifications") notifications!: MatMenu;

    constructor() {}

    ngAfterViewInit(): void {
        this.notifications.overlayPanelClass = "notification-overlay";
    }

}
