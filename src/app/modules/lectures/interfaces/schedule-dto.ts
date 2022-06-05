import { CourseModuleEntity } from "./course-module.interface";
import { LecturerEntity } from "./lecturer.interface";

export interface ScheduleFormGroupValue {
    id?: string;
    hhStart: string;
    mmStart: string;
    aStart: string;
    hhEnd: string;
    mmEnd: string;
    aEnd: string;
    hhStartL2: string;
    mmStartL2: string;
    aStartL2: string;
    hhEndL2: string;
    mmEndL2: string;
    aEndL2: string;
    module?: CourseModuleEntity;
    lecturer?: LecturerEntity;
    lecturerL2?: LecturerEntity;
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
export interface ScheduleDto {
    forms: ScheduleFormGroupValue[]
}
