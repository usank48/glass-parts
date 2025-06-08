
import React from 'react';
import { ShoppingBag, TrendingDown, Package, Truck } from 'lucide-react';
import { GlassCard } from './GlassCard';

export const Purchase = () => {
  const purchaseOrders = [
    {
      id: 'PO-001',
      supplier: 'AutoMax Distributors',
      items: 'Brake Pads (50), Oil Filters (30)',
      total: 24500.00,
      date: '2024-01-15',
      status: 'Delivered',
      expectedDate: '2024-01-18'
    },
    {
      id: 'PO-002',
      supplier: 'Premium Parts Co.',
      items: 'Engine Oil (24), Air Filters (40)',
      total: 18509.99,
      date: '2024-01-14',
      status: 'In Transit',
      expectedDate: '2024-01-20'
    },
    {
      id: 'PO-003',
      supplier: 'Global Auto Supply',
      items: 'Spark Plugs (100), Batteries (15)',
      total: 32000.00,
      date: '2024-01-13',
      status: 'Pending',
      expectedDate: '2024-01-22'
    },
  ];

  const stats = [
    { title: 'Total Purchases', value: '₹1,24,500', icon: ShoppingBag, change: '-5%' },
    { title: 'Pending Orders', value: '8', icon: Package, change: '+3%' },
    { title: 'In Transit', value: '5', icon: Truck, change: '+2%' },
    { title: 'This Month', value: '₹4,52,300', icon: TrendingDown, change: '+18%' },
  ];

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Purchase Management</h1>
          <p className="text-white/70 mt-1">Manage purchase orders and suppliers</p>
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
                  <p className={`text-sm ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                    {stat.change}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-gradient-to-r from-orange-500 to-red-600">
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Purchase Orders */}
      <GlassCard className="p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Recent Purchase Orders</h2>
        <div className="space-y-4">
          {purchaseOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
              <div>
                <h3 className="text-white font-medium">{order.id} - {order.supplier}</h3>
                <p className="text-white/70 text-sm">{order.items}</p>
                <p className="text-white/50 text-xs">Ordered: {order.date} | Expected: {order.expectedDate}</p>
              </div>
              <div className="text-right">
                <p className="text-white font-semibold">₹{order.total.toFixed(2)}</p>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  order.status === 'Delivered' 
                    ? 'bg-green-500/20 text-green-300' 
                    : order.status === 'In Transit'
                    ? 'bg-blue-500/20 text-blue-300'
                    : 'bg-yellow-500/20 text-yellow-300'
                }`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};
