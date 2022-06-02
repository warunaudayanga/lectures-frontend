import { MenuItem } from "../interfaces";

export const menuItems: MenuItem[] = [
    { id: "timetable", name: "Timetable", path: "/timetable", icon: "icofont icofont-table" },
    { id: "user", name: "User", icon: "icofont icofont-user", children: [
        { id: "manageUser", for: "user", name: "Manage Users", path: "/user/manage", icon: "icofont icofont-user" },
        { id: "manageRole", for: "user", name: "Manage Roles", path: "/user/roles", icon: "icofont icofont-ui-fire-wall" },
    ] },
    { id: "course", name: "Courses", path: "/course", icon: "icofont icofont-graduate" },
    { id: "module", name: "Modules", path: "/module", icon: "icofont icofont-book-alt" },
    { id: "lecturer", name: "Lecturers", path: "/lecturer", icon: "icofont icofont-man-in-glasses" },
];
