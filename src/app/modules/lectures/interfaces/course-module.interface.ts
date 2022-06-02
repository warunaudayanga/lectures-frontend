import { BaseEntity } from "../../../core/entity";

export interface CourseModuleEntity extends BaseEntity {
    name: string;
    department: string;
    semester: number;
    credits: number;
    serial: string;
    revised: true;
    code: string;
}
