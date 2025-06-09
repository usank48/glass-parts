import React from "react";
import {
  Home,
  Package,
  Users,
  FileText,
  User,
  Calculator,
  X,
} from "lucide-react";

interface SidebarProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeModule,
  setActiveModule,
  isOpen,
  setIsOpen,
}) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "inventory", label: "Inventory", icon: Package },
    { id: "suppliers", label: "Suppliers", icon: Users },
    { id: "invoicing", label: "Invoicing", icon: FileText },
    { id: "staff", label: "Staff", icon: User },
    { id: "accounting", label: "Accounting", icon: Calculator },
  ];

  const handleMenuItemClick = (itemId: string) => {
    setActiveModule(itemId);
    // Auto-close on mobile after selection
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 z-50 h-full bg-white/10 backdrop-blur-md border-r border-white/20
          transition-all duration-300 ease-in-out w-64
          md:relative md:z-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Header with close button */}
        <div className="p-4 border-b border-white/20 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">AutoParts Pro</h1>
            <p className="text-white/70 text-xs mt-1">Inventory & Management</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors md:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuItemClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeModule === item.id
                      ? "bg-white/20 text-white shadow-lg"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* App info */}
        <div className="p-4 border-t border-white/20">
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 text-center">
            <p className="text-white/90 text-sm font-medium">AutoParts Pro</p>
            <p className="text-white/60 text-xs">v1.0.0</p>
          </div>
        </div>
      </div>
    </>
  );
};
