import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DataTableComponent } from "./components";
import { NgxPaginationModule } from "ngx-pagination";
import { PaginationModule } from "../pagination";
import { MomentModule } from "ngx-moment";
import { LoaderModule } from "../loader";
import { VirtualScrollerModule } from "ngx-virtual-scroller";
import { MatBadgeModule } from "@angular/material/badge";


@NgModule({
    declarations: [
        DataTableComponent,
    ],
    exports: [
        DataTableComponent,
    ],
    imports: [
        CommonModule,
        NgxPaginationModule,
        PaginationModule,
        MomentModule,
        LoaderModule,
        VirtualScrollerModule,
        MatBadgeModule,
    ],
})
export class DataTableModule { }
