import { Injectable } from "@angular/core";
import { TokenData } from "../../modules/auth/interfaces";

@Injectable({
    providedIn: "root",
})
export class LocalStorageService {

    TOKEN_KEY = "token";

    TOKEN_EXP = "token_exp";

    USER_KEY = "user";

    // ROLES_KEY = "roles";

    public setTokenData(tokenData: TokenData): void {
        window.localStorage.removeItem(this.TOKEN_KEY);
        window.localStorage.removeItem(this.TOKEN_EXP);
        window.localStorage.setItem(this.TOKEN_KEY, tokenData.token);
        window.localStorage.setItem(this.TOKEN_EXP, String(tokenData.expiresIn));
    }

    public getTokenData(): TokenData | null {
        const token = window.localStorage.getItem(this.TOKEN_KEY);
        const expiresIn = Number(window.localStorage.getItem(this.TOKEN_EXP));
        if (token && expiresIn && !isNaN(expiresIn)) {
            return { token, expiresIn } as TokenData;
        }
        return null;

    }

    public setUserId(id: number): void {
        window.localStorage.removeItem(this.USER_KEY);
        window.localStorage.setItem(this.USER_KEY, String(id));
    }

    public getUserId(): number | undefined {
        const userJsonString = window.localStorage.getItem(this.USER_KEY);
        if (userJsonString) {
            return parseInt(userJsonString);
        }
        return undefined;
    }

    public clear(): void {
        window.localStorage.clear();
    }

}
