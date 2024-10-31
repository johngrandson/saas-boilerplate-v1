import { AppSidebar } from "@/components/app-sidebar";
import { Breadcrumbs } from "@/components/breadcrumbs";
import PageContainer from "@/components/page-container";
import ThemeSwitcher from "@/components/layout/theme/theme-switcher";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import LocaleSwitcher from "@/components/ui/locale-switcher";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col space-y-2">
          <PageContainer>
            <header className="border-b-2 border-gray-200 flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <div className="separator">|</div>
                <Breadcrumbs />
              </div>
              <div className="flex items-center gap-2 px-4">
                <LocaleSwitcher />
                <div className="separator">|</div>
                <ThemeSwitcher />
              </div>
            </header>
            <div className="ml-4 mt-4 mr-4">{children}</div>
          </PageContainer>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default ProtectedLayout;
