import { Component, OnInit } from "@angular/core";
import { AppService } from "../../../../../app.service";
import { SlotService, CourseModuleService, LecturerService, TimetableService } from "../../../services";
import moment from "moment";
import { CourseModuleEntity, SlotEntity, LecturerEntity, TimeTableEntryEntity, TimeTableRow, TimeTableData, TimetablePayload } from "../../../interfaces";
import { Day } from "../../../enums";

@Component({
    selector: "app-update-timetable",
    templateUrl: "./update-timetable.component.html",
    styleUrls: ["./update-timetable.component.scss"],
})
export class UpdateTimetableComponent implements OnInit {

    slots?: SlotEntity[];

    modules!: CourseModuleEntity[];

    lecturers!: LecturerEntity[];

    days?: Day[];

    timeTableData?: TimeTableData;

    tableRows: TimeTableRow[] = [];

    constructor(
        private readonly appService: AppService,
        private readonly slotService: SlotService,
        private readonly moduleService: CourseModuleService,
        private readonly lecturerService: LecturerService,
        private readonly timetableService: TimetableService,
    ) { }

    async ngOnInit(): Promise<void> {
        await this.getSlots();
        await this.getTimetableData();
        this.getModules();
        this.getLecturers();
    }

    getSlots(): void {
        this.slotService.getAll()
            .subscribe({
                next: slots => {
                    this.slots = slots;
                },
                error: err => {
                    AppService.log(err);
                },
            });
    }

    getModules(): void {
        this.moduleService.getAll()
            .subscribe({
                next: res => {
                    this.modules = res.data;
                },
                error: err => {
                    AppService.log(err);
                },
            });
    }

    getLecturers(): void {
        this.lecturerService.getAll()
            .subscribe({
                next: res => {
                    this.lecturers = res.data;
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
                            if (entry) {
                                row.data[day] = entry as TimeTableEntryEntity;
                            } else {
                                row.data[day] = { slot, day } as TimeTableEntryEntity;
                            }
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

    getDays(slot: SlotEntity): TimeTableEntryEntity[] | undefined {
        const row = this.tableRows.find(r => r.slot.number === slot.number)!;
        if (row) {
            return Object.values(row.data);
        }
        return undefined;
    }

    save(): void {
        const payload: TimetablePayload = { create: [], update: [], delete: [] };
        this.tableRows.forEach(row => {
            for (let [, entry] of Object.entries(row.data)) {
                if (entry.module && !entry.lecturer || entry.lecturer && !entry.module) {
                    this.appService.error("Both module and lecturer has to be selected!");
                    return;
                } else if (!entry.module && !entry.lecturer && entry.id) {
                    payload.delete.push(entry.id);
                } else if (entry.id) {
                    payload.update.push(entry);
                } else if (entry.module && entry.lecturer) {
                    payload.create.push(entry);
                }
            }
        });
        this.timetableService.saveTimetable(payload)
            .subscribe({
                next: value => {
                    // eslint-disable-next-line no-console
                    console.log(value);
                },
                error: err => {
                    AppService.log(err);
                },
            });
    }
}
