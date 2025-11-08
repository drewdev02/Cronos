// ...existing code...
import { Link } from "react-router-dom";
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarTrigger,
    SidebarRail,
} from "@/components/ui/sidebar";
import type { Route } from "../App";
import { Timer, Clock, Users, Briefcase } from "lucide-react";

interface AppSidebarProps {
    routes: Route[];
}

export function AppSidebar({ ...props }: AppSidebarProps & React.ComponentProps<typeof Sidebar>) {
    // Asignar íconos según la ruta
    const iconMap: Record<string, React.ElementType> = {
        Timer: Clock,
        Customer: Users,
        Project: Briefcase,
    };

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <div className="flex items-center justify-between gap-2 px-2">
                            <div className="flex items-center gap-2">
                                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                                    <span className="truncate font-semibold">Cronos</span>
                                    <span className="truncate text-xs text-muted-foreground">Time Tracker</span>
                                </div>
                            </div>
                            <SidebarTrigger className="ml-auto" />
                        </div>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Menú</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {props.routes.map(route => {
                                const Icon = iconMap[route.label] || Timer;
                                const isActive = window.location.hash.replace('#', '') === route.path;
                                return (
                                    <SidebarMenuItem key={route.path}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            tooltip={route.label}
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
            <SidebarRail />
        </Sidebar>
    );
}

