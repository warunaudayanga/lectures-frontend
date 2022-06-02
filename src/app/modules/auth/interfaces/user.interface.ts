import { BaseEntity } from "../../../core/entity";

export interface UserEntity extends BaseEntity {
    firstName: string,
    lastName: string,
    name: string;
    username: string,
    profileImage: string
}
