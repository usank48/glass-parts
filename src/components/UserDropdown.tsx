import React, { useState, useRef, useEffect } from "react";
import {
  User,
  Settings,
  LogOut,
  ChevronUp,
  ChevronDown,
  Edit,
  Shield,
  Bell,
} from "lucide-react";

interface UserDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export const UserDropdown: React.FC<UserDropdownProps> = ({
  isOpen,
  onToggle,
  onClose,
}) => {
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

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleLogout = () => {
    // Add logout logic here - could integrate with auth system
    if (window.confirm("Are you sure you want to logout?")) {
      console.log("Logging out...");
      // Example: redirect to login page
      // window.location.href = '/login';
      alert("Logout functionality - ready to integrate with your auth system!");
    }
    onClose();
  };

  const handleViewProfile = () => {
    alert("Profile view - ready to implement user profile page!");
    onClose();
  };

  const handleSettings = () => {
    alert("Settings - ready to implement user settings!");
    onClose();
  };

  const handleEditProfile = () => {
    alert("Edit Profile - ready to implement profile editing!");
    onClose();
  };

  const handleChangePassword = () => {
    alert("Change Password - ready to implement password change!");
    onClose();
  };

  const handleNotifications = () => {
    alert("Notifications - ready to implement notification settings!");
    onClose();
  };

  const menuItems = [
    {
      icon: User,
      label: "View Profile",
      onClick: handleViewProfile,
      description: "See your profile information",
    },
    {
      icon: Edit,
      label: "Edit Profile",
      onClick: handleEditProfile,
      description: "Update your personal details",
    },
    {
      icon: Shield,
      label: "Change Password",
      onClick: handleChangePassword,
      description: "Update your password",
    },
    {
      icon: Bell,
      label: "Notifications",
      onClick: handleNotifications,
      description: "Manage notification preferences",
    },
    {
      icon: Settings,
      label: "Settings",
      onClick: handleSettings,
      description: "Application preferences",
    },
    {
      icon: LogOut,
      label: "Logout",
      onClick: handleLogout,
      description: "Sign out of your account",
      variant: "danger" as const,
    },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Info Button */}
      <button
        onClick={onToggle}
        className={`w-full bg-white/10 backdrop-blur-sm rounded-lg p-3 transition-all duration-200 hover:bg-white/20 group ${
          isOpen ? "bg-white/20 ring-2 ring-white/30" : ""
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* User Avatar */}
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <User size={18} className="text-white" />
            </div>
            <div className="text-left">
              <p className="text-white/90 text-sm font-medium">John Doe</p>
              <p className="text-white/60 text-xs">Administrator</p>
            </div>
          </div>
          <div className="text-white/60 group-hover:text-white/80 transition-colors">
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-lg overflow-hidden">
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
                  onClick={item.onClick}
                  className={`w-full px-4 py-3 flex items-center gap-3 transition-all duration-200 group ${
                    item.variant === "danger"
                      ? "hover:bg-red-500/20 text-red-300 hover:text-red-200"
                      : "hover:bg-white/10 text-white/80 hover:text-white"
                  }`}
                >
                  <Icon size={16} className="flex-shrink-0" />
                  <div className="flex-1 text-left">
                    <div className="font-medium text-sm">{item.label}</div>
                    <div
                      className={`text-xs ${
                        item.variant === "danger"
                          ? "text-red-400/70"
                          : "text-white/50"
                      }`}
                    >
                      {item.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-white/10 bg-white/5">
            <p className="text-white/50 text-xs text-center">
              AutoParts Pro v1.0.0
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
