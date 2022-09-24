import { Component, Input } from "@angular/core";

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: "wx-progress-bar",
    templateUrl: "./progress-bar.component.html",
    styleUrls: ["./progress-bar.component.scss"],
})
export class ProgressBarComponent {

    @Input() value!: number;

    @Input() colorClass?: string;

    @Input() color?: string;

}
