import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { CourseModuleEntity } from "../interfaces";
import { Service } from "../../../core/services";

@Injectable({
    providedIn: "root",
})
export class CourseModuleService extends Service<CourseModuleEntity>{

    constructor(protected readonly http: HttpClient) {
        super(http, "/module");
    }

    getDepartments(): Observable<string[]> {
        return this.http.get<string[]>(`${this.apiUrl}/departments`);
    }
}
