import { Component, OnInit } from "@angular/core";
import { FormControlData } from "../../../../core/modules/form-validation/interfaces";
import { UserEntity } from "../../../user/interfaces/user.interface";
import { AppService } from "../../../../app.service";
import { FormGroup, Validators } from "@angular/forms";
import { UserService } from "../../../user/services";
import { HttpError } from "../../../../core/interfaces";
import { EnumValue } from "@angular/compiler-cli/src/ngtsc/partial_evaluator";
import { CommonError } from "../../../../core/enums";
import { CourseService } from "../../../lectures/services";
import { firstValueFrom } from "rxjs";
import { CourseEntity } from "../../../lectures/interfaces";

@Component({
    selector: "app-edit-profile",
    templateUrl: "./edit-profile.component.html",
    styleUrls: ["./edit-profile.component.scss"],
})
export class EditProfileComponent implements OnInit {

    loading: boolean = false;

    user?: UserEntity;

    courses!: CourseEntity[];

    formData!: FormControlData<UserEntity>[];

    constructor(
        public readonly app: AppService,
        private readonly userService: UserService,
        private readonly courseService: CourseService,
    ) {}

    ngOnInit(): void {
        Promise.all([
            firstValueFrom(this.userService.getMe()),
            firstValueFrom(this.courseService.getAllWithoutPagination()),
        ]).then(responses => {
            const [user, courses] = responses;
            this.user = user;
            this.courses = courses;
            this.generateForm();
        }).catch((err: HttpError<EnumValue & CommonError>) => {
            this.app.error(err.error?.message ?? CommonError.ERROR);
            this.loading = false;
            AppService.log(err);
        });
    }

    generateForm(): void {
        this.formData = [
            { type: "text", name: "firstName", value: this.user?.firstName, required: true,
                validators: [Validators.minLength(3), Validators.maxLength(20)] },
            { type: "text", name: "lastName", value: this.user?.lastName, required: true,
                validators: [Validators.minLength(3), Validators.maxLength(20)] },
            { type: "text", name: "username", value: this.user?.username, required: true,
                validators: [Validators.minLength(6)] },
            { type: "select", name: "course", value: this.user?.course, required: true,
                options: { values: this.courses, labelKey: "name" } },
            { type: "number", name: "studentId", value: this.user?.studentId, label: "Student ID", required: true,
                info: "Last 2 digits of your ID", validators: [Validators.min(1)] },
            { type: "text", name: "email", label: "E-mail", value: this.user?.email,
                info: "You can leave it blank", validators: [Validators.email] },
            { type: "text", name: "phone", value: this.user?.phone, info: "You can leave it blank" },
        ];
    }

    save(userForm: FormGroup): void {
        if (userForm.invalid) {
            userForm.markAllAsTouched();
            return;
        }
        this.app.startLoading();
        this.userService.updateMe(this.app.user!.id, userForm.value)
            .subscribe({
                next: () => {
                    this.app.stopLoading();
                    this.app.success("Profile updated successfully.");
                },
                error: (err: HttpError<EnumValue & CommonError>) => {
                    this.app.stopLoading();
                    this.app.error(err.error?.message ?? CommonError.ERROR);
                    this.loading = false;
                    AppService.log(err);
                },
            });
    }
}
