import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, take } from "rxjs";
import { TimeTableEntryData, TimetablePayload } from "../interfaces";
import { environment } from "../../../../environments/environment";

export const TIMETABLE_URL = `${environment.apiUrl}/timetable`;

@Injectable({
    providedIn: "root",
})
export class TimetableService {

    constructor(private readonly http: HttpClient) {}

    getTimetableData(): Observable<TimeTableEntryData> {
        return this.http.get<TimeTableEntryData>(`${TIMETABLE_URL}`)
            .pipe(take(1));
    }

    saveTimetable(payload: TimetablePayload): Observable<any> {
        return this.http.patch(`${TIMETABLE_URL}`, payload)
            .pipe(take(1));
    }
}
