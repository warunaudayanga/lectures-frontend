import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TimetableComponent, CourseComponent } from "./components";
import { UpdateTimetableComponent } from "./components/timetable/update-timetable/update-timetable.component";
import { LecturerComponent } from "./components/lecturer/lecturer.component";
import { CourseModuleComponent } from "./components/course-module/course-module.component";

const routes: Routes = [
    { path: "", redirectTo: "timetable" },
    { path: "timetable", component: TimetableComponent },
    { path: "timetable/update", component: UpdateTimetableComponent },
    { path: "course", component: CourseComponent },
    { path: "lecturer", component: LecturerComponent },
    { path: "module", component: CourseModuleComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [],
})
export class LecturesRoutingModule { }
