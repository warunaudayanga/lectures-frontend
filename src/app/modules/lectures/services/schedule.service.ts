import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, Observable, take } from "rxjs";
import { environment } from "../../../../environments/environment";
import { ScheduleEntryEntity } from "../interfaces/schedule.interface";
import { ScheduleEntryData } from "../interfaces/schedule-entry-data.interface";
import moment from "moment";

export const SCHEDULE_URL = `${environment.apiUrl}/schedule`;

@Injectable({
    providedIn: "root",
})
export class ScheduleService {

    constructor(private readonly http: HttpClient) {}

    getLectureDates(): Observable<string[]> {
        return this.http.get<string[]>(`${SCHEDULE_URL}/lecture-dates`)
            .pipe(take(1), map((res) => {
                return res.map(date => moment(date).format("YYYY-MM-DD"));
            }));
    }

    getScheduleByDate(date: string): Observable<{ schedule: ScheduleEntryEntity[]; generated: boolean }> {
        return this.http.get<{ schedule: ScheduleEntryEntity[]; generated: boolean }>(`${SCHEDULE_URL}/by-date/${date}`)
            .pipe(take(1));
    }

    // noinspection JSUnusedGlobalSymbols
    getScheduleByDates(dates: string[]): Observable<ScheduleEntryData> {
        return this.http.post<ScheduleEntryData>(`${SCHEDULE_URL}/by-dates`, { dates })
            .pipe(take(1));
    }

    saveSchedule(date: string, schedules: ScheduleEntryEntity[]): Observable<ScheduleEntryEntity[]> {
        return this.http.post<ScheduleEntryEntity[]>(`${SCHEDULE_URL}`, { date, schedules })
            .pipe(take(1));
    }
}
