import { TimeTableEntryEntity } from "./timetable-entry.interface";

export interface TimetablePayload {
    create: TimeTableEntryEntity[],
    update: TimeTableEntryEntity[],
    delete: number[]
}
