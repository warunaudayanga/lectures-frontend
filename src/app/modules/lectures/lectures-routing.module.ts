import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CourseComponent, TimetableComponent } from "./components";
import { UpdateTimetableComponent } from "./components/timetable/update-timetable/update-timetable.component";
import { LecturerComponent } from "./components/lecturer/lecturer.component";
import { CourseModuleComponent } from "./components/course-module/course-module.component";
import { ScheduleComponent } from "./components/schedule/schedule.component";
import { Permission } from "../auth/enum/permission.enum";
import { RoleGuard } from "../auth/guards";

const routes: Routes = [
    { path: "", redirectTo: "timetable" },
    { path: "timetable", component: TimetableComponent, canActivate: [RoleGuard], data: {
        permission: Permission.TIMETABLE_GET,
    } },
    { path: "schedule", component: ScheduleComponent, canActivate: [RoleGuard], data: {
        permission: Permission.SCHEDULE_GET,
    } },
    { path: "timetable/update", component: UpdateTimetableComponent, canActivate: [RoleGuard], data: {
        permission: Permission.TIMETABLE_CREATE,
    } },
    { path: "course", component: CourseComponent, canActivate: [RoleGuard], data: {
        permission: Permission.COURSE_GET,
    } },
    { path: "lecturer", component: LecturerComponent, canActivate: [RoleGuard], data: {
        permission: Permission.LECTURER_GET,
    } },
    { path: "module", component: CourseModuleComponent, canActivate: [RoleGuard], data: {
        permission: Permission.MODULE_GET,
    } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [],
})
export class LecturesRoutingModule { }
