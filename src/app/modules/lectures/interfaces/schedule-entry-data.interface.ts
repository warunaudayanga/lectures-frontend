import { ScheduleEntryEntity } from "./schedule.interface";

export type ScheduleEntryData = {
    // @ts-ignore
    [key: string]: ScheduleEntryEntity[];
}
