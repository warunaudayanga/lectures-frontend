import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { LayoutModule } from "./layout";
import { DialogModule } from "./core/modules/dialog";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { AuthInterceptor } from "./modules/auth/interceptors";
import { ResponseInterceptor } from "./core/interceptors";
import { HomeComponent } from "./modules/lectures/components";
import { ToastrModule } from "ngx-toastr";
import { AppCommonModule } from "./common";

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
        DialogModule,
        ToastrModule.forRoot(),
        AppCommonModule,
        LayoutModule,
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ResponseInterceptor, multi: true },
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
