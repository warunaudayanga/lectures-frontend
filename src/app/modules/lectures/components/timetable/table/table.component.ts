import { Component, OnInit } from "@angular/core";
import { Day } from "../../../enums";
import { TimetableService, SlotService } from "../../../services";
import { TimeTableData, TimeTableRow, TimeTableEntryEntity, SlotEntity } from "../../../interfaces";
import { AppService } from "../../../../../app.service";
import moment from "moment";
import { KeyValue } from "@angular/common";

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: "timetable-table",
    templateUrl: "./table.component.html",
    styleUrls: ["./table.component.scss"],
})
export class TableComponent implements OnInit {

    days?: Day[];

    slots?: SlotEntity[];

    timeTableData?: TimeTableData;

    tableRows: TimeTableRow[] = [];

    onCompare(_left: KeyValue<any, TimeTableEntryEntity>, _right: KeyValue<any, TimeTableEntryEntity>): number {
        return 1;
    }

    constructor(private readonly slotService: SlotService, private readonly timetableService: TimetableService) {}

    async ngOnInit(): Promise<void> {
        await this.getSlots();
        await this.getTimetableData();
    }


    async getSlots(): Promise<void> {
        await this.slotService.getAll()
            .subscribe({
                next: slots => {
                    this.slots = slots;
                },
                error: err => {
                    AppService.log(err);
                },
            });
    }

    getTimetableData(): void {
        this.timetableService.getTimetableData()
            .subscribe({
                next: timeTableData => {
                    this.days = Object.keys(timeTableData) as Day[];
                    this.timeTableData = timeTableData;
                    this.slots?.forEach(slot => {
                        const row: TimeTableRow = { slot, data: {} };
                        this.days?.forEach(day => {
                            const entry = this.timeTableData?.[day]?.find(e => e.slot.number === slot.number);
                            row.data[day] = entry as TimeTableEntryEntity;
                        });
                        this.tableRows.push(row);
                    });
                },
                error: err => {
                    AppService.log(err);
                },
            });
    }

    getTime(time: string): string {
        return moment(`2000-01-01 ${time}`).format("hh:mm a");
    }
}
