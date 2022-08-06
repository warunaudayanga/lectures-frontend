import { Permission } from "../../modules/auth/enum/permission.enum";
import { ClickType } from "../../core/enums";

export interface MenuItem {
    id?: string
    for?: string
    name: string;
    path?: string;
    href?: string;
    clickType?: ClickType;
    icon: string;
    active?: boolean
    permission?: Permission;
    children?: MenuItem[];
    opened?: boolean;
}
