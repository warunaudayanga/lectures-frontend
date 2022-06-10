import { MenuItem } from "../interfaces";
import { Permission } from "../../modules/auth/enum/permission.enum";

export const menuItems: MenuItem[] = [
    { id: "timetable", name: "Timetable", path: "/timetable", icon: "icofont icofont-table", permission: Permission.TIMETABLE_VIEW },
    { id: "schedule", name: "Schedule", path: "/schedule", icon: "icofont icofont-ui-calendar", permission: Permission.SCHEDULE_VIEW },
    { id: "slot", name: "Slots", path: "/slot", icon: "icofont icofont-ui-clock", permission: Permission.SLOT_VIEW },
    { id: "user", name: "Users", icon: "icofont icofont-user", children: [
        { id: "manageUser", for: "user", name: "Manage Users", path: "/user/manage", icon: "icofont icofont-user", permission: Permission.USER_VIEW },
        { id: "manageRole", for: "user", name: "Manage Roles", path: "/user/roles", icon: "icofont icofont-ui-fire-wall", permission: Permission.ROLE_VIEW },
    ] },
    { id: "course", name: "Courses", path: "/course", icon: "icofont icofont-graduate", permission: Permission.COURSE_VIEW },
    { id: "module", name: "Modules", path: "/module", icon: "icofont icofont-book-alt", permission: Permission.MODULE_VIEW },
    { id: "lecturer", name: "Lecturers", path: "/lecturer", icon: "icofont icofont-man-in-glasses", permission: Permission.MODULE_VIEW },
];
