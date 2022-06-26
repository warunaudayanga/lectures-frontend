import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators } from "@angular/forms";
import { FormControlData } from "../../../../core/modules/form-validation/interfaces";
import { UserEntity } from "../../../user/interfaces/user.interface";
import { HttpError } from "../../../../core/interfaces";
import { EnumValue } from "@angular/compiler-cli/src/ngtsc/partial_evaluator";
import { CommonError } from "../../../../core/enums";
import { AppService } from "../../../../app.service";
import { AuthService } from "../../../auth/services";

@Component({
    selector: "app-change-password",
    templateUrl: "./change-password.component.html",
    styleUrls: ["./change-password.component.scss"],
})
export class ChangePasswordComponent implements OnInit {

    formData!: FormControlData<Partial<UserEntity>>[];

    constructor(public readonly app: AppService, private readonly authService: AuthService) { }

    ngOnInit(): void {
        this.generateForm();
    }

    generateForm(): void {
        this.formData = [
            { type: "password", name: "oldPassword", required: true,
                validators: [Validators.minLength(6), Validators.maxLength(20)] },
            { type: "password", name: "newPassword", required: true,
                validators: [Validators.minLength(6), Validators.maxLength(20)] },
            { type: "password", name: "confirm", required: true,
                validators: [Validators.required], matchesWith: "newPassword" },
        ];
    }

    save(changePasswordForm: FormGroup): void {
        if (changePasswordForm.invalid) {
            changePasswordForm.markAllAsTouched();
            return;
        }
        this.app.startLoading();
        this.authService.changePassword(changePasswordForm.value)
            .subscribe({
                next: () => {
                    this.app.stopLoading();
                    this.app.success("Password changed successfully.");
                },
                error: (err: HttpError<EnumValue & CommonError>) => {
                    this.app.stopLoading();
                    this.app.error(err.error?.message ?? CommonError.ERROR);
                    this.app.loading = false;
                    AppService.log(err);
                },
            });
    }
}
