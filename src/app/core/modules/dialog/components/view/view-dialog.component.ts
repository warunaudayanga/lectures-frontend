import { Component, EventEmitter, Inject, Output } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { IObject, ViewData } from "../../interfaces";
import { BaseEntity } from "../../../../entity";

@Component({
    selector: "app-view",
    templateUrl: "./view-dialog.component.html",
    styleUrls: ["../common.scss", "./view-dialog.component.scss"],
})
export class ViewDialogComponent {

    @Output() emitter: EventEmitter<boolean> = new EventEmitter();

    constructor(@Inject(MAT_DIALOG_DATA) public viewData: ViewData<IObject & BaseEntity, number>, private readonly dialogRef: MatDialogRef<boolean>) {}

    close(): void {
        this.dialogRef.close(true);
    }

    getValue(item: IObject, key: string | number | symbol, i: number): string {
        let value = item;
        let keys = String(key).split(".");
        keys.forEach(k => {
            value = value[k];
        });
        // eslint-disable-next-line no-nested-ternary
        return this.viewData.formatOf?.[i + 1]
            ? this.viewData.formatOf?.[i + 1]?.(value)
            : this.viewData.format?.[i]
                ? this.viewData.format?.[i]?.(value)
                : value;
    }

}

