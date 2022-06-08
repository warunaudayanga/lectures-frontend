import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, take } from "rxjs";
import { environment } from "../../../../environments/environment";
import { SlotEntity } from "../interfaces";

export const SLOT_URL = `${environment.apiUrl}/slot`;

@Injectable({
    providedIn: "root",
})
export class SlotService {

    constructor(private readonly http: HttpClient) {}

    getAll(): Observable<SlotEntity[]>{
        return this.http.get<SlotEntity[]>(`${SLOT_URL}/all`)
            .pipe(take(1));
    }
}
