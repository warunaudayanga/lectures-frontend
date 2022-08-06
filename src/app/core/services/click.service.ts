import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Service } from "./index";
import { ClickEntity } from "../interfaces";

@Injectable({
    providedIn: "root",
})
export class ClickService extends Service<ClickEntity> {

    constructor(protected readonly http: HttpClient) {
        super(http, "/click");
    }

}
