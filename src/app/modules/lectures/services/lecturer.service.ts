import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { LecturerEntity } from "../interfaces";
import { Service } from "../../../core/services";

@Injectable({
    providedIn: "root",
})
export class LecturerService extends Service<LecturerEntity> {

    constructor(protected readonly http: HttpClient) {
        super(http, "/lecturer");
    }

    getTitles(): Observable<string[]> {
        return this.http.get<string[]>(`${this.apiUrl}/titles`);
    }
}
