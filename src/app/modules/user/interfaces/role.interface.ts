import { BaseEntity } from "../../../core/entity";
import { Permission } from "../../auth/enum/permission.enum";

export interface RoleEntity extends BaseEntity {
    name: string;
    permissions: Permission[];
}
