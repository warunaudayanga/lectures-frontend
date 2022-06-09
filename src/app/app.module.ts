import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { LayoutModule } from "./layout";
import { DialogModule } from "./core/modules/dialog";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { AuthInterceptor } from "./modules/auth/interceptors";
import { ErrorResponseInterceptor, ResponseInterceptor } from "./core/interceptors";
import { HomeComponent } from "./modules/lectures/components";
import { ToastrModule } from "ngx-toastr";
import { AppCommonModule } from "./common";
import { MAT_DATE_FORMATS, MatNativeDateModule } from "@angular/material/core";
import { MatInputModule } from "@angular/material/input";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { DATE_FORMAT_FOR_MAT } from "./core/data";

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatMomentDateModule,
        DialogModule,
        ToastrModule.forRoot(),
        AppCommonModule,
        LayoutModule,
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ResponseInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorResponseInterceptor, multi: true },
        { provide: MAT_DATE_FORMATS, useValue: DATE_FORMAT_FOR_MAT },
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
