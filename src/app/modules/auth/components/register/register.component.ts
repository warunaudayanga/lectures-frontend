import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../services";
import { HttpError } from "../../../../core/interfaces";
import { AuthError } from "../../enum";
import { UserEntity } from "../../../user/interfaces/user.interface";
import { FormControlData } from "../../../../core/modules/form-validation/interfaces";
import { AppService } from "../../../../app.service";
import { CourseService } from "../../../lectures/services";
import { CourseEntity } from "../../../lectures/interfaces";

@Component({
    selector: "app-register",
    templateUrl: "./register.component.html",
    styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit {

    courses!: CourseEntity[];

    formData!: FormControlData<UserEntity>[];

    constructor(
        public readonly app: AppService,
        private readonly authService: AuthService,
        private readonly courseService: CourseService,
    ) {}

    ngOnInit(): void{
        this.getCourses();
    }

    getCourses(): void {
        this.app.startLoading();
        this.courseService.getAll()
            .subscribe({
                next: res => {
                    this.courses = res.data;
                    if (!this.courses.length) {
                        this.app.load("/");
                    }
                    this.generateRegForm();
                    this.app.stopLoading();
                },
                error: (err: HttpError<AuthError>) => {
                    this.app.stopLoading();
                    this.app.error(err.error.message);
                    AppService.log(err);
                },
            });
    }

    generateRegForm(): void {
        this.formData = [
            { type: "text", name: "firstName", required: true,
                validators: [Validators.minLength(3), Validators.maxLength(20)] },
            { type: "text", name: "lastName", required: true,
                validators: [Validators.minLength(3), Validators.maxLength(20)] },
            { type: "text", name: "username", required: true,
                validators: [Validators.minLength(6), Validators.maxLength(50)] },
            { type: "password", name: "password", required: true,
                validators: [Validators.minLength(6), Validators.maxLength(20)] },
            { type: "password", name: "confirm", required: true,
                validators: [Validators.required], matchesWith: "password" },
            { type: "select", name: "course", value: this.courses[0], required: true,
                options: { values: this.courses, labelKey: "name" } },
            { type: "number", name: "studentId", label: "Student ID", required: true,
                info: "Last 2 digits of your ID", validators: [Validators.min(1)] },
            { type: "text", name: "email", label: "E-mail", info: "You can leave it blank", validators: [Validators.email] },
            { type: "text", name: "phone", info: "You can leave it blank" },
        ];
    }

    register(registerForm: FormGroup): void {
        if (registerForm.invalid) {
            registerForm.markAllAsTouched();
            return;
        }
        this.app.startLoading();
        this.authService.register(registerForm.value)
            .subscribe({
                next: () => {
                    this.app.stopLoading();
                    registerForm.reset();
                    this.app.success("User registered successfully.");
                    this.app.load("/");
                },
                error: (err: HttpError<AuthError>) => {
                    this.app.stopLoading();
                    switch (err.error.code) {
                        case AuthError.USER_409_EXIST_USERNAME:
                            this.app.error(`User with username '${registerForm.value.username}' already exists!`);
                            break;
                        case AuthError.USER_409_EXIST_STUDENT_ID:
                            this.app.error(`User with student id '${registerForm.value.studentId}' already exists!`);
                            break;
                        default:
                            this.app.error(err.error.message);
                            AppService.log(err);
                    }
                },
            });
    }
}
