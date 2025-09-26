import { NavLink, useLocation } from "react-router-dom";
import { 
  Home, 
  Users, 
  BookOpen, 
  TrendingUp, 
  Trophy, 
  User, 
  Settings,
  Zap,
  Flame
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Community", url: "/community", icon: Users },
  { title: "Study", url: "/study", icon: BookOpen },
  { title: "Progress", url: "/progress", icon: TrendingUp },
  { title: "Leaderboard", url: "/leaderboard", icon: Trophy },
  { title: "Profile", url: "/profile", icon: User },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(path);
  };

  const getNavClasses = (path: string) => {
    const baseClasses = "transition-all duration-200 hover:bg-sidebar-accent";
    if (isActive(path)) {
      return `${baseClasses} bg-sidebar-primary text-sidebar-primary-foreground glow-primary`;
    }
    return baseClasses;
  };

  const handleNavClick = (path: string) => {
    console.log(`Navigating to: ${path}`);
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="gradient-card border-r border-sidebar-border">
        {/* Logo Section */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center glow-primary">
              <Zap className="w-4 h-4 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="font-bold text-lg">Luminax AI</h2>
                <p className="text-xs text-muted-foreground">Level up your learning</p>
              </div>
            )}
          </div>
        </div>

        {/* User Stats */}
        {!isCollapsed && (
          <div className="p-4 border-b border-sidebar-border">
            <div className="bg-sidebar-accent rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">XP</span>
                <span className="text-sm text-primary font-bold">1,250</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="gradient-primary h-2 rounded-full glow-primary" style={{width: "65%"}}></div>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <span>Level 12</span>
                <div className="flex items-center gap-1">
                  <Flame className="w-3 h-3 text-warning streak-animation" />
                  <span>7 day streak</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className={getNavClasses(item.url)}>
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/"}
                      onClick={() => handleNavClick(item.url)}
                    >
                      <item.icon className="w-4 h-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}