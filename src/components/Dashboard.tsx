import React, { useState } from "react";
import {
  Package,
  Users,
  FileText,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Plus,
} from "lucide-react";
import { GlassCard } from "./GlassCard";
import { AddProductDialog } from "./dialogs/AddProductDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface DashboardProps {
  onNavigateToModule?: (module: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigateToModule }) => {
  const [showAddProductDialog, setShowAddProductDialog] = useState(false);

  const stats = [
    {
      title: "Total Products",
      value: "2,847",
      icon: Package,
      color: "from-blue-500 to-purple-600",
    },
    {
      title: "Low Stock Items",
      value: "23",
      icon: AlertTriangle,
      color: "from-red-500 to-orange-600",
    },
    {
      title: "Total Suppliers",
      value: "142",
      icon: Users,
      color: "from-green-500 to-teal-600",
    },
    {
      title: "Monthly Revenue",
      value: "₹45,230",
      icon: DollarSign,
      color: "from-purple-500 to-pink-600",
    },
  ];

  const recentActivities = [
    {
      action: "New product added",
      item: "Brake Pad Set - BMW X5",
      time: "2 minutes ago",
    },
    {
      action: "Stock updated",
      item: "Oil Filter - Toyota Camry",
      time: "15 minutes ago",
    },
    {
      action: "Invoice created",
      item: "Invoice #INV-2024-0156",
      time: "1 hour ago",
    },
    {
      action: "Low stock alert",
      item: "Spark Plugs - Honda Civic",
      time: "2 hours ago",
    },
  ];

  const handleAddProduct = () => {
    setShowAddProductDialog(true);
  };

  const handleCreateInvoice = () => {
    if (onNavigateToModule) {
      onNavigateToModule("invoicing");
      toast.success('Navigated to Invoicing - Click "New Invoice" to create!');
    }
  };

  const handleViewReports = () => {
    if (onNavigateToModule) {
      onNavigateToModule("accounting");
      toast.success("Navigated to Accounting & Reports!");
    }
  };

  const handleManageStaff = () => {
    if (onNavigateToModule) {
      onNavigateToModule("staff");
      toast.success("Navigated to Staff Management!");
    }
  };

  const quickActions = [
    {
      label: "Add Product",
      icon: Package,
      color: "from-blue-500 to-purple-600",
      onClick: handleAddProduct,
      description: "Add new product to inventory",
    },
    {
      label: "Create Invoice",
      icon: FileText,
      color: "from-green-500 to-teal-600",
      onClick: handleCreateInvoice,
      description: "Generate a new customer invoice",
    },
    {
      label: "View Reports",
      icon: TrendingUp,
      color: "from-purple-500 to-pink-600",
      onClick: handleViewReports,
      description: "Access business analytics",
    },
    {
      label: "Manage Staff",
      icon: Users,
      color: "from-orange-500 to-red-600",
      onClick: handleManageStaff,
      description: "Manage team and attendance",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Good Morning, John!</h1>
          <p className="text-white/70 mt-1">
            Here's what's happening with your business today.
          </p>
        </div>
        <div className="text-white/60 text-sm">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <GlassCard
              key={index}
              className="p-6 hover:bg-white/15 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm font-medium">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {stat.value}
                  </p>
                  {stat.title === "Low Stock Items" && (
                    <button
                      onClick={() =>
                        onNavigateToModule && onNavigateToModule("inventory")
                      }
                      className="text-red-300 text-xs mt-1 hover:text-red-200 transition-colors"
                    >
                      View Details →
                    </button>
                  )}
                </div>
                <div
                  className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}
                >
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">
              Recent Activities
            </h2>
            <button
              onClick={() =>
                onNavigateToModule && onNavigateToModule("accounting")
              }
              className="text-white/60 hover:text-white text-sm transition-colors"
            >
              View All →
            </button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 cursor-pointer"
              >
                <div className="w-2 h-2 rounded-full bg-blue-400 mt-2"></div>
                <div className="flex-1">
                  <p className="text-white font-medium">{activity.action}</p>
                  <p className="text-white/70 text-sm">{activity.item}</p>
                  <p className="text-white/50 text-xs mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Quick Actions */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Quick Actions</h2>
            <div className="flex items-center gap-2 text-white/60">
              <Plus size={16} />
              <span className="text-sm">Get things done faster</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={`group p-4 rounded-lg bg-gradient-to-r ${action.color} text-white font-medium transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-lg relative overflow-hidden`}
                  title={action.description}
                >
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>

                  {/* Content */}
                  <div className="relative">
                    <Icon className="mx-auto mb-2" size={24} />
                    <span className="text-sm block">{action.label}</span>
                  </div>

                  {/* Ripple effect */}
                  <div className="absolute inset-0 rounded-lg opacity-0 group-active:opacity-25 bg-white transition-opacity duration-150"></div>
                </button>
              );
            })}
          </div>

          {/* Additional Actions */}
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() =>
                  onNavigateToModule && onNavigateToModule("sales")
                }
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs transition-all duration-200"
              >
                Quick Sale
              </button>
              <button
                onClick={() =>
                  onNavigateToModule && onNavigateToModule("purchase")
                }
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs transition-all duration-200"
              >
                Purchase Order
              </button>
              <button
                onClick={() =>
                  onNavigateToModule && onNavigateToModule("suppliers")
                }
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs transition-all duration-200"
              >
                Suppliers
              </button>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">This Week</h3>
            <TrendingUp className="text-green-400" size={20} />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-white/70">Sales</span>
              <span className="text-white font-medium">₹12,450</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Orders</span>
              <span className="text-white font-medium">147</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Growth</span>
              <span className="text-green-400 font-medium">+15%</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Top Products</h3>
            <Package className="text-blue-400" size={20} />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-white/70">Brake Pads</span>
              <span className="text-white font-medium">45 sold</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Oil Filters</span>
              <span className="text-white font-medium">38 sold</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Spark Plugs</span>
              <span className="text-white font-medium">32 sold</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Alerts</h3>
            <AlertTriangle className="text-red-400" size={20} />
          </div>
          <div className="space-y-3">
            <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-red-300 text-sm">23 items low stock</p>
            </div>
            <div className="p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <p className="text-yellow-300 text-sm">5 pending invoices</p>
            </div>
            <button
              onClick={() =>
                onNavigateToModule && onNavigateToModule("inventory")
              }
              className="w-full text-left p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-colors"
            >
              <p className="text-blue-300 text-sm">Check inventory →</p>
            </button>
          </div>
        </GlassCard>
      </div>

      {/* Add Product Dialog */}
      <Dialog
        open={showAddProductDialog}
        onOpenChange={setShowAddProductDialog}
      >
        <DialogContent className="bg-white/10 backdrop-blur-md border border-white/20 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">Add New Product</DialogTitle>
          </DialogHeader>
          <AddProductDialog onClose={() => setShowAddProductDialog(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};
