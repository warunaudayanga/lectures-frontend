import { Func } from "../modules/data-table/interfaces";
import { is, Is } from "../utils";

export const defaultBadge = (str: string, colorClass?: string): string => {
    return `<div><div class="chip ${colorClass}">${str}</div></div>`;
};

export const defaultTag = (str: string, colorClass?: string): string => {
    return `<div><div class="tag ${colorClass}">${str}</div></div>`;
};

export const badge = (...args: Is[]): Func => {
    return (str: string): string => defaultBadge(str, is(str, args));
};

export const tag = (...args: Is[]): Func => {
    return (str: string): string => defaultTag(str, is(str, args));
};
