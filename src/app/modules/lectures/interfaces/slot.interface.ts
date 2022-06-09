import { BaseEntity } from "../../../core/entity";

export interface SlotEntity extends BaseEntity{
    number: number,
    startAt: string,
    endAt: string,
}
