import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, take } from "rxjs";
import { CourseEntity } from "../interfaces";
import { Service } from "../../../core/services";

@Injectable({
    providedIn: "root",
})
export class CourseService extends Service<CourseEntity> {

    constructor(protected readonly http: HttpClient) {
        super(http, "/course");
    }

    getTypes(): Observable<string[]> {
        return this.http.get<string[]>(`${this.apiUrl}/types`)
            .pipe(take(1));
    }
}
