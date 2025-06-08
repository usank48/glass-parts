import React, { useState } from "react";
import {
  FileText,
  Eye,
  Download,
  Plus,
  Search,
  Filter,
  Calendar,
  DollarSign,
} from "lucide-react";
import { GlassCard } from "./GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Invoicing = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const invoices = [
    {
      id: "INV-2024-0156",
      customer: "Johnson Auto Repair",
      date: "2024-01-15",
      amount: 12459.99,
      status: "Paid",
      items: 5,
      dueDate: "2024-02-14",
    },
    {
      id: "INV-2024-0155",
      customer: "City Motors",
      date: "2024-01-14",
      amount: 8925.5,
      status: "Pending",
      items: 3,
      dueDate: "2024-02-13",
    },
    {
      id: "INV-2024-0154",
      customer: "Quick Fix Garage",
      date: "2024-01-13",
      amount: 5672.25,
      status: "Overdue",
      items: 7,
      dueDate: "2024-01-28",
    },
    {
      id: "INV-2024-0153",
      customer: "Premium Auto Service",
      date: "2024-01-12",
      amount: 15240.75,
      status: "Paid",
      items: 8,
      dueDate: "2024-02-11",
    },
    {
      id: "INV-2024-0152",
      customer: "Downtown Garage",
      date: "2024-01-11",
      amount: 7890.0,
      status: "Pending",
      items: 4,
      dueDate: "2024-02-10",
    },
    {
      id: "INV-2024-0151",
      customer: "Express Auto Repair",
      date: "2024-01-10",
      amount: 3456.8,
      status: "Overdue",
      items: 2,
      dueDate: "2024-01-25",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "Pending":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "Overdue":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  // Filter invoices based on search term
  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.status.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Calculate summary stats
  const totalInvoices = invoices.length;
  const totalAmount = invoices.reduce(
    (sum, invoice) => sum + invoice.amount,
    0,
  );
  const paidInvoices = invoices.filter((inv) => inv.status === "Paid").length;
  const overdueInvoices = invoices.filter(
    (inv) => inv.status === "Overdue",
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Invoice Management</h1>
          <p className="text-white/70 mt-1">
            Create and manage customer invoices
          </p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0">
          <Plus size={20} className="mr-2" />
          New Invoice
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
              <FileText className="text-white" size={24} />
            </div>
            <div>
              <p className="text-white/70 text-sm">Total Invoices</p>
              <p className="text-2xl font-bold text-white">{totalInvoices}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-teal-600">
              <DollarSign className="text-white" size={24} />
            </div>
            <div>
              <p className="text-white/70 text-sm">Total Amount</p>
              <p className="text-2xl font-bold text-white">
                ₹{totalAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600">
              <Eye className="text-white" size={24} />
            </div>
            <div>
              <p className="text-white/70 text-sm">Paid</p>
              <p className="text-2xl font-bold text-white">{paidInvoices}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-red-500 to-pink-600">
              <Calendar className="text-white" size={24} />
            </div>
            <div>
              <p className="text-white/70 text-sm">Overdue</p>
              <p className="text-2xl font-bold text-white">{overdueInvoices}</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Search and Filter */}
      <GlassCard className="p-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50"
              size={20}
            />
            <Input
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
          <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm">
            <Filter size={20} className="mr-2" />
            Filter
          </Button>
        </div>
      </GlassCard>

      {/* Invoices Grid */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white mb-4">Recent Invoices</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredInvoices.map((invoice) => (
            <GlassCard
              key={invoice.id}
              className="p-6 hover:bg-white/15 transition-all duration-200"
            >
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
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(invoice.status)}`}
                >
                  {invoice.status}
                </span>
              </div>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-white/70">Invoice Date:</span>
                  <span className="text-white">{invoice.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Due Date:</span>
                  <span className="text-white">{invoice.dueDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Items:</span>
                  <span className="text-white">{invoice.items}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-white/20">
                  <span className="text-white/70">Total Amount:</span>
                  <span className="text-white font-bold text-lg">
                    ₹{invoice.amount.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-white/20 text-white hover:bg-white/10 bg-white/5"
                >
                  <Eye size={16} className="mr-1" />
                  View
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-white/20 text-white hover:bg-white/10 bg-white/5"
                >
                  <Download size={16} className="mr-1" />
                  Download
                </Button>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {filteredInvoices.length === 0 && (
        <GlassCard className="p-8 text-center">
          <FileText className="mx-auto text-white/50 mb-4" size={48} />
          <h3 className="text-white text-lg font-semibold mb-2">
            No invoices found
          </h3>
          <p className="text-white/70">
            Try adjusting your search criteria or create a new invoice
          </p>
        </GlassCard>
      )}
    </div>
  );
};
