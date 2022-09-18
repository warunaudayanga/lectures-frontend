import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { PageNotFoundComponent } from "./components";
import { CardComponent } from "./components/card/card.component";
import { CardContainerComponent } from "./components/card/container/card-container.component";


@NgModule({
    declarations: [
        CardComponent,
        CardContainerComponent,
        PageNotFoundComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
    ],
    exports: [
        CardComponent,
        CardContainerComponent,
        PageNotFoundComponent,
    ],
})
export class AppCommonModule { }
