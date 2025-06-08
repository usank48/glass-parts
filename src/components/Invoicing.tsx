
import React from 'react';
import { FileText, Eye, Download, Plus } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { Button } from '@/components/ui/button';

export const Invoicing = () => {
  const invoices = [
    {
      id: 'INV-2024-0156',
      customer: 'Johnson Auto Repair',
      date: '2024-01-15',
      amount: 12459.99,
      status: 'Paid',
      items: 5
    },
    {
      id: 'INV-2024-0155',
      customer: 'City Motors',
      date: '2024-01-14',
      amount: 8925.50,
      status: 'Pending',
      items: 3
    },
    {
      id: 'INV-2024-0154',
      customer: 'Quick Fix Garage',
      date: '2024-01-13',
      amount: 5672.25,
      status: 'Overdue',
      items: 7
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-500/20 text-green-300';
      case 'Pending':
        return 'bg-yellow-500/20 text-yellow-300';
      case 'Overdue':
        return 'bg-red-500/20 text-red-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Invoice Management</h1>
          <p className="text-white/70 mt-1">Create and manage customer invoices</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0">
          <Plus size={20} className="mr-2" />
          New Invoice
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {invoices.map((invoice) => (
          <GlassCard key={invoice.id} className="p-6 hover:bg-white/15 transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600">
                  <FileText className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-white font-semibold">{invoice.id}</h3>
                  <p className="text-white/70 text-sm">{invoice.customer}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                {invoice.status}
              </span>
            </div>
            
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-white/70">Date:</span>
                <span className="text-white">{invoice.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Items:</span>
                <span className="text-white">{invoice.items}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-white/20">
                <span className="text-white/70">Total Amount:</span>
                <span className="text-white font-bold text-lg">₹{invoice.amount}</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10">
                <Eye size={16} className="mr-1" />
                View
              </Button>
              <Button size="sm" variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10">
                <Download size={16} className="mr-1" />
                Download
              </Button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
