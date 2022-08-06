import { Permission } from "../../modules/auth/enum/permission.enum";

export interface MenuItem {
    id?: string
    for?: string
    name: string;
    path?: string;
    href?: string;
    icon: string;
    active?: boolean
    permission?: Permission;
    children?: MenuItem[];
    opened?: boolean;
}
