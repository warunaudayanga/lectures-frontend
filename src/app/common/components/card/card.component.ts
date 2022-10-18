import { Component, Input } from "@angular/core";

@Component({
    selector: "app-card",
    templateUrl: "./card.component.html",
    styleUrls: ["./card.component.scss"],
})
export class CardComponent {

    @Input() theme: "primary" | "orange" | "blue" | "cyan" | "purple" | "red" | "green" = "primary";

    @Input() title!: string;

    @Input() count!: number;

    @Input() count2!: number;

    @Input() buttonLink!: string;

    @Input() buttonName!: string;

    @Input() icon!: string;

    @Input() iconColor = "";

    @Input() height = "190px";

}
