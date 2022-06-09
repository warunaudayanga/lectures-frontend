import { Sort } from "../modules/data-table/interfaces/sort-fields.interface";

export interface GetAllDto<Entity> {
    page?: number,
    limit?: number,
    keyword?: string,
    sort?: Sort<Entity>
}
