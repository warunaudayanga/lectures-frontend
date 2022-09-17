import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../services";
import { UntypedFormControl, UntypedFormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { AppService } from "../../../../app.service";
import { HttpError } from "../../../../core/interfaces";
import { AuthError } from "../../enum";
import { CourseService } from "../../../lectures/services";

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {

    loginForm: UntypedFormGroup = new UntypedFormGroup({
        username: new UntypedFormControl(""),
        password: new UntypedFormControl(""),
    });

    hasCourses?: boolean;

    constructor(
        public readonly app: AppService,
        private readonly router: Router,
        private readonly authService: AuthService,
        private readonly courseService: CourseService,
    ) { }

    ngOnInit(): void {
        this.courseService.getAll()
            .subscribe(res => {
                this.hasCourses = Boolean(res.data.length);
            });
    }

    login(): void {
        this.app.startLoading();
        this.authService.login(this.loginForm.value)
            .subscribe({
                next: () => {
                    this.app.stopLoading();
                    this.app.success("User logged in successfully.");
                    const ignored = this.router.navigateByUrl("/");
                },
                error: (err: HttpError<AuthError>) => {
                    this.app.stopLoading();
                    this.app.error(err.error.message);
                    AppService.log(err);
                },
            });
    }
}
