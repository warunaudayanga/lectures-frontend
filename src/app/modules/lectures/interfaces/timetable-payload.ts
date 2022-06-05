import { TimetableEntryEntity } from "./timetable-entry.interface";

export interface TimetablePayload {
    create: TimetableEntryEntity[],
    update: TimetableEntryEntity[],
    delete: number[]
}
