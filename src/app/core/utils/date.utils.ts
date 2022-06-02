import { AbstractControl, ValidationErrors } from "@angular/forms";
import moment from "moment";

export const stringToDate = (entity: {[key: string]: any}): void => {
    Object.keys(entity).forEach(key => {
        if (Array.isArray(entity[key])) {
            entity[key].forEach((e: any) => (e ? stringToDate(e) : undefined));
            if (entity[key]) stringToDate(entity[key]);
        } else if (typeof entity[key] === "object") {
            if (entity[key]) stringToDate(entity[key]);
        } else if (String(entity[key]).match(/(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/)) {
            entity[key] = new Date(entity[key]);
        } else if (String(entity[key]).match(/(\d{4}-[01]\d-[0-3]\d)/)) {
            entity[key] = new Date(entity[key]);
        }
    });
};

export const validateBsDatepickerDate = (control: AbstractControl): ValidationErrors | null => {
    return String(control.value) === "Invalid Date" ? { date: true } : null;
};

export const dateTimeHtml = (date: Date): string => {
    return `<span class="datetime">
                <div class="date">${moment(date).format("YYYY-MM-DD")}</div>
                <div class="time">${moment(date).format("hh:mm:ss a")}</div>
            </span>`;
};
