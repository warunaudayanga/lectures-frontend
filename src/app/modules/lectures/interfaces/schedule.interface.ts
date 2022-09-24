import { BaseEntity } from "../../../core/entity";
import { Day } from "../enums";
import { TimetableEntryEntity } from "./timetable-entry.interface";
import { LecturerEntity } from "./lecturer.interface";
import { CourseModuleEntity } from "./course-module.interface";

export interface ScheduleEntryEntity extends BaseEntity {
    entry: TimetableEntryEntity | null;
    module: CourseModuleEntity;
    lecturer?: LecturerEntity | null;
    lecturerL2?: LecturerEntity | null;
    day: Day;
    date: string;
    slot?: number;
    startAt?: string;
    endAt?: string;
    startAtL2: string;
    endAtL2: string;
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
