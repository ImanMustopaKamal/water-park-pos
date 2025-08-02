import { usePathname } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";

const SidebarContext = createContext({
  collapsed: false,
  toggle: () => {},
});

export const SidebarProvider = ({ children }: any) => {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Sidebar akan tertutup otomatis saat di halaman /transaksi
    const shouldCollapse = pathname.startsWith("/transaction");
    setCollapsed(shouldCollapse ? true : collapsed);
  }, [pathname]);

  const toggle = () => setCollapsed((prev) => !prev);

  return (
    <SidebarContext.Provider value={{ collapsed, toggle }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => useContext(SidebarContext);
