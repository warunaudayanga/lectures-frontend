import { PollTheme } from "../../components/poll/poll-card/poll-card.component";

export type PollOptionValue = string;

export interface VoteSelection {
    name?: string;
    values?: PollOptionValue[];
}

export interface PollSelection extends VoteSelection {
    label?: string;
    multiple?: boolean;
}

export interface PollOptions {
    selections?: PollSelection[];
    themeClass?: PollTheme;
}

export interface VoteOptions {
    selections?: VoteSelection[];
}
