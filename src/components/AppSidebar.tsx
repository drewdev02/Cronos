// ...existing code...
import { Link } from "react-router-dom";
import {
    Sidebar,
    SidebarContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
} from "@/components/ui/sidebar";
import type { Route } from "../App";


import { Timer, Clock, Users } from "lucide-react";


interface AppSidebarProps {
    routes: Route[];
}

export function AppSidebar({ routes }: AppSidebarProps) {

    // Asignar íconos según la ruta
    const iconMap: Record<string, React.ElementType> = {
        Timer: Clock,
        Customer: Users,
    };

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Menú</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {routes.map(route => {
                                const Icon = iconMap[route.label] || Timer;
                                return (
                                    <SidebarMenuItem key={route.path}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={window.location.hash.replace('#', '') === route.path}
                                        >
                                            <Link to={route.path} className="flex items-center gap-2">
                                                <Icon />
                                                <span>{route.label}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
