import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Service } from "../../../core/services";
import { UserEntity } from "../../auth/interfaces";
import { IStatusResponse } from "../../../core/interfaces";
import { RoleEntity } from "../interfaces";

@Injectable({
    providedIn: "root",
})
export class UserService extends Service<UserEntity> {

    constructor(protected readonly http: HttpClient) {
        super(http, "/user");
    }

    changeRole<T extends Partial<UserEntity>>(id: number, role: RoleEntity): Observable<IStatusResponse> {
        return this.http.patch<IStatusResponse>(`${this.apiUrl}/${id}/role`, { role });
    }
}
