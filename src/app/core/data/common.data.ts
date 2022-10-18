import { toFirstCase, toTitleCase } from "../utils";
import { badge } from "../templates/chip.template";
import { Columns, CSSMeasurement, Option } from "../modules/data-table/interfaces";
import { environment } from "../../../environments/environment";

export const rowHeight: number = environment.tables.row.height;
export const userNameWidth: CSSMeasurement = "115px";
export const statusWidth: CSSMeasurement = "95px";
export const statusFormat = [toFirstCase, badge(["Active", "active"])];

export const titleFormat = (str: string): string => toTitleCase(str.toLowerCase());

export const tableOptions = {
    itemsPerPage: 50,
    width: "175px",
    main: { html: "<i class='icofont icofont-ui-add'></i>", colorClass: "btn-app-primary-invert" },
    common: [
        { html: "<i class='icofont icofont-ui-note'></i>", colorClass: "btn-app-primary" },
        { html: "<i class='icofont icofont-ui-edit'></i>", colorClass: "btn-warning" },
        { html: "<i class='icofont icofont-ui-fire-wall'></i>", colorClass: "btn-dark" },
        { html: "<i class='icofont icofont-ui-delete'></i>", colorClass: "btn-danger" },
    ] as Columns<Option, 4>,
};

export const DATE_FORMAT_FOR_MAT = {
    parse: {
        dateInput: ["YYYY-MM-DD", "LL"],
    },
    display: {
        dateInput: "YYYY-MM-DD",
        monthYearLabel: "MMM YYYY",
        dateA11yLabel: "LL",
        monthYearA11yLabel: "MMMM YYYY",
    },
};

export const regex = {
    year: new RegExp(/^[1-9]\d{3,}$/),
    time: new RegExp(/^([0-1]?\d|2[0-3])(?::([0-5]?\d))?(?::([0-5]?\d))?$/),
    dateOnly: new RegExp(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/),
    pollCode: new RegExp(/^[-_\w]+$/),
};
