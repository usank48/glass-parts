import React from "react";
import { Home, Package, ShoppingCart, ShoppingBag, User } from "lucide-react";

interface BottomBarProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
}

export const BottomBar: React.FC<BottomBarProps> = ({
  activeModule,
  setActiveModule,
}) => {
  const bottomMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "inventory", label: "Inventory", icon: Package },
    { id: "sales", label: "Sales", icon: ShoppingCart },
    { id: "purchase", label: "Purchase", icon: ShoppingBag },
    { id: "staff", label: "Account", icon: User },
  ];

  const handleAccountClick = () => {
    // Navigate to staff/account section
    setActiveModule("staff");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/10 backdrop-blur-md border-t border-white/20">
      <div className="flex items-center justify-around py-3 px-2">
        {bottomMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === "staff") {
                  handleAccountClick();
                } else {
                  setActiveModule(item.id);
                }
              }}
              className={`flex flex-col items-center gap-1 px-3 py-2 min-w-[60px] transition-all duration-200 ${
                isActive ? "text-white" : "text-white/60 hover:text-white/80"
              }`}
            >
              <div
                className={`p-2 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-white/20 backdrop-blur-sm"
                    : "hover:bg-white/10"
                }`}
              >
                <Icon size={20} />
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
