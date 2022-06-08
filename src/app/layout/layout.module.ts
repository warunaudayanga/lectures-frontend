import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeaderComponent, ContentComponent, SidenavComponent } from "./components";
import { RouterModule } from "@angular/router";
import { NavMenuComponent } from "./components/header/nav-menu/nav-menu.component";
import { MatMenuModule } from "@angular/material/menu";


@NgModule({
    declarations: [
        HeaderComponent,
        ContentComponent,
        SidenavComponent,
        NavMenuComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        MatMenuModule,
    ],
    exports: [
        HeaderComponent,
        ContentComponent,
        SidenavComponent,
    ],
})
export class LayoutModule { }
