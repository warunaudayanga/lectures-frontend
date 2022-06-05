import { BaseEntity } from "../../../core/entity";
import { RoleEntity } from "./role.interface";
import { CourseEntity } from "../../lectures/interfaces";

export interface UserEntity extends BaseEntity {
    firstName: string;
    lastName: string;
    username: string;
    profileImage?: string;
    role?: RoleEntity;
    course?: CourseEntity;
    courseVerified: boolean;
    studentId: number;
    studentIdString: number;
    studentIdVerified: boolean;
    phone?: string;
    phoneVerified: boolean;
    email?: string;
    emailVerified: boolean;
    name: string;
}
