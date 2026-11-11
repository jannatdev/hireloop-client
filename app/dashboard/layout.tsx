import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DashboardSidebar } from "../component/dashboard/dashboardSidebar";

/**
 * The root layout renders the floating navbar above every route, so the sidebar
 * is offset below it (see NAVBAR_OFFSET in dashboardSidebar) and the shell is
 * shortened by the same amount to keep the page free of a phantom scrollbar.
 */
const SHELL_MIN_HEIGHT =
    "min-h-[calc(100svh-68px)]! sm:min-h-[calc(100svh-84px)]! lg:min-h-[calc(100svh-104px)]!";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <TooltipProvider>
            <SidebarProvider className={SHELL_MIN_HEIGHT}>
                <DashboardSidebar />

                <SidebarInset>
                    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
                        <SidebarTrigger />
                    </header>
                    <div className="flex-1 p-4 md:p-6">{children}</div>
                </SidebarInset>
            </SidebarProvider>
        </TooltipProvider>
    );
};

export default DashboardLayout;
