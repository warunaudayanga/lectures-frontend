import { Status } from "../enums";

export interface InteractedBy {
    firstName: string;
    lastName: string;
    name: string;
    username: string;
    profileImage: string
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
}

export interface BaseEntity {
    id: number;
    status: Status;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
    createdBy?: InteractedBy;
    updatedBy?: InteractedBy;
    deletedBy?: InteractedBy
}
