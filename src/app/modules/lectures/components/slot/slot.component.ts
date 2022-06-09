import { Component, ViewChild } from "@angular/core";
import { Columns, DataTable, DataTableData, Option } from "../../../../core/modules/data-table/interfaces";
import { AppService } from "../../../../app.service";
import { DialogService } from "../../../../core/modules/dialog";
import { SlotService } from "../../services";
import { rowHeight, userNameWidth } from "../../../../core/data";
import { SlotEntity } from "../../interfaces";
import { FormControlData } from "../../../../core/modules/form-validation/interfaces";
import { Validators } from "@angular/forms";
import { ViewOptions } from "../../../../core/modules/dialog/interfaces";
import { EntityComponent } from "../../../../core/components";
import { time24To12 } from "../../../../core/utils";

@Component({
    selector: "app-slot",
    templateUrl: "./slot.component.html",
    styleUrls: ["./slot.component.scss"],
})
export class SlotComponent extends EntityComponent<SlotEntity> {

    @ViewChild("dataTable") public dataTable!: DataTable

    titles?: string[];

    constructor(
        protected readonly app: AppService,
        private readonly dialogService: DialogService,
        private readonly slotService: SlotService,
    ) {
        super(app, dialogService, slotService, { name: "slot", key: "number" });
        this.data = {
            dataSource: [], totalItems: 0, rowHeight,
            headers: ["Slot", "Start At", "End At", "Changed By"],
            keys: ["number", "startAt", "endAt", "createdBy.name"],
            searchKeys: [],
            widths: ["auto", "auto", "auto", userNameWidth],
            aligns: ["center", "center", "center", "center"],
            classOf: { 4: ["consolas"] },
            formatOf: { 2: time24To12, 3: time24To12 },
            option: {
                width: "175px",
                main: { html: "<i class='icofont icofont-ui-add'></i>",
                    colorClass: "btn-app-primary-invert", disabled: !this.app.can(this.app.Do.SLOT_CREATE) },
                common: [
                    { html: "<i class='icofont icofont-ui-note'></i>",
                        colorClass: "btn-app-primary", disabled: !this.app.can(this.app.Do.SLOT_GET) },
                    { html: "<i class='icofont icofont-ui-edit'></i>",
                        colorClass: "btn-warning", disabled: !this.app.can(this.app.Do.SLOT_UPDATE) },
                    { html: "<i class='icofont icofont-ui-delete'></i>",
                        colorClass: "btn-danger", disabled: !this.app.can(this.app.Do.SLOT_DELETE) },
                ] as Columns<Option, 3>,
            },
        } as DataTableData<SlotEntity, 4>;
    }

    protected formData(slot?: SlotEntity): FormControlData<SlotEntity>[] {
        return [
            { type: "number", name: "number", label: "Slot", value: slot?.number ?? 1,
                validators: [Validators.min(1)], required: true },
            { type: "text", name: "startAt", value: slot?.startAt ?? "00:00:00", required: true },
            { type: "text", name: "endAt", value: slot?.endAt ?? "00:00:00", required: true },
        ] as FormControlData<SlotEntity>[];
    }

    protected viewDialogData(slot: SlotEntity): ViewOptions<SlotEntity, 3> {
        return {
            title: "View Slot",
            entity: slot,
            headers: ["Slot", "Start At", "End At"],
            keys: ["number", "startAt", "endAt"],
            formatOf: { 2: time24To12, 3: time24To12 },
        } as ViewOptions<SlotEntity, 3>;
    }


}
