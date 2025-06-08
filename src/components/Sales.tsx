import React from "react";
import { ShoppingCart, TrendingUp, IndianRupee, Users } from "lucide-react";
import { GlassCard } from "./GlassCard";

export const Sales = () => {
  const salesData = [
    {
      id: 1,
      customerName: "John Smith",
      items: "Brake Pads, Oil Filter",
      total: 1255.5,
      date: "2024-01-15",
      status: "Completed",
    },
    {
      id: 2,
      customerName: "Sarah Johnson",
      items: "Engine Oil, Air Filter",
      total: 899.99,
      date: "2024-01-15",
      status: "Pending",
    },
    {
      id: 3,
      customerName: "Mike Wilson",
      items: "Spark Plugs, Battery",
      total: 2450.0,
      date: "2024-01-14",
      status: "Completed",
    },
  ];

  const stats = [
    {
      title: "Today's Sales",
      value: "₹12,340",
      icon: IndianRupee,
      change: "+12%",
    },
    { title: "Total Orders", value: "24", icon: ShoppingCart, change: "+8%" },
    { title: "Customers", value: "18", icon: Users, change: "+5%" },
    { title: "Revenue", value: "₹34,560", icon: TrendingUp, change: "+15%" },
  ];

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Sales Management</h1>
          <p className="text-white/70 mt-1">Track and manage your sales</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <GlassCard key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">{stat.title}</p>
                  <p className="text-white text-2xl font-bold">{stat.value}</p>
                  <p className="text-green-400 text-sm">{stat.change}</p>
                </div>
                <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Recent Sales */}
      <GlassCard className="p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Recent Sales</h2>
        <div className="space-y-4">
          {salesData.map((sale) => (
            <div
              key={sale.id}
              className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
            >
              <div>
                <h3 className="text-white font-medium">{sale.customerName}</h3>
                <p className="text-white/70 text-sm">{sale.items}</p>
                <p className="text-white/50 text-xs">{sale.date}</p>
              </div>
              <div className="text-right">
                <p className="text-white font-semibold">₹{sale.total}</p>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    sale.status === "Completed"
                      ? "bg-green-500/20 text-green-300"
                      : "bg-yellow-500/20 text-yellow-300"
                  }`}
                >
                  {sale.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};
