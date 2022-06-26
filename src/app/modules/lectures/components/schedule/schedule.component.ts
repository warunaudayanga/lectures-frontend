import { Component, OnInit, ViewChild } from "@angular/core";
import moment, { Moment } from "moment";
import { ScheduleService } from "../../services/schedule.service";
import { DateOnly, HttpError, Time } from "../../../../core/interfaces";
import { EnumValue } from "@angular/compiler-cli/src/ngtsc/partial_evaluator";
import { CommonError, Status } from "../../../../core/enums";
import { AppService } from "../../../../app.service";
import { ScheduleEntryEntity } from "../../interfaces/schedule.interface";
import { Day } from "../../enums";
import { CourseModuleService, CourseService, LecturerService, SlotService } from "../../services";
import { CourseModuleEntity, LecturerEntity, SlotEntity, TimetableEntryEntity } from "../../interfaces";
import { AbstractControl, FormArray, FormBuilder, FormGroup, NgForm, Validators } from "@angular/forms";
import { firstValueFrom } from "rxjs";
import { ScheduleDto } from "../../interfaces/schedule-dto";
import { hhmmaToHHmmss } from "../../../../core/utils";
import { MatCalendarCellClassFunction, MatCalendarCellCssClasses } from "@angular/material/datepicker/calendar-body";

@Component({
    selector: "app-schedule",
    templateUrl: "./schedule.component.html",
    styleUrls: ["./schedule.component.scss"],
})
export class ScheduleComponent implements OnInit {

    loading: boolean = true;

    @ViewChild("form") form?: NgForm;

    editing: boolean = false;

    date: Moment = moment();

    day?: string;

    schedule?: ScheduleEntryEntity[];

    generated?: boolean;

    slots?: SlotEntity[];

    modules?: CourseModuleEntity[];

    lecturers?: LecturerEntity[];

    formGroup?: FormGroup;

    lectureDates: string[] = [];

    markDays: MatCalendarCellClassFunction<Moment>;

    constructor(
        public readonly app: AppService,
        private readonly fb: FormBuilder,
        private readonly slotService: SlotService,
        private readonly scheduleService: ScheduleService,
        private readonly courseService: CourseService,
        private readonly moduleService: CourseModuleService,
        private readonly lecturerService: LecturerService,
    ) {
        this.getSchedule();
        this.lectureDates = [
            "2022-06-14",
            "2022-06-15",
            "2022-06-18",
            "2022-06-20",
            "2022-06-21",
        ];
        this.markDays = (date: Moment, view: "month" | "year" | "multi-year"): MatCalendarCellCssClasses => {
            if (view === "month") {
                return this.lectureDates?.includes(date.format("YYYY-MM-DD")) ? "lecture-dates" : "";
            }
            return "";
        };
    }

    ngOnInit(): void {
        this.day = this.date.format("dddd");
    }

