import { DateOnly } from "src/app/core/interfaces";
import { ScheduleEntryEntity } from "./schedule.interface";

export type ScheduleEntryData = {
    // @ts-ignore
    [key: DateOnly]: ScheduleEntryEntity[];
}
