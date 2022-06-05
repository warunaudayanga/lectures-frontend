import { Component } from "@angular/core";
import { AuthService } from "../../services";
import { FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { AppService } from "../../../../app.service";
import { HttpError } from "../../../../core/interfaces";
import { AuthError } from "../../enum";

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"],
})
export class LoginComponent {

    loginForm: FormGroup = new FormGroup({
        username: new FormControl(""),
        password: new FormControl(""),
    })

    constructor(
        private readonly app: AppService,
        private readonly router: Router,
        private readonly authService: AuthService,
    ) { }

    login(): void {
        this.authService.login(this.loginForm.value)
            .subscribe({
                next: () => {
                    this.app.success("User logged in successfully.");
                    const ignored = this.router.navigateByUrl("/");
                },
                error: (err: HttpError<AuthError>) => {
                    this.app.error(err.error.message);
                    AppService.log(err);
                },
            });
    }
}
