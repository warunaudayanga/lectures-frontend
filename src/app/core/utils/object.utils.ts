// noinspection JSUnusedGlobalSymbols

export type Is = [is: string, styleClass: string]

export const omit = <T extends { [key: string]: any }>(obj: T, keys?: (keyof T)[]): void => {
    if (obj) {
        Object.keys(obj).forEach(key => {
            return (obj[key] === undefined || keys?.includes(key)) && delete obj[key];
        });
    }
};

export const is = (str: string, isArr: Is[]): string => {
    for (const [is, value] of isArr) {
        if (str === is) {
            return value;
        }
    }
    return "";
};
