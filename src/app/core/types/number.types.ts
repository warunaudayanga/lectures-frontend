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
export type D9 = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type DI0 = D9;
export type DI1 = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type DI2 = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type DI3 = 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type DI4 = 4 | 5 | 6 | 7 | 8 | 9;
export type DI5 = 5 | 6 | 7 | 8 | 9;
export type DI6 = 6 | 7 | 8 | 9;
export type DI7 = 7 | 8 | 9;
export type DI8 = 8 | 9;
export type DI9 = 9;

type PrependNextNum<A extends Array<unknown>> = A["length"] extends infer T ? ((t: T, ...a: A) => void) extends ((...x: infer X) => void) ? X : never : never;

type EnumerateInternal<A extends Array<unknown>, N extends number> = { 0: A, 1: EnumerateInternal<PrependNextNum<A>, N> }[N extends A["length"] ? 0 : 1];

export type Enumerate<N extends number> = EnumerateInternal<[], N> extends (infer E)[] ? E : never;

export type Range<FROM extends number, TO extends number> = Exclude<Enumerate<TO>, Enumerate<FROM>>;

export type Percentage = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 |
    21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 | 41 | 42 | 43 |
    44 | 45 | 46 | 47 | 48 | 49 | 50 | 51 | 52 | 53 | 54 | 55 | 56 | 57 | 58 | 59 | 60 | 61 | 62 | 63 | 64 | 65 | 66 |
    67 | 68 | 69 | 70 | 71 | 72 | 73 | 74 | 75 | 76 | 77 | 78 | 79 | 80 | 81 | 82 | 83 | 84 | 85 | 86 | 87 | 88 | 89 |
    90 | 91 | 92 | 93 | 94 | 95 | 96 | 97 | 98 | 99 | 100;
