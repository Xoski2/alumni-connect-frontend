import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

interface PageContainerProps {
  title: string;
  children: React.ReactNode;
  showLogo?: boolean;
}

const PageContainer = ({ title, children, showLogo = false }: PageContainerProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      {/* On mobile no left margin; on md+ push right of the fixed 256px sidebar */}
      <div className="min-w-0 flex-1 md:ml-64 flex flex-col">
        <Navbar
          title={title}
          showLogo={showLogo}
          isSidebarOpen={mobileMenuOpen}
          onMenuClick={() => setMobileMenuOpen((o) => !o)}
        />
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 mt-14">{children}</main>
      </div>
    </div>
  );
};

export default PageContainer;
