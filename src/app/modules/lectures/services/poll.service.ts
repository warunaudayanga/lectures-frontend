import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Service } from "../../../core/services";
import { PollEntity } from "../interfaces/poll";
import { Observable } from "rxjs";
import { VoteOptions } from "../interfaces/poll/poll-option.interface";
import { PollVoteEntity } from "../interfaces/poll/poll-vote.interface";

@Injectable({
    providedIn: "root",
})
export class PollService extends Service<PollEntity> {

    constructor(protected readonly http: HttpClient) {
        super(http, "/poll");
    }

    getByCode(code: string): Observable<PollEntity> {
        return this.http.get<PollEntity>(`${this.apiUrl}/by-code/${code}`);
    }

    vote(pollId: number, option: VoteOptions, anonymous: boolean): Observable<PollVoteEntity> {
        return this.http.post<PollVoteEntity>(`${this.apiUrl}/vote`, { pollId, option, anonymous });
    }

}
