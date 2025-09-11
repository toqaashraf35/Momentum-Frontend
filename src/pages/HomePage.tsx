import { useState, useEffect } from "react";
import Header from "../layouts/Header";
import Sidebar from "../layouts/Sidebar";

export default function HomePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleOpenSidebar = () => {
      setIsSidebarOpen(true);
    };

    window.addEventListener("openSidebar", handleOpenSidebar);

    return () => {
      window.removeEventListener("openSidebar", handleOpenSidebar);
    };
  }, []);

  return (
    <div className="grid grid-cols-[20%_1fr] grid-rows-[7%_1fr] h-screen bg-gray-50">
      <div className="row-start-2">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      </div>

      {/* Main content */}
      <div className="col-span-2">
        <Header />
      </div>
    </div>
  );
}
