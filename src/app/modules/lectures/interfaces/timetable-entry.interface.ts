import { BaseEntity } from "../../../core/entity";
import { CourseModuleEntity } from "./course-module.interface";
import { CourseEntity } from "./course.interface";
import { LecturerEntity } from "./lecturer.interface";
import { Day } from "../enums";
import { SlotEntity } from "./slot.interface";

export interface TimeTableEntryEntity extends BaseEntity {
    year: number;
    fromDate: string;
    toDate: null;
    day: Day;
    startAt: string;
    endAt: string;
    course: CourseEntity;
    module: CourseModuleEntity;
    lecturer: LecturerEntity;
    slot: SlotEntity;
}
