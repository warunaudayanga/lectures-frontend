import { BaseEntity } from "../../../core/entity";

export interface LecturerEntity extends BaseEntity{
    title: string;
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    profileImage: string;
    name: string;
}
