import { UserEntity } from "../../user/interfaces/user.interface";

export interface TokenData {
    token: string,
    expiresIn: number,
}

export interface AuthData extends TokenData {
    user: UserEntity
}
