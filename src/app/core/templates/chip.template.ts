import { Func } from "../modules/data-table/interfaces";
import { is, Is } from "../utils";

export const chip = (str: string, colorClass?: string): string => {
    return `<div class="chip ${colorClass}">${str}</div>`;
};

export const colorChip = (...args: Is[]): Func => {
    return (str: string): string => chip(str, is(str, args));
};
