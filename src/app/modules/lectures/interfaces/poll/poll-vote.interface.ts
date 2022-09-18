import { PollEntity } from "./poll.interface";
import { PollOption } from "./poll-option.interface";
import { BaseEntity } from "../../../../core/entity";

export interface PollVoteEntity extends BaseEntity {
    option: PollOption;
    poll: PollEntity;
}
