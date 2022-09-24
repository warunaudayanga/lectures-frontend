import { PollEntity } from "./poll.interface";
import { VoteOptions } from "./poll-option.interface";
import { BaseEntity } from "../../../../core/entity";

export interface PollVoteEntity extends BaseEntity {
    option: VoteOptions;
    poll?: PollEntity;
}
