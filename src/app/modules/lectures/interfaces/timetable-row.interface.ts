import { TimetableEntryEntity } from "./timetable-entry.interface";
import { Day } from "../enums";
import { SlotEntity } from "./slot.interface";

export interface TimeTableRow {
    slot: SlotEntity;
    data: {
        [key in Day ]?: TimetableEntryEntity;
    }
}
