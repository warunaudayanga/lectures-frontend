// noinspection JSUnusedGlobalSymbols

import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { IObject, IPaginatedResponse, IStatusResponse } from "../interfaces";
import { BaseEntity } from "../entity";
import { Status } from "../enums";
import { Sort } from "../modules/data-table/interfaces/sort-fields.interface";

export class Service<Entity extends BaseEntity & IObject> {

    protected readonly apiUrl: string;

    entities!: Entity[];

    constructor(protected http: HttpClient, apiUrl: string) {
        this.apiUrl = environment.apiUrl + apiUrl;
    }

    create<T extends Partial<Entity>>(obj: T): Observable<Entity> {
        return this.http.post<Entity>(`${this.apiUrl}`, obj );
    }

    update<T extends Partial<Entity>>(id: number, obj: T): Observable<IStatusResponse> {
        return this.http.patch<IStatusResponse>(`${this.apiUrl}/${id}`, obj );
    }

    activate(id: number): Observable<IStatusResponse> {
        return this.http.patch<IStatusResponse>(`${this.apiUrl}/${id}/status`, { status: Status.ACTIVE });
    }

    deactivate(id: number): Observable<IStatusResponse> {
        return this.http.patch<IStatusResponse>(`${this.apiUrl}/${id}/status`, { status: Status.INACTIVE });
    }

    changeStatus<T extends Partial<Entity>>(id: number, status: Status): Observable<IStatusResponse> {
        return status === Status.ACTIVE ? this.activate(id) : this.deactivate(id);
    }

    get(id: number): Observable<Entity> {
        return this.http.get<Entity>(`${this.apiUrl}/${id}`);
    }

    getAll(page?: number, limit?: number, keyword?: string, sort?: Sort<Entity>): Observable<IPaginatedResponse<Entity>> {
        return this.http.get<IPaginatedResponse<Entity>>(`${this.apiUrl}?page=${page}&limit=${limit}&sort=${sort}&keyword=${keyword}`);
    }

    delete(id: number): Observable<IStatusResponse> {
        return this.http.delete<IStatusResponse>(`${this.apiUrl}/${id}`);
    }

    deleteSelected(ids: number[]): Observable<IStatusResponse> {
        return this.http.post<IStatusResponse>(`${this.apiUrl}`, { ids });
    }
}
