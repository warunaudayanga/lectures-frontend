import { BaseEntity } from "../../../core/entity";
import { CourseModuleEntity } from "./course-module.interface";
import { CourseEntity } from "./course.interface";
import { LecturerEntity } from "./lecturer.interface";
import { Day } from "../enums";
import { SlotEntity } from "./slot.interface";

export interface TimetableEntryEntity extends BaseEntity {
    hasL2?: boolean;
    year: number;
    fromDate: string;
    toDate: null;
    day: Day;
    startAt: string;
    endAt: string;
    course: CourseEntity;
    module: CourseModuleEntity;
    lecturer: LecturerEntity;
    lecturerL2?: LecturerEntity | null;
    slot: SlotEntity;
    slotL2?: SlotEntity;
    meetingsUrl?: string;
    recordingsUrl?: string;
    documentsUrl?: string;
    meetingsUrlL2?: string;
    recordingsUrlL2?: string;
    documentsUrlL2?: string;
}
