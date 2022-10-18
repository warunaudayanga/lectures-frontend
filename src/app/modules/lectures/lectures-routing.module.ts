import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CourseComponent, TimetableComponent } from "./components";
import { UpdateTimetableComponent } from "./components/timetable/update-timetable/update-timetable.component";
import { LecturerComponent } from "./components/lecturer/lecturer.component";
import { CourseModuleComponent } from "./components/course-module/course-module.component";
import { ScheduleComponent } from "./components/schedule/schedule.component";
import { Permission } from "../auth/enum/permission.enum";
import { RoleGuard } from "../auth/guards";
import { SlotComponent } from "./components/slot/slot.component";
import { PollComponent } from "./components/poll/poll.component";
import { VotesComponent } from "./components/poll/votes/votes.component";

const routes: Routes = [
    { path: "", redirectTo: "schedule" },
    { path: "schedule", component: ScheduleComponent, canActivate: [RoleGuard], data: {
        permission: Permission.SCHEDULE_LIST,
    } },
    { path: "timetable", component: TimetableComponent, canActivate: [RoleGuard], data: {
        permission: Permission.TIMETABLE_LIST,
    } },
    { path: "timetable/update", component: UpdateTimetableComponent, canActivate: [RoleGuard], data: {
        permission: Permission.TIMETABLE_CREATE,
    } },
    { path: "course", component: CourseComponent, canActivate: [RoleGuard], data: {
        permission: Permission.COURSE_LIST,
    } },
    { path: "slot", component: SlotComponent, canActivate: [RoleGuard], data: {
        permission: Permission.SLOT_LIST,
    } },
    { path: "lecturer", component: LecturerComponent, canActivate: [RoleGuard], data: {
        permission: Permission.LECTURER_LIST,
    } },
    { path: "module", component: CourseModuleComponent, canActivate: [RoleGuard], data: {
        permission: Permission.MODULE_LIST,
    } },
    { path: "poll", component: PollComponent, canActivate: [RoleGuard], data: {
        permission: Permission.POLL_LIST,
    } },
    { path: "poll/:code", component: VotesComponent, canActivate: [RoleGuard], data: {
        permission: Permission.POLL_LIST,
    } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [],
})
export class LecturesRoutingModule { }
