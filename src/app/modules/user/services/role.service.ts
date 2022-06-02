import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, take } from "rxjs";
import { environment } from "../../../../environments/environment";
import { Service } from "../../../core/services";
import { RoleEntity } from "../components/interfaces";
import { IStatusResponse } from "../../../core/interfaces";

export const ROLE_URL = `${environment.apiUrl}/role`;

@Injectable({
    providedIn: "root",
})
export class RoleService extends Service<RoleEntity> {

    constructor(protected readonly http: HttpClient) {
        super(http, "/role");
    }

    getPermissions(): Observable<string[]> {
        return this.http.get<string[]>(`${ROLE_URL}/permissions`)
            .pipe(take(1));
    }

    update(id: number, role: Partial<RoleEntity>): Observable<IStatusResponse> {
        const { permissions } = role;
        return this.http.patch<IStatusResponse>(`${ROLE_URL}/${id}/permissions`, { permissions })
            .pipe(take(1));
    }
}
