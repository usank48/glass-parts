
import React from 'react';
import { Package, Users, FileText, TrendingUp, AlertTriangle, DollarSign } from 'lucide-react';
import { GlassCard } from './GlassCard';

export const Dashboard = () => {
  const stats = [
    { title: 'Total Products', value: '2,847', icon: Package, color: 'from-blue-500 to-purple-600' },
    { title: 'Low Stock Items', value: '23', icon: AlertTriangle, color: 'from-red-500 to-orange-600' },
    { title: 'Total Suppliers', value: '142', icon: Users, color: 'from-green-500 to-teal-600' },
    { title: 'Monthly Revenue', value: '₹45,230', icon: DollarSign, color: 'from-purple-500 to-pink-600' },
  ];

  const recentActivities = [
    { action: 'New product added', item: 'Brake Pad Set - BMW X5', time: '2 minutes ago' },
    { action: 'Stock updated', item: 'Oil Filter - Toyota Camry', time: '15 minutes ago' },
    { action: 'Invoice created', item: 'Invoice #INV-2024-0156', time: '1 hour ago' },
    { action: 'Low stock alert', item: 'Spark Plugs - Honda Civic', time: '2 hours ago' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Good Morning, John!</h1>
          <p className="text-white/70 mt-1">Here's what's happening with your business today.</p>
        </div>
        <div className="text-white/60 text-sm">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
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
                  <p className="text-white/70 text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
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
          <h2 className="text-xl font-semibold text-white mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
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
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Add Product', icon: Package, color: 'from-blue-500 to-purple-600' },
              { label: 'Create Invoice', icon: FileText, color: 'from-green-500 to-teal-600' },
              { label: 'View Reports', icon: TrendingUp, color: 'from-purple-500 to-pink-600' },
              { label: 'Manage Staff', icon: Users, color: 'from-orange-500 to-red-600' },
            ].map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  className={`p-4 rounded-lg bg-gradient-to-r ${action.color} text-white font-medium transition-transform hover:scale-105 active:scale-95`}
                >
                  <Icon className="mx-auto mb-2" size={24} />
                  <span className="text-sm">{action.label}</span>
                </button>
              );
            })}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
