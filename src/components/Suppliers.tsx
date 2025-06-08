
import React from 'react';
import { Users, Phone, Mail, MapPin } from 'lucide-react';
import { GlassCard } from './GlassCard';

export const Suppliers = () => {
  const suppliers = [
    {
      id: 1,
      name: 'AutoMax Distributors',
      contact: 'Mike Johnson',
      phone: '+1 (555) 123-4567',
      email: 'mike@automax.com',
      address: '123 Industrial Blvd, Detroit, MI',
      status: 'Active',
      products: 245
    },
    {
      id: 2,
      name: 'Premium Parts Co.',
      contact: 'Sarah Williams',
      phone: '+1 (555) 987-6543',
      email: 'sarah@premiumparts.com',
      address: '456 Commerce St, Chicago, IL',
      status: 'Active',
      products: 189
    },
    {
      id: 3,
      name: 'Global Auto Supply',
      contact: 'David Chen',
      phone: '+1 (555) 456-7890',
      email: 'david@globalauto.com',
      address: '789 Trade Center, Los Angeles, CA',
      status: 'Pending',
      products: 312
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Supplier Management</h1>
          <p className="text-white/70 mt-1">Manage your supplier relationships</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {suppliers.map((supplier) => (
          <GlassCard key={supplier.id} className="p-6 hover:bg-white/15 transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-teal-600">
                  <Users className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">{supplier.name}</h3>
                  <p className="text-white/70">{supplier.contact}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                supplier.status === 'Active' 
                  ? 'bg-green-500/20 text-green-300' 
                  : 'bg-yellow-500/20 text-yellow-300'
              }`}>
                {supplier.status}
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Phone className="text-white/50" size={16} />
                <span className="text-white">{supplier.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="text-white/50" size={16} />
                <span className="text-white">{supplier.email}</span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="text-white/50 mt-0.5" size={16} />
                <span className="text-white">{supplier.address}</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="flex justify-between items-center">
                <span className="text-white/70 text-sm">Products Supplied</span>
                <span className="text-white font-semibold">{supplier.products}</span>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
