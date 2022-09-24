import { PollOptions } from "./poll-option.interface";
import { PollVoteEntity } from "./poll-vote.interface";
import { UserEntity } from "../../../user/interfaces/user.interface";
import { BaseEntity } from "../../../../core/entity";
import { PollTheme } from "../../components/poll/poll-card/poll-card.component";
import { IObject } from "../../../../core/interfaces";

export interface PollEntity extends BaseEntity {
    name: string;
    code: string;
    description?: string;
    startTime?: Date;
    endTime?: Date;
    options: PollOptions;
    votes: PollVoteEntity[];
    requireIdentity: boolean;
    updatable: boolean;
    removable: boolean;
    users?: UserEntity[];
}

export interface PollAdditionalData extends IObject {
    color: PollTheme;
}
