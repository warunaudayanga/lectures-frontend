import { TimetableEntryEntity } from "./timetable-entry.interface";
import { Day } from "../enums";

export type TimeTableEntryData = {
    [day in Day]?: TimetableEntryEntity[];
}
