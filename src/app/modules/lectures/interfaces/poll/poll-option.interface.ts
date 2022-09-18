import { PollTheme } from "../../components/poll/poll-card/poll-card.component";

export type PollOptionValue = string | number | boolean;

export interface PollOptions {
    options: PollOptionValue[];
    themeClass: PollTheme;
}

export interface PollOption {
    option: PollOptionValue;
}
