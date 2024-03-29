// noinspection JSUnusedGlobalSymbols

import { environment } from "../../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { IObject, IPaginatedResponse, IStatusResponse } from "../interfaces";
import { BaseEntity } from "../entity";
import { Status } from "../enums";
import { GetAllDto } from "../dto/get-all.dto";

export class Service<Entity extends BaseEntity & IObject> {

    protected readonly apiUrl: string;

    entities!: Entity[];

    constructor(protected http: HttpClient, apiUrl: string) {
        this.apiUrl = environment.apiUrl + apiUrl;
    }

    create<T extends Partial<Entity>>(dto: T): Observable<Entity> {
        return this.http.post<Entity>(`${this.apiUrl}`, dto );
    }

    update<T extends Partial<Entity>>(id: number, dto: T): Observable<IStatusResponse> {
        return this.http.patch<IStatusResponse>(`${this.apiUrl}/${id}`, dto );
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

    getAll(getAllDto?: GetAllDto<Entity>): Observable<IPaginatedResponse<Entity>> {
        return this.http.get<IPaginatedResponse<Entity>>(`${this.apiUrl}`, { params: getAllDto as HttpParams });
    }

    getAllWithoutPagination(status?: string): Observable<Entity[]> {
        return this.http.get<Entity[]>(`${this.apiUrl}/all`, { params: status ? { status } : undefined });
    }

    delete(id: number): Observable<IStatusResponse> {
        return this.http.delete<IStatusResponse>(`${this.apiUrl}/${id}`);
    }

    deleteSelected(ids: number[]): Observable<IStatusResponse> {
        return this.http.post<IStatusResponse>(`${this.apiUrl}`, { ids });
    }
}
