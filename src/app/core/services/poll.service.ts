import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Service } from "./index";
import { PollEntity } from "../../modules/lectures/interfaces/poll";

@Injectable({
    providedIn: "root",
})
export class PollService extends Service<PollEntity> {

    constructor(protected readonly http: HttpClient) {
        super(http, "/poll");
    }

}
