// noinspection JSUnusedGlobalSymbols

export const transposeArray = <T = any>(arr: T[][]): T[][] => arr[0].map((col, i) => arr.map(row => row[i]));

export const sum = (arr: number[]): number => arr.reduce((acc, val) => acc + val);
