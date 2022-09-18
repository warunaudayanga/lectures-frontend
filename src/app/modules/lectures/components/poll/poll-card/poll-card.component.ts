import { Component, Input } from "@angular/core";
import { PollData } from "../../../interfaces/poll/poll-data,interface";

export enum PollTheme {
    PRIMARY = "primary",
    ORANGE = "orange",
    BLUE = "blue",
    CYAN = "cyan",
    PURPLE = "purple",
    RED = "red",
    GREEN = "green"
}

@Component({
    selector: "app-poll-card",
    templateUrl: "./poll-card.component.html",
    styleUrls: ["./poll-card.component.scss"],
})
export class PollCardComponent {

    @Input() theme: PollTheme = PollTheme.PRIMARY;

    @Input() title!: string;

    @Input() subTitle?: string;

    @Input() data!: PollData[];

    @Input() buttonLink!: string;

    @Input() buttonName!: string;

    @Input() icon!: string;

    @Input() iconColor = "";

    @Input() height = "250px";

    PollTheme = PollTheme;

    getData(): PollData[] {
        this.data.sort((a, b) => (a.count > b.count ? -1 : 1));
        return this.data.slice(0, 5);
    }

}
