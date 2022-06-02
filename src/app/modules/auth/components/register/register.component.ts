import { Component } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { AuthService } from "../../services";
import { ToastrService } from "ngx-toastr";
import { HttpError } from "../../../../core/interfaces";
import { AuthError } from "../../enum";

@Component({
    selector: "app-register",
    templateUrl: "./register.component.html",
    styleUrls: ["./register.component.scss"],
})
export class RegisterComponent {

    registerForm: FormGroup = new FormGroup({
        firstName: new FormControl(""),
        lastName: new FormControl(""),
        username: new FormControl(""),
        password: new FormControl(""),
    })

    constructor(private readonly authService: AuthService, private readonly toastrService: ToastrService) { }

    register(): void {
        this.authService.register(this.registerForm.value)
            .subscribe({
                next: () => this.toastrService.success("User registered successfully."),
                error: (err: HttpError<AuthError>) => {
                    switch (err.error.code) {
                        case AuthError.USER_409_EXIST_USERNAME:
                            this.toastrService.error(`User with username '${this.registerForm.value.username}' already exists!`);
                            break;
                        default:
                            this.toastrService.error(err.error.message);
                    }
                },
            });
    }
}
