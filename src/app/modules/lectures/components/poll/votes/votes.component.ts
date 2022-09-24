import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { PollEntity } from "../../../interfaces/poll";
import { PollService } from "../../../services/poll.service";
import { HttpError, IObject } from "../../../../../core/interfaces";
import { EnumValue } from "@angular/compiler-cli/src/ngtsc/partial_evaluator";
import { CommonError } from "../../../../../core/enums";
import { AppService } from "../../../../../app.service";
import { FormControlData } from "../../../../../core/modules/form-validation/interfaces";
import { EntityComponent } from "../../../../../core/components";
import { PollVoteEntity } from "../../../interfaces/poll/poll-vote.interface";
import { DialogService } from "../../../../../core/modules/dialog";
import { ViewOptions } from "src/app/core/modules/dialog/interfaces";
import { VoteOptions } from "../../../interfaces/poll/poll-option.interface";
import { UserService } from "../../../../user/services";

export interface PollResult {
    keys: string[];
    count: number;
    percent?: number;
}

@Component({
    selector: "app-votes",
    templateUrl: "./votes.component.html",
    styleUrls: ["./votes.component.scss"],
})
export class VotesComponent extends EntityComponent<PollVoteEntity> implements OnInit {
    public dataTable = undefined;

    code: string;

    userCount?: number;

    poll?: PollEntity;

    result?: PollResult[];

    constructor(
        public readonly app: AppService,
        private readonly route: ActivatedRoute,
        private readonly location: Location,
        private readonly pollService: PollService,
        private readonly userService: UserService,
        protected readonly dialogService: DialogService,
    ) {
        super(app, dialogService, undefined, { name: "vote", key: "" });
        this.code = this.route.snapshot.paramMap.get("code") as string;
    }

    ngOnInit(): void {
        const { poll } = this.location.getState() as { poll: PollEntity };
        this.getCount();
        if (poll) {
            this.poll = poll;
            this.generateData();
        } else {
            this.getPoll();
        }
    }

    getCount(): void {
        this.userService.getCount()
            .subscribe({
                next: count => {
                    this.userCount = count;
                },
                error: (err: HttpError<EnumValue & CommonError>) => {
                    this.app.error(err.error?.message ?? CommonError.ERROR);
                    this.loading = false;
                    AppService.log(err);
                },
            });
    }

    // noinspection JSUnusedLocalSymbols
    protected formData(data?: any): FormControlData<any>[] {
        const formControlList: FormControlData<PollVoteEntity, IObject>[] = [];
        for (const selection of this.poll?.options?.selections ?? []) {
            if (selection.name && selection.values) {
                formControlList.push({
                    type: "select",
                    name: selection.name,
                    label: selection.label ?? "",
                    value: selection.multiple ? [selection.values[0] ?? ""] : selection.values[0] ?? "",
                    required: true,
                    options: { multiple: selection.multiple, values: selection.values, labels: selection.values },
                });
            }
        }
        return formControlList;
    }

    // noinspection JSUnusedLocalSymbols
    protected viewDialogData(entity: PollVoteEntity): ViewOptions<PollVoteEntity, number, IObject> {
        throw new Error("Method not implemented.");
    }

    getPoll(): void {
        this.app.startLoading();
        this.pollService.getByCode(this.code).subscribe({
            next: poll => {
                this.app.stopLoading();
                this.poll = poll;
                this.generateData();
            },
            error: (err: HttpError<EnumValue & CommonError>) => {
                this.app.stopLoading();
                this.app.error(err.error?.message ?? CommonError.ERROR);
                AppService.log(err);
            },
        });
    }

