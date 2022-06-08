import { CourseModuleEntity } from "./course-module.interface";
import { BaseEntity } from "../../../core/entity";

export interface CourseEntity extends BaseEntity {
    name: string,
    code: string,
    year: number,
    type: string,
    modules?: CourseModuleEntity[],
    courseString: string
}
