import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Menu,
  User,
  Bell,
  ChevronDown,
  Settings,
  Edit,
  Shield,
} from "lucide-react";
import { UserProfileDialog } from "./dialogs/UserProfileDialog";
import { UserSettingsDialog } from "./dialogs/UserSettingsDialog";
import { ChangePasswordDialog } from "./dialogs/ChangePasswordDialog";

interface TopBarProps {
  onMenuClick: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onMenuClick }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3); // Example notification count

  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-white/10 backdrop-blur-md border-b border-white/20">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-lg font-bold text-white hidden sm:block">
            AutoParts Pro
          </h1>
        </div>

        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60"
              size={18}
            />
            <input
              type="text"
              placeholder="Search products, suppliers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg text-white hover:bg-white/10 transition-colors">
            <Bell size={20} />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-white transition-all duration-200 ${
                isUserDropdownOpen
                  ? "bg-white/20 ring-2 ring-white/30"
                  : "hover:bg-white/10"
              }`}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <span className="hidden md:block text-sm font-medium">
                John Doe
              </span>
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${isUserDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown Menu */}
            {isUserDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-lg overflow-hidden">
                <TopBarUserDropdown
                  onClose={() => setIsUserDropdownOpen(false)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Simplified TopBar version of UserDropdown
const TopBarUserDropdown: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      console.log("Logging out...");
      alert("Logout functionality - ready to integrate with your auth system!");
    }
    onClose();
  };

  const handleAction = (action: string) => {
    alert(`${action} - ready to implement!`);
    onClose();
  };

  const menuItems = [
    { icon: User, label: "View Profile", action: "View Profile" },
    { icon: User, label: "Edit Profile", action: "Edit Profile" },
    { icon: User, label: "Settings", action: "Settings" },
    { icon: User, label: "Change Password", action: "Change Password" },
    { icon: Bell, label: "Notifications", action: "Notifications" },
  ];

  return (
    <div ref={dropdownRef}>
      {/* User Info Header */}
      <div className="p-4 border-b border-white/10 bg-white/5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
            <User size={20} className="text-white" />
          </div>
          <div>
            <p className="text-white font-medium">John Doe</p>
            <p className="text-white/70 text-sm">john.doe@autoparts.com</p>
            <p className="text-white/60 text-xs">Administrator • Active</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="py-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={() => handleAction(item.action)}
              className="w-full px-4 py-3 flex items-center gap-3 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              <Icon size={16} className="flex-shrink-0" />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          );
        })}

        {/* Logout Button */}
        <div className="border-t border-white/10 mt-2 pt-2">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 flex items-center gap-3 text-red-300 hover:text-red-200 hover:bg-red-500/20 transition-all duration-200"
          >
            <User size={16} className="flex-shrink-0" />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-white/10 bg-white/5">
        <p className="text-white/50 text-xs text-center">
          AutoParts Pro v1.0.0
        </p>
      </div>
    </div>
  );
};
