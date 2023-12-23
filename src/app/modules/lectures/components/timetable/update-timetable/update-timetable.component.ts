import { Component, OnInit } from "@angular/core";
import { AppService } from "../../../../../app.service";
import { SlotService, CourseModuleService, LecturerService, TimetableService } from "../../../services";
import moment from "moment";
import { CourseModuleEntity, SlotEntity, LecturerEntity, TimetableEntryEntity, TimeTableRow, TimeTableEntryData, TimetablePayload } from "../../../interfaces";
import { Day } from "../../../enums";
import { HttpError } from "../../../../../core/interfaces";
import { EnumValue } from "@angular/compiler-cli/src/ngtsc/partial_evaluator";
import { CommonError } from "../../../../../core/enums";
import { firstValueFrom } from "rxjs";

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

    timeTableData?: TimeTableEntryData;

    tableRows: TimeTableRow[] = [];

    constructor(
        private readonly app: AppService,
        private readonly slotService: SlotService,
        private readonly moduleService: CourseModuleService,
        private readonly lecturerService: LecturerService,
        private readonly timetableService: TimetableService,
    ) { }

    ngOnInit(): void {
        this.app.startLoading();
        Promise.all([
            firstValueFrom(this.slotService.getAllSlots()),
            firstValueFrom(this.timetableService.getTimetableData()),
            firstValueFrom(this.moduleService.getAll()),
            firstValueFrom(this.lecturerService.getAll()),
        ]).then(responses => {
            this.app.stopLoading();
            const [slots, timeTableData, moduleRes, lecturesRes] = responses;

            this.slots = slots;
            this.modules = moduleRes.data;
            this.lecturers = lecturesRes.data;

            let days = Object.keys(timeTableData) as Day[];
            if (!days.includes(Day.SATURDAY)) {
                timeTableData.SATURDAY = [];
            }
            if (!days.includes(Day.SUNDAY)) {
                timeTableData.SUNDAY = [];
            }
            this.days = Object.keys(timeTableData) as Day[];
            this.timeTableData = timeTableData;
            this.slots?.forEach(slot => {
                const row: TimeTableRow = { slot, data: {} };
                this.days?.forEach(day => {
                    const entry = this.timeTableData?.[day]?.find(e => e.slot.number === slot.number);
                    if (entry) {
                        row.data[day] = entry as TimetableEntryEntity;
                    } else {
                        row.data[day] = { slot, day } as TimetableEntryEntity;
                    }
                });
                this.tableRows.push(row);
            });
        }).catch((err: HttpError<EnumValue & CommonError>) => {
            this.app.stopLoading();
            this.app.error(err.error?.message ?? CommonError.ERROR);
            AppService.log(err);
        });
    }

    getTime(time: string): string {
        return moment(`2000-01-01 ${time}`).format("hh:mm a");
    }

    getDays(slot: SlotEntity): Partial<TimetableEntryEntity>[] | undefined {
        const row = this.tableRows.find(r => r.slot.number === slot.number)!;
        if (row) {
            return Object.values(row.data);
        }
        return undefined;
    }

    save(): void {
        const payload: TimetablePayload = { create: [], update: [], delete: [] };
        let err: boolean = false;
        this.tableRows.forEach(row => {
            for (let [, entry] of Object.entries(row.data)) {
                const { module: m, lecturer: l1, lecturerL2: l2 } = entry;
                const g = m?.grouped;
                if (m && !g) {
                    entry.lecturerL2 = undefined;
                    entry.meetingsUrlL2 = undefined;
                    entry.documentsUrlL2 = undefined;
                    entry.recordingsUrlL2 = undefined;
                }
                if (
                    m && g && (!l1 && !l2) ||
                    m && !g && !l1 ||
                    !m && l1
                ) {
                    err = true;
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
        if (err) {
            this.app.error("Both module and lecturer has to be selected!");
            return;
        }
        this.app.startLoading();
        this.timetableService.saveTimetable(payload)
            .subscribe({
                next: () => {
                    this.app.stopLoading();
                    this.app.success("Timetable successfully saved.");
                    this.app.load("/timetable");
                },
                error: (err: HttpError<EnumValue & CommonError>) => {
                    this.app.stopLoading();
                    this.app.error(err.error?.message ?? CommonError.ERROR);
                    AppService.log(err);
                },
            });
    }
}