    vote(): void {
        this.generateFormDialog(this.formData())
            .subscribe((response) => {
                if (response.form.valid) {
                    const voteOptions: VoteOptions = {
                        selections: [],
                    };
                    for (const [name, values] of Object.entries(response.form.value)) {
                        voteOptions.selections?.push({
                            name, values: Array.isArray(values) ? values : [values],
                        });
                    }
                    this.app.startLoading();
                    this.pollService.vote(this.poll!.id, voteOptions, !this.poll?.requireIdentity)
                        .subscribe({
                            next: () => {
                                this.poll?.users?.push(this.app.user!);
                                response.prompt.close();
                                this.app.stopLoading();
                                this.app.success("Voted successfully");
                                this.getPoll();
                            }, error: (err: HttpError<EnumValue & CommonError>) => {
                                this.app.error(err.error?.message ?? CommonError.ERROR);
                                AppService.log(err);
                                this.app.stopLoading();
                            },
                        });
                }
            });
    }

    isVoted(): boolean {
        return Boolean(this.poll?.users?.find(u => u.id === this.app.user?.id));
    }

    generateData(): void {
        let matrix: string[][] = [];
        let keyArrayList: PollResult[] = [];

        const selections = this.poll?.options?.selections;
        if (selections) for (const selection of selections) {
            const list: string[] = [];
            if (selection.values) for (const value of selection.values) {
                list.push(value);
            }
            matrix.push(list);
        }

        const matrixMeta: {l: number, i: number}[] = [];
        let count = 1;

        for (let i = 0; i < matrix.length; i++) {
            matrixMeta[i] = { l: matrix[i].length, i: 0 };
            count *= matrix[i].length;
        }

        for (let i = 0; i < count; i++) {
            const indexes = matrixMeta.map(m => m.i);
            const keys = [];
            for (let j = 0; j < indexes.length; j++) {
                keys.push(matrix[j][indexes[j]]);
            }
            keyArrayList.push({ keys, count: 0 });
            const lastJ = matrixMeta.length - 1;
            for (let j = lastJ; j >= 0; j--) {
                if (j === lastJ && matrixMeta[lastJ].i < matrixMeta[lastJ].l) {
                    matrixMeta[lastJ].i++;
                }
                for (let k = 0; k < matrixMeta.length; k++) {
                    if (matrixMeta[lastJ - (j + k)] && matrixMeta[lastJ - (j + k)]?.i === matrixMeta[lastJ - (j + k)]?.l) {
                        matrixMeta[lastJ - (j + k)].i = 0;
                        if (matrixMeta[lastJ - (j + k + 1)]) matrixMeta[lastJ - (j + k + 1)].i++;
                    }
                }
            }
        }
        // console.log(keyArrayList);
        let total: number = 0;
        for (const keyArray of keyArrayList) {
            if (this.poll!.votes) {
                for (const voteOption of this.poll!.votes!.map(v => v.option)) {
                    let has = 0;
                    for (let i = 0; i < keyArray.keys.length; i++) {
                        if (voteOption?.selections?.[i]?.values?.includes(keyArray.keys[i])) has++;
                    }
                    if (has === keyArray.keys.length) {
                        keyArray.count++;
                        total++;
                    }
                }
            }
        }
        for (const keyArray of keyArrayList) {
            keyArray.percent = (keyArray.count * 100) / total;
        }


        keyArrayList.sort((a, b) => (a.count > b.count ? -1 : 1));
        this.result = keyArrayList.filter(kal => kal.count > 0);

        // const keys = this.poll?.options?.selections?.[1].values ?? [];
        // const sort = (arr: any[]): any[] => arr.sort();
        // const firstSelection = this.poll!.votes.map(v => ({
        //     ...v,
        //     option: {
        //         ...v.option,
        //         selection: {
        //             value: sort(v.option?.selections?.[1].values ?? [])?.join(",") ?? "",
        //         },
        //     },
        // }));
        // const dataMap = groupBy(
        //     firstSelection,
        //     (vote: PollVoteEntity & { option: { selection: { value: string } } }) => vote.option?.selection.value,
        // );
        // const keyList = [];
        // for (const key of dataMap.keys()) {
        //     keyList.push(key);
        // }
        // console.log(dataMap);
        //
        // // const addArray = (values?: string[]) => {
        // //     const vList = [];
        // //     if (values) for (const value of values) {
        // //         vList.push(value);
        // //     }
        // //     return vList;
        // // }
    }
}
