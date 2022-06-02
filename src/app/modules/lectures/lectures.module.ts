import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LecturesRoutingModule } from "./lectures-routing.module";
import { TimetableComponent, CourseComponent } from "./components";
import { DataTableModule } from "../../core/modules/data-table/data-table.module";
import { TableComponent } from "./components/timetable/table/table.component";
import { MatTableModule } from "@angular/material/table";
import { UpdateTimetableComponent } from "./components/timetable/update-timetable/update-timetable.component";
import { NgSelectModule } from "@ng-select/ng-select";
import { FormsModule } from "@angular/forms";
import { LecturerComponent } from "./components/lecturer/lecturer.component";
import { CourseModuleComponent } from "./components/course-module/course-module.component";


@NgModule({
    declarations: [
        TimetableComponent,
        TableComponent,
        UpdateTimetableComponent,
        CourseComponent,
        LecturerComponent,
        CourseModuleComponent,
    ],
    imports: [
        CommonModule,
        LecturesRoutingModule,
        DataTableModule,
        MatTableModule,
        NgSelectModule,
        FormsModule,
    ],
})
export class LecturesModule { }
