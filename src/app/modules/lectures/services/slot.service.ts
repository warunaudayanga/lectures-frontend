import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { SlotEntity } from "../interfaces";
import { Service } from "../../../core/services";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class SlotService extends Service<SlotEntity> {

    constructor(protected readonly http: HttpClient) {
        super(http, "/slot");
    }

    getAllSlots(): Observable<SlotEntity[]> {
        return super.getAllWithoutPagination();
    }

}