    getConfig(scheduleEntry?: ScheduleEntryEntity): any {
        return {
            entry: [scheduleEntry?.entry],
            id: [scheduleEntry?.entry?.id],
            hhStart: [
                scheduleEntry ? moment(`2000-01-01 ${scheduleEntry.startAt ?? scheduleEntry.entry?.slot.startAt}`).format("hh") : "12",
                [Validators.required, Validators.min(1), Validators.max(12)],
            ],
            mmStart: [
                scheduleEntry ? moment(`2000-01-01 ${scheduleEntry.startAt ?? scheduleEntry.entry?.slot.startAt}`).format("mm") : "00",
                [Validators.required, Validators.min(0), Validators.max(59)],
            ],
            aStart: [scheduleEntry ? moment(`2000-01-01 ${scheduleEntry.startAt ?? scheduleEntry.entry?.slot.startAt}`).format("a") : "am"],
            hhEnd: [
                scheduleEntry ? moment(`2000-01-01 ${scheduleEntry.endAt ?? scheduleEntry.entry?.slot.endAt}`).format("hh") : "12",
                [Validators.required, Validators.min(1), Validators.max(12)],
            ],
            mmEnd: [
                scheduleEntry ? moment(`2000-01-01 ${scheduleEntry.endAt ?? scheduleEntry.entry?.slot.endAt}`).format("mm") : "00",
                [Validators.required, Validators.min(0), Validators.max(59)],
            ],
            aEnd: [scheduleEntry ? moment(`2000-01-01 ${scheduleEntry.endAt ?? scheduleEntry.entry?.slot.endAt}`).format("a") : "am"],
            hhStartL2: [
                scheduleEntry?.startAtL2 ? moment(`2000-01-01 ${scheduleEntry.startAtL2 ?? scheduleEntry.entry?.slotL2?.startAt}`).format("hh") : "12",
                [Validators.required, Validators.min(1), Validators.max(12)],
            ],
            mmStartL2: [
                scheduleEntry?.startAtL2 ? moment(`2000-01-01 ${scheduleEntry.startAtL2 ?? scheduleEntry.entry?.slotL2?.startAt}`).format("mm") : "00",
                [Validators.required, Validators.min(0), Validators.max(59)],
            ],
            aStartL2: [scheduleEntry?.startAtL2 ? moment(`2000-01-01 ${scheduleEntry.startAtL2 ?? scheduleEntry.entry?.slotL2?.startAt}`).format("a") : "am"],
            hhEndL2: [
                scheduleEntry?.endAtL2 ? moment(`2000-01-01 ${scheduleEntry.endAtL2 ?? scheduleEntry.entry?.slotL2?.endAt}`).format("hh") : "12",
                [Validators.required, Validators.min(1), Validators.max(12)],
            ],
            mmEndL2: [
                scheduleEntry?.endAtL2 ? moment(`2000-01-01 ${scheduleEntry.endAtL2 ?? scheduleEntry.entry?.slotL2?.endAt}`).format("mm") : "00",
                [Validators.required, Validators.min(0), Validators.max(59)],
            ],
            aEndL2: [scheduleEntry?.endAtL2 ? moment(`2000-01-01 ${scheduleEntry.endAtL2 ?? scheduleEntry.entry?.slotL2?.endAt}`).format("a") : "am"],
            module: [scheduleEntry?.module ?? (this.generated ? scheduleEntry?.entry?.module : undefined)],
            lecturer: [scheduleEntry?.lecturer || (this.generated ? scheduleEntry?.entry?.lecturer : undefined)],
            lecturerL2: [scheduleEntry?.lecturerL2 || (this.generated ? scheduleEntry?.entry?.lecturerL2 : undefined)],
            meetingId: [scheduleEntry?.meetingId ?? ""],
            passcode: [scheduleEntry?.passcode ?? ""],
            meetingUrl: [scheduleEntry?.meetingUrl ?? ""],
            recordingUrl: [scheduleEntry?.recordingUrl ?? ""],
            meetingIdL2: [scheduleEntry?.meetingIdL2 ?? ""],
            passcodeL2: [scheduleEntry?.passcodeL2 ?? ""],
            meetingUrlL2: [scheduleEntry?.meetingUrlL2 ?? ""],
            recordingUrlL2: [scheduleEntry?.recordingUrlL2 ?? ""],
        };
    }

    buildForms(): void {
        const groups: FormGroup[] = [];
        for (const slot of this.slots!) {
            groups.push(this.fb.group(this.getConfig(this.schedule?.find(s => s.slot === slot.number))));
        }
        this.formGroup = new FormGroup({
            forms: new FormArray(groups),
        });
    }

    getTime(time: string): string {
        return moment(`2000-01-01 ${time}`).format("hh:mm a");
    }

    getSchedule(): void {
        this.loading = true;
        this.app.startLoading();
        Promise.all([
            firstValueFrom(this.scheduleService.getScheduleByDate(this.date.format("YYYY-MM-DD"))),
            firstValueFrom(this.slotService.getAllSlots()),
            firstValueFrom(this.moduleService.getAll()),
            firstValueFrom(this.lecturerService.getAll()),
        ]).then(responses => {
            this.loading = false;
            this.app.stopLoading();
            const [scheduleRes, slots, modules, lecturers] = responses;
            this.schedule = scheduleRes.schedule;
            this.slots = slots;
            this.modules = modules.data;
            this.lecturers = lecturers.data;
            this.generated = scheduleRes.generated;
            const grouped = this.schedule?.filter(s => s.module.grouped && s.lecturerL2 && s.startAt !== s.startAtL2);
            this.schedule?.push(...grouped.map(s => ({
                ...s,
                slot: undefined,
                lecturer: null,
                startAt: undefined as unknown as Time,
                endAt: undefined as unknown as Time,
            })));
            this.schedule.sort((a, b) => ((a.startAt ?? a.startAtL2) > (b.startAt ?? b.startAtL2) ? 1 : -1));
            this.buildForms();
        }).catch((err: HttpError<EnumValue & CommonError>) => {
            this.app.stopLoading();
            this.app.error(err.error?.message ?? CommonError.ERROR);
            AppService.log(err);
        });
    }

    onDateChange(): void {
        this.day = this.date.format("dddd");
        this.getSchedule();
    }

    onTimeChange(event: Event): void {
        const el = event.target as HTMLInputElement;
        const max = (event.target as HTMLInputElement).max;
        const min = (event.target as HTMLInputElement).min;
        if (Number(el.value) > Number(max)) {
            el.value = max;
        }
        if (Number(el.value) < Number(min)) {
            el.value = min;
        }
        if (el.value.length < 2) {
            el.value = `0${el.value}`;
        }
    }

