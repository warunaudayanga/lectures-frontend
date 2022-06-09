import { Component } from "@angular/core";
import { CourseEntity, SlotEntity, TimeTableEntryData, TimetableEntryEntity, TimeTableRow } from "../../interfaces";
import { Day } from "../../enums";
import { KeyValue } from "@angular/common";
import { AppService } from "../../../../app.service";
import { CourseService, SlotService, TimetableService } from "../../services";
import { HttpError } from "../../../../core/interfaces";
import { EnumValue } from "@angular/compiler-cli/src/ngtsc/partial_evaluator";
import { CommonError } from "../../../../core/enums";
import moment from "moment";
import { firstValueFrom } from "rxjs";

@Component({
    selector: "app-timetable",
    templateUrl: "./timetable.component.html",
    styleUrls: ["./timetable.component.scss"],
})
export class TimetableComponent {

    timeTableEntryData?: TimeTableEntryData;

    days?: Day[];

    slots?: SlotEntity[];

    courses?: CourseEntity[];

    selectedCourse?: CourseEntity;

    tableRows: TimeTableRow[] = [];

    onCompare(_left: KeyValue<any, TimetableEntryEntity>, _right: KeyValue<any, TimetableEntryEntity>): number {
        return 1;
    }

    constructor(
        public readonly app: AppService,
        private readonly slotService: SlotService,
        private readonly courseService: CourseService,
        private readonly timetableService: TimetableService,
    ) {
        Promise.all([
            firstValueFrom(this.slotService.getAllSlots()),
            firstValueFrom(this.courseService.getAll()),
        ]).then(responses => {
            const [slots, courses] = responses;
            this.slots = slots;
            this.courses = courses.data;
            this.getTimetableData();
        }).catch((err: HttpError<EnumValue & CommonError>) => {
            this.app.error(err.error?.message ?? CommonError.ERROR);
            AppService.log(err);
        });
    }

    getTimetableData(): void {
        this.timetableService.getTimetableData()
            .subscribe({
                next: timeTableData => {
                    let days = Object.keys(timeTableData) as Day[];
                    if (!days.includes(Day.SATURDAY)) {
                        timeTableData.SATURDAY = [];
                    }
                    if (!days.includes(Day.SUNDAY)) {
                        timeTableData.SUNDAY = [];
                    }
                    this.days = Object.keys(timeTableData) as Day[];
                    this.timeTableEntryData = timeTableData;
                    this.slots?.forEach(slot => {
                        const row: TimeTableRow = { slot, data: {} };
                        this.days?.forEach(day => {
                            const entry = this.timeTableEntryData?.[day]?.find(e => e.slot.number === slot.number);
                            row.data[day] = entry as TimetableEntryEntity;
                        });
                        this.tableRows.push(row);
                    });
                },
                error: (err: HttpError<EnumValue & CommonError>) => {
                    this.app.error(err.error?.message ?? CommonError.ERROR);
                    AppService.log(err);
                },
            });
    }

    getTime(time: string): string {
        return moment(`2000-01-01 ${time}`).format("hh:mm a");
    }

    getRawTime(time: string): moment.Moment {
        return moment(`2000-01-01 ${time}`);
    }

}
