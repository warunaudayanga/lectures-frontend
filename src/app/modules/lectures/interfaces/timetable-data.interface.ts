import { TimeTableEntryEntity } from "./timetable-entry.interface";
import { Day } from "../enums";

export type TimeTableData = {
    [day in Day]?: TimeTableEntryEntity[];
}