    prev(): void {
        this.date = moment(this.date.subtract(1, "day"));
        this.day = this.date.format("dddd");
        this.getSchedule();
    }

    next(): void {
        this.date = moment(this.date.add(1, "day"));
        this.day = this.date.format("dddd");
        this.getSchedule();

    }

    isGrouped(i: number): boolean {
        return ((this.formGroup?.controls.forms as FormArray).controls[i] as FormGroup).controls?.module?.value?.grouped === true;
    }

    // noinspection JSUnusedGlobalSymbols
    getGroupControls(i: number): { [p: string]: AbstractControl } {
        return ((this.formGroup?.controls.forms as FormArray).controls[i] as FormGroup).controls;
    }

    getForms(): FormArray {
        return this.formGroup?.controls.forms as FormArray;
    }

    onSubmit(): void {
        const schedule: ScheduleEntryEntity[] = [];
        (this.formGroup?.value as ScheduleDto).forms.forEach(form => {
            const scheduleEntry: Partial<ScheduleEntryEntity> = {
                entry: form.id ? { id: Number(form.id) } as TimetableEntryEntity : null,
                module: form.module,
                lecturer: form.lecturer ?? null,
                lecturerL2: form.lecturerL2 ?? null,
                date: this.date.format("YYYY-MM-DD") as DateOnly,
                day: this.day?.toUpperCase() as Day,
                status: Status.ACTIVE,
                startAt: form.lecturer
                    ? hhmmaToHHmmss(form.hhStart, form.mmStart, form.aStart)
                    : hhmmaToHHmmss(form.hhStartL2, form.mmStartL2, form.aStartL2),
                endAt: form.lecturer
                    ? hhmmaToHHmmss(form.hhEnd, form.mmEnd, form.aEnd)
                    : hhmmaToHHmmss(form.hhEndL2, form.mmEndL2, form.aEndL2),
                startAtL2: form.lecturerL2
                    ? hhmmaToHHmmss(form.hhStartL2, form.mmStartL2, form.aStartL2)
                    : hhmmaToHHmmss(form.hhStart, form.mmStart, form.aStart),
                endAtL2: form.lecturerL2
                    ? hhmmaToHHmmss(form.hhEndL2, form.mmEndL2, form.aEndL2)
                    : hhmmaToHHmmss(form.hhEnd, form.mmEnd, form.aEnd),
                slot: 0,
                meetingId: form.meetingId,
                passcode: form.passcode,
                meetingUrl: form.meetingUrl,
                recordingUrl: form.recordingUrl,
                documentsUrl: form.documentsUrl,
                meetingIdL2: form.meetingIdL2,
                passcodeL2: form.passcodeL2,
                meetingUrlL2: form.meetingUrlL2,
                recordingUrlL2: form.recordingUrlL2,
                documentsUrlL2: form.documentsUrlL2,
            };
            if (scheduleEntry.module) {
                schedule.push(scheduleEntry as ScheduleEntryEntity);
            }
        });
        let err: boolean = false;
        for (const entry of schedule) {
            const { module: m, lecturer: l1, lecturerL2: l2 } = entry;
            const g = m?.grouped;
            if (m && !g) {
                entry.lecturerL2 = undefined;
                entry.meetingUrlL2 = undefined;
                entry.recordingUrlL2 = undefined;
            }
            if (
                m && g && (!l1 && !l2) ||
                m && !g && !l1 ||
                !m && l1
            ) {
                err = true;
            }
        }
        if (err) {
            this.app.error("Both module and lecturer has to be selected!");
            return;
        }
        this.app.startLoading();
        this.scheduleService.saveSchedule(this.date.format("YYYY-MM-DD") as DateOnly, schedule)
            .subscribe({
                next: () => {
                    this.app.stopLoading();
                    this.editing = false;
                    this.getSchedule();
                    this.app.success("Schedule successfully updated.");
                },
                error: (err: HttpError<EnumValue & CommonError>) => {
                    this.app.stopLoading();
                    this.app.error(err.error?.message ?? CommonError.ERROR);
                    AppService.log(err);
                },
            });
    }

    isNow(slot: ScheduleEntryEntity): boolean {
        const start = new Date(`${moment(slot.date).format("YYYY-MM-DD")} ${slot.startAt ?? slot.startAtL2}`);
        const end = new Date(`${moment(slot.date).format("YYYY-MM-DD")} ${slot.endAt ?? slot.endAtL2}`);
        const now = new Date(moment().format("YYYY-MM-DD HH:mm"));
        return start < now && now < end;
    }

    isToday(slot: ScheduleEntryEntity): boolean {
        return moment(slot.date).format("YYYY-MM-DD") === moment().format("YYYY-MM-DD");
    }
}
