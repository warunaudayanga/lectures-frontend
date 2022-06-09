import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../services";
import { FormControl, FormGroup } from "@angular/forms";
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

    loginForm: FormGroup = new FormGroup({
        username: new FormControl(""),
        password: new FormControl(""),
    })

    hasCourses?: boolean;

    constructor(
        private readonly app: AppService,
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
