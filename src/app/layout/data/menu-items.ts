import { MenuItem } from "../interfaces";
import { Permission } from "../../modules/auth/enum/permission.enum";

export const menuItems: MenuItem[] = [
    { id: "schedule", name: "Schedule", path: "/schedule", icon: "icofont icofont-ui-calendar", permission: Permission.SCHEDULE_LIST },
    { id: "timetable", name: "Timetable", path: "/timetable", icon: "icofont icofont-table", permission: Permission.TIMETABLE_LIST },
    { id: "kuppi", name: "Kuppi", href: "https://www.youtube.com/channel/UCW41AzA18XKzwgGOplTYFTA/playlists",
        icon: "icofont icofont-salt-and-pepper" }, // TODO;
    { id: "slot", name: "Slots", path: "/slot", icon: "icofont icofont-ui-clock", permission: Permission.SLOT_LIST },
    { id: "user", name: "Users", icon: "icofont icofont-user", children: [
        { id: "manageUser", for: "user", name: "Manage Users", path: "/user/manage", icon: "icofont icofont-user", permission: Permission.USER_LIST },
        { id: "manageRole", for: "user", name: "Manage Roles", path: "/user/roles", icon: "icofont icofont-ui-fire-wall", permission: Permission.ROLE_LIST },
    ] },
    { id: "course", name: "Courses", path: "/course", icon: "icofont icofont-graduate", permission: Permission.COURSE_LIST },
    { id: "module", name: "Modules", path: "/module", icon: "icofont icofont-book-alt", permission: Permission.MODULE_LIST },
    { id: "lecturer", name: "Lecturers", path: "/lecturer", icon: "icofont icofont-man-in-glasses", permission: Permission.MODULE_LIST },
];
