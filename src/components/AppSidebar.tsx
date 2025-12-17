// ...existing code...
import { Link, useLocation } from "react-router-dom";
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
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import type { Route } from "../App";
import { Timer, Clock, Users, Briefcase, BarChart3 } from "lucide-react";

interface AppSidebarProps {
    routes: Route[];
}

export function AppSidebar({ ...props }: AppSidebarProps & React.ComponentProps<typeof Sidebar>) {
    const location = useLocation();

    // Asignar íconos según la ruta
    const iconMap: Record<string, React.ElementType> = {
        Timer: Clock,
        Cliente: Users,
        Proyecto: Briefcase,
        Estadísticas: BarChart3,
    };

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                                    <span className="truncate font-semibold">Cronos</span>
                                    <span className="truncate text-xs text-muted-foreground">Time Tracker</span>
                                </div>
                            </div>
                            <SidebarTrigger className="mx-auto cursor-pointer" />
                        </div>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Menu</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {props.routes.filter(route => !["Mensual", "Semanal", "Diario"].includes(route.label)).map(route => {
                                const Icon = iconMap[route.label] || Timer;
                                const isActive = location.pathname === route.path;
                                if (route.label === "Estadísticas") {
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
                                            <SidebarMenuSub>
                                                {props.routes.filter(r => ["Mensual", "Semanal", "Diario"].includes(r.label)).map(subroute => {
                                                    const isSubActive = location.pathname === subroute.path;
                                                    return (
                                                        <SidebarMenuSubItem key={subroute.path}>
                                                            <SidebarMenuSubButton
                                                                asChild
                                                                isActive={isSubActive}
                                                            >
                                                                <Link to={subroute.path} className="flex items-center gap-2">
                                                                    <span>{subroute.label}</span>
                                                                </Link>
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    );
                                                })}
                                            </SidebarMenuSub>
                                        </SidebarMenuItem>
                                    );
                                }
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

