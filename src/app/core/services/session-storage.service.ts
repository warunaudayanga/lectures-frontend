import { Injectable } from "@angular/core";
import { TokenData, UserEntity } from "../../modules/auth/interfaces";

@Injectable({
    providedIn: "root",
})
export class SessionStorageService {

    TOKEN_KEY = "token";

    TOKEN_EXP = "token_exp";

    USER_KEY = "user";

    // ROLES_KEY = "roles";

    public setTokenData(tokenData: TokenData): void {
        window.sessionStorage.removeItem(this.TOKEN_KEY);
        window.sessionStorage.removeItem(this.TOKEN_EXP);
        window.sessionStorage.setItem(this.TOKEN_KEY, tokenData.token);
        window.sessionStorage.setItem(this.TOKEN_EXP, String(tokenData.expiresIn));
    }

    public getTokenData(): TokenData | null {
        const token = window.sessionStorage.getItem(this.TOKEN_KEY);
        const expiresIn = Number(window.sessionStorage.getItem(this.TOKEN_EXP));
        if (token && expiresIn && !isNaN(expiresIn)) {
            return { token, expiresIn } as TokenData;
        }
        return null;

    }

    public setUser(user: UserEntity): void {
        window.sessionStorage.removeItem(this.USER_KEY);
        window.sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }

    public getUser(): UserEntity | undefined {
        const userJsonString = window.sessionStorage.getItem(this.USER_KEY);
        if (userJsonString) {
            return JSON.parse(userJsonString) as UserEntity;
        }
        return undefined;
    }

    public clear(): void {
        window.sessionStorage.clear();
    }

}
