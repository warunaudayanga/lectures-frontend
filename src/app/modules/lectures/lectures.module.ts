import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LecturesRoutingModule } from "./lectures-routing.module";
import { TimetableComponent, CourseComponent } from "./components";
import { DataTableModule } from "../../core/modules/data-table/data-table.module";
import { MatTableModule } from "@angular/material/table";
import { UpdateTimetableComponent } from "./components/timetable/update-timetable/update-timetable.component";
import { NgSelectModule } from "@ng-select/ng-select";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LecturerComponent } from "./components/lecturer/lecturer.component";
import { CourseModuleComponent } from "./components/course-module/course-module.component";
import { ScheduleComponent } from "./components/schedule/schedule.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatInputModule } from "@angular/material/input";
import { SlotComponent } from "./components/slot/slot.component";
import { PollComponent } from "./components/poll/poll.component";
import { AppCommonModule } from "../../common";
import { PollCardComponent } from "./components/poll/poll-card/poll-card.component";
import { FormValidationModule } from "../../core/modules/form-validation";


@NgModule({
    declarations: [
        TimetableComponent,
        UpdateTimetableComponent,
        CourseComponent,
        LecturerComponent,
        CourseModuleComponent,
        ScheduleComponent,
        SlotComponent,
        PollComponent,
        PollCardComponent,
    ],
    imports: [
        CommonModule,
        LecturesRoutingModule,
        DataTableModule,
        MatTableModule,
        NgSelectModule,
        FormsModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatInputModule,
        ReactiveFormsModule,
        AppCommonModule,
        FormValidationModule,
    ],
})
export class LecturesModule { }
