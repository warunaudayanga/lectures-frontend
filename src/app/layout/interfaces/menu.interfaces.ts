export interface MenuItem {
    id?: string
    for?: string
    name: string;
    path?: string;
    icon: string;
    active?: boolean
    children?: MenuItem[];
    opened?: boolean;
}
