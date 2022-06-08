import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../services";
import { HttpError } from "../../../../core/interfaces";
import { AuthError } from "../../enum";
import { UserEntity } from "../../../user/interfaces/user.interface";
import { AppForm, FormControlData } from "../../../../core/modules/form-validation/interfaces";
import { AppService } from "../../../../app.service";
import { CourseService } from "../../../lectures/services";
import { CourseEntity } from "../../../lectures/interfaces";

@Component({
    selector: "app-register",
    templateUrl: "./register.component.html",
    styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit {

    @ViewChild("form") form!: AppForm;

    courses!: CourseEntity[];

    formData!: FormControlData<UserEntity>[]

    constructor(
        private readonly app: AppService,
        private readonly authService: AuthService,
        private readonly courseService: CourseService,
    ) {}

    ngOnInit(): void{
        this.getCourses();
    }

    getCourses(): void {
        this.courseService.getAll()
            .subscribe({
                next: res => {
                    this.courses = res.data;
                    this.generateRegForm();
                },
                error: (err: HttpError<AuthError>) => {
                    this.app.error(err.error.message);
                    AppService.log(err);
                },
            });
    }

    generateRegForm(): void {
        this.formData = [
            { type: "text", name: "firstName", required: true, validators: [Validators.minLength(3)] },
            { type: "text", name: "lastName", required: true, validators: [Validators.minLength(3)] },
            { type: "text", name: "username", required: true, validators: [Validators.minLength(3)] },
            { type: "text", name: "password", required: true, validators: [Validators.minLength(6)] },
            { type: "text", name: "confirm", required: true },
            { type: "select", name: "course", value: this.courses[0], required: true,
                options: { values: this.courses, labelKey: "name" } },
            { type: "number", name: "studentId", required: true, validators: [Validators.min(1)] },
            { type: "text", name: "email", label: "E-mail", validators: [Validators.email] },
            { type: "text", name: "phone" },
        ];
    }

    submit(): void {
        this.form.submit();
    }

    register(registerForm: FormGroup): void {
        if (registerForm.invalid) {
            registerForm.markAllAsTouched();
            return;
        }
        this.authService.register(registerForm.value)
            .subscribe({
                next: () => {
                    registerForm.reset();
                    this.app.success("User registered successfully.");
                },
                error: (err: HttpError<AuthError>) => {
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
