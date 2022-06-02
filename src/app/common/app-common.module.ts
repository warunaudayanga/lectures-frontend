import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { PageNotFoundComponent } from "./components";


@NgModule({
    declarations: [
        PageNotFoundComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
    ],
    exports: [
        PageNotFoundComponent,
    ],
})
export class AppCommonModule { }
