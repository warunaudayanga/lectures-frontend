import { BaseEntity } from "../entity";
import { ScheduleEntryEntity } from "../../modules/lectures/interfaces/schedule.interface";
import { TimetableEntryEntity } from "../../modules/lectures/interfaces";
import { ButtonType, ClickType } from "../enums";

export interface ClickEntity extends BaseEntity {
    id: number;
    type: ClickType;
    button: ButtonType;
    schedule?: ScheduleEntryEntity;
    timetable?: TimetableEntryEntity;
}
