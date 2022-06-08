import { MenuItem } from "../interfaces";
import { Permission } from "../../modules/auth/enum/permission.enum";

export const menuItems: MenuItem[] = [
    { id: "timetable", name: "Timetable", path: "/timetable", icon: "icofont icofont-table", permission: Permission.TIMETABLE_GET },
    { id: "schedule", name: "Schedule", path: "/schedule", icon: "icofont icofont-clock-time", permission: Permission.SCHEDULE_GET },
    { id: "user", name: "User", icon: "icofont icofont-user", children: [
        { id: "manageUser", for: "user", name: "Manage Users", path: "/user/manage", icon: "icofont icofont-user", permission: Permission.USER_GET },
        { id: "manageRole", for: "user", name: "Manage Roles", path: "/user/roles", icon: "icofont icofont-ui-fire-wall", permission: Permission.ROLE_GET },
    ] },
    { id: "course", name: "Courses", path: "/course", icon: "icofont icofont-graduate", permission: Permission.COURSE_GET },
    { id: "module", name: "Modules", path: "/module", icon: "icofont icofont-book-alt", permission: Permission.MODULE_GET },
    { id: "lecturer", name: "Lecturers", path: "/lecturer", icon: "icofont icofont-man-in-glasses", permission: Permission.MODULE_GET },
];
