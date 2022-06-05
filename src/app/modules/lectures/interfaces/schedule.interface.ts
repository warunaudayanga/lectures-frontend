import { BaseEntity } from "../../../core/entity";
import { Day } from "../enums";
import { TimetableEntryEntity } from "./timetable-entry.interface";
import { DateOnly, Time } from "../../../core/interfaces";
import { LecturerEntity } from "./lecturer.interface";
import { CourseModuleEntity } from "./course-module.interface";

export interface ScheduleEntryEntity extends BaseEntity {
    entry: TimetableEntryEntity | null;
    module: CourseModuleEntity;
    lecturer?: LecturerEntity | null;
    lecturerL2?: LecturerEntity | null;
    day: Day;
    date: DateOnly;
    slot?: number;
    startAt?: Time;
    endAt?: Time;
    startAtL2: Time;
    endAtL2: Time;
    meetingId?: string;
    passcode?: string;
    meetingUrl?: string;
    recordingUrl?: string;
    documentsUrl?: string;
    meetingIdL2?: string;
    passcodeL2?: string;
    meetingUrlL2?: string;
    recordingUrlL2?: string;
    documentsUrlL2?: string;
}
