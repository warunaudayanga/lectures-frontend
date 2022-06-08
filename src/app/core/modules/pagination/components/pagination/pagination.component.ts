import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: "app-pagination",
    templateUrl: "./pagination.component.html",
    styleUrls: ["./pagination.component.scss"],
})
export class PaginationComponent {

    @Input() id!: string;

    @Input() maxSize!: number;

    @Output() pageChange = new EventEmitter<number>();

    @Output() pageBoundsCorrection: EventEmitter<number> = new EventEmitter<number>();

    constructor() { }

    changePage(page: number): void {
        this.pageChange.emit(page);
    }
}
