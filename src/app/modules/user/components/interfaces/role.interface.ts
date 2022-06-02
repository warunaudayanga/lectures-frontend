import { BaseEntity } from "../../../../core/entity";

export interface RoleEntity extends BaseEntity {
    name: string;
    permissions?: string[];
}
