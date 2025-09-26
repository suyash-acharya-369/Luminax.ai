import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header with global trigger */}
          <header className="h-16 border-b border-sidebar-border gradient-card flex items-center px-4">
            <SidebarTrigger className="hover:bg-sidebar-accent rounded-md p-2 transition-colors" />
            <div className="ml-4">
              <h1 className="font-semibold">Luminax AI</h1>
              <p className="text-sm text-muted-foreground">Where studying feels like gaming</p>
            </div>
          </header>
          
          {/* Main content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}