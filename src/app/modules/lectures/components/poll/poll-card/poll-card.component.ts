import { Component, EventEmitter, Input, Output } from "@angular/core";
import { PollData } from "../../../interfaces/poll/poll-data,interface";
import { PollEntity } from "../../../interfaces/poll";
import { groupBy } from "../../../../../core/utils";
import { PollVoteEntity } from "../../../interfaces/poll/poll-vote.interface";
import { PollOptionValue } from "../../../interfaces/poll/poll-option.interface";
import { AppService } from "../../../../../app.service";

// noinspection JSUnusedGlobalSymbols
export enum PollTheme {
    PRIMARY = "primary",
    ORANGE = "orange",
    BLUE = "blue",
    CYAN = "cyan",
    PURPLE = "purple",
    RED = "red",
    GREEN = "green"
}

@Component({
    selector: "app-poll-card",
    templateUrl: "./poll-card.component.html",
    styleUrls: ["./poll-card.component.scss"],
})
export class PollCardComponent {

    @Input() link?: string;

    @Input() poll?: PollEntity;

    @Input() icon!: string;

    @Input() height = "250px";

    @Output() edit: EventEmitter<void> = new EventEmitter<void>();

    @Output() delete: EventEmitter<void> = new EventEmitter<void>();

    PollTheme = PollTheme;

    constructor(public app: AppService) {}

    getData(): PollData[] {
        const data: PollData[] = [];
        const keys = this.poll!.options?.selections?.[0].values ?? [];
        const firstSelection = this.poll!.votes.map(v => ({
            ...v,
            option: {
                ...v.option,
                selection: {
                    value: v.option?.selections?.[0].values ?? [],
                },
            },
        }));
        const dataMap = groupBy(
            firstSelection,
            (vote: PollVoteEntity & { option: { selection: { value: PollOptionValue[] } } }) => vote.option?.selection.value,
        );

        for (const key of keys) {
            data.push({
                name: key,
                count: 0,
            });
            for (const keyArr of dataMap.keys()) {
                if (keyArr?.includes(key)) {
                    const datum = data.find(d => d.name === key);
                    if (datum) datum.count++;
                }
            }
        }

        let total = 0;
        for (const datum of data) {
            total += datum.count;
        }
        for (const datum of data) {
            datum.percent = (datum.count * 100) / total;
        }

        data.sort((a, b) => (a.count > b.count ? -1 : 1));
        return data.slice(0, 5);
    }

    onEdit(): void {
        this.edit.emit();
    }

    onDelete(): void {
        this.delete.emit();
    }

    // isMultiple(): boolean {
    //     return Boolean(this.poll?.options.selections?.[1]?.multiple);
    // }
}
