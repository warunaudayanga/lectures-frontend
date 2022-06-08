// noinspection JSUnusedGlobalSymbols

export type D0 = 0;
export type D1 = 0 | 1;
export type D2 = 0 | 1 | 2;
export type D3 = 0 | 1 | 2 | 3;
export type D4 = 0 | 1 | 2 | 3 | 4;
export type D5 = 0 | 1 | 2 | 3 | 4 | 5;
export type D6 = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type D7 = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type D8 = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type D9 = number;

export type Year = `${D9}${D9}${D9}${D9}`;
export type MM = `${D0}${D9}` | `${D1}${D2}`;
export type DD = `${D2}${D9}` | `${D3}${D1}`;
export type HH = `${D2}${D3}` | `${D1}${D9}`;
export type hh = Exclude<`${D1}${D2}` | `${D0}${D9}`, "00">;
export type mm = `${D5}${D9}`;
export type ss = mm;
export type sss = `${D9}${D9}${D9}`;

export type Time = `${HH}:${mm}:${ss}`;
export type Time12 = `${hh}:${mm}:${ss}`;
export type DateOnly = `${Year}-${MM}-${DD}`;
