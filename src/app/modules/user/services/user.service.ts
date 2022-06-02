import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, take } from "rxjs";
import { environment } from "../../../../environments/environment";
import { Service } from "../../../core/services";
import { UserEntity } from "../../auth/interfaces";

export const COURSE_URL = `${environment.apiUrl}/course`;

@Injectable({
    providedIn: "root",
})
export class UserService extends Service<UserEntity> {

    constructor(protected readonly http: HttpClient) {
        super(http, "/user");
    }

    getTypes(): Observable<string[]> {
        return this.http.get<string[]>(`${COURSE_URL}/types`)
            .pipe(take(1));
    }
}
