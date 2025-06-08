import React, { useState } from "react";
import { toast } from "sonner";
import {
  FileText,
  Eye,
  Download,
  Plus,
  Search,
  Filter,
  Calendar,
  IndianRupee,
  AlertTriangle,
  Package,
} from "lucide-react";
import { GlassCard } from "./GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InvoiceDetailDialog } from "./dialogs/InvoiceDetailDialog";
import { useInventorySync } from "@/hooks/useInventorySync";
import { formatInventoryValue } from "@/utils/inventoryManager";

interface InvoiceItem {
  id: string;
  itemId: number; // Reference to inventory item
  partNumber: string;
  partName: string;
  brand: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  availableStock?: number; // For validation
}

interface Invoice {
  id: string;
  customer: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  date: string;
  dueDate: string;
  amount: number;
  status: string;
  items: InvoiceItem[];
  notes?: string;
  paymentTerms: string;
  taxRate: number;
  discountAmount?: number;
  inventoryProcessed?: boolean; // Track if inventory has been updated
}

// Define initial invoices data outside component
const initialInvoices: Invoice[] = [
  {
    id: "INV-2024-0156",
    customer: "Johnson Auto Repair",
    customerEmail: "johnson@autorepair.com",
    customerPhone: "+1 (555) 123-4567",
    customerAddress: "123 Main Street, Downtown, CA 90210",
    date: "2024-01-15",
    dueDate: "2024-02-14",
    amount: 12459.99,
    status: "Paid",
    paymentTerms: "Net 30",
    taxRate: 8.5,
    items: [
      {
        id: "1",
        partNumber: "BP-001",
        partName: "Brake Pad Set",
        brand: "Premium Parts",
        quantity: 2,
        unitPrice: 125.0,
        totalPrice: 250.0,
      },
      {
        id: "2",
        partNumber: "OF-002",
        partName: "Oil Filter",
        brand: "Quality Filters",
        quantity: 4,
        unitPrice: 15.99,
        totalPrice: 63.96,
      },
    ],
  },
  {
    id: "INV-2024-0157",
    customer: "Metro Car Service",
    customerEmail: "metro@carservice.com",
    customerPhone: "+1 (555) 987-6543",
    customerAddress: "456 Oak Avenue, Midtown, CA 90211",
    date: "2024-01-16",
    dueDate: "2024-02-15",
    amount: 8750.5,
    status: "Pending",
    paymentTerms: "Net 30",
    taxRate: 8.5,
    items: [
      {
        id: "3",
        partNumber: "SP-003",
        partName: "Spark Plugs Set",
        brand: "Ignition Pro",
        quantity: 1,
        unitPrice: 89.99,
        totalPrice: 89.99,
      },
    ],
  },
  {
    id: "INV-2024-0158",
    customer: "Highway Motors",
    customerEmail: "highway@motors.com",
    customerPhone: "+1 (555) 456-7890",
    customerAddress: "789 Highway Blvd, Uptown, CA 90212",
    date: "2024-01-10",
    dueDate: "2024-02-09",
    amount: 15320.75,
    status: "Overdue",
    paymentTerms: "Net 30",
    taxRate: 8.5,
    items: [
      {
        id: "4",
        partNumber: "TS-004",
        partName: "Transmission Service Kit",
        brand: "Trans-Tech",
        quantity: 1,
        unitPrice: 450.0,
        totalPrice: 450.0,
      },
    ],
  },
  {
    id: "INV-2024-0159",
    customer: "City Auto Works",
    customerEmail: "city@autoworks.com",
    customerPhone: "+1 (555) 234-5678",
    customerAddress: "321 Industrial Way, Downtown, CA 90213",
    date: "2024-01-18",
    dueDate: "2024-02-17",
    amount: 6890.25,
    status: "Pending",
    paymentTerms: "Net 15",
    taxRate: 8.5,
    items: [
      {
        id: "5",
        partNumber: "AC-005",
        partName: "Air Conditioning Compressor",
        brand: "Cool Air Pro",
        quantity: 1,
        unitPrice: 320.5,
        totalPrice: 320.5,
      },
    ],
  },
  {
    id: "INV-2024-0160",
    customer: "Rapid Repair Shop",
    customerEmail: "rapid@repair.com",
    customerPhone: "+1 (555) 345-6789",
    customerAddress: "654 Service Road, Southside, CA 90214",
    date: "2024-01-20",
    dueDate: "2024-02-19",
    amount: 4560.8,
    status: "Paid",
    paymentTerms: "Net 30",
    taxRate: 8.5,
    items: [
      {
        id: "6",
        partNumber: "BT-006",
        partName: "Car Battery",
        brand: "PowerMax",
        quantity: 3,
        unitPrice: 125.99,
        totalPrice: 377.97,
      },
    ],
  },
];

export const Invoicing = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showInvoiceDetail, setShowInvoiceDetail] = useState(false);
  const [invoicesList, setInvoicesList] = useState<Invoice[]>(initialInvoices);

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
  const filteredInvoices = invoicesList.filter(
    (invoice) =>
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.status.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Calculate summary stats
  const totalInvoices = invoicesList.length;
  const totalAmount = invoicesList.reduce(
    (sum, invoice) => sum + invoice.amount,
    0,
  );
  const paidInvoices = invoicesList.filter(
    (inv) => inv.status === "Paid",
  ).length;
  const overdueInvoices = invoicesList.filter(
    (inv) => inv.status === "Overdue",
  ).length;

  const handleInvoiceClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceDetail(true);
  };

  const handleDownload = (invoice: Invoice, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    console.log("Downloading invoice:", invoice.id);
    toast.success(`Invoice ${invoice.id} download started`);
  };

  const handleSaveInvoice = (updatedInvoice: Invoice) => {
    setInvoicesList((prevInvoices) =>
      prevInvoices.map((invoice) =>
        invoice.id === updatedInvoice.id ? updatedInvoice : invoice,
      ),
    );
    setSelectedInvoice(updatedInvoice);
    toast.success("Invoice updated successfully!");
  };

  // Format currency with proper responsive handling
  const formatCurrency = (amount: number, compact = false) => {
    if (compact && amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    if (compact && amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    }
    return `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header - Responsive */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Invoice Management
          </h1>
          <p className="text-white/70 mt-1 text-sm sm:text-base">
            Create and manage customer invoices
          </p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 w-full sm:w-auto">
          <Plus size={20} className="mr-2" />
          New Invoice
        </Button>
      </div>

      {/* Summary Cards - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Invoices */}
        <GlassCard className="p-4 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex-shrink-0">
              <FileText className="text-white" size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white/70 text-xs sm:text-sm">Total Invoices</p>
              <p className="text-xl sm:text-2xl font-bold text-white">
                {totalInvoices}
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Total Amount - Fixed Overflow */}
        <GlassCard className="p-4 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-r from-green-500 to-teal-600 flex-shrink-0">
              <IndianRupee className="text-white" size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white/70 text-xs sm:text-sm">Total Amount</p>
              <p
                className="text-lg sm:text-2xl font-bold text-white truncate"
                title={formatCurrency(totalAmount)}
              >
                {formatCurrency(totalAmount, true)}
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Paid Invoices */}
        <GlassCard className="p-4 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 flex-shrink-0">
              <Eye className="text-white" size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white/70 text-xs sm:text-sm">Paid</p>
              <p className="text-xl sm:text-2xl font-bold text-white">
                {paidInvoices}
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Overdue Invoices */}
        <GlassCard className="p-4 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-r from-red-500 to-pink-600 flex-shrink-0">
              <Calendar className="text-white" size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white/70 text-xs sm:text-sm">Overdue</p>
              <p className="text-xl sm:text-2xl font-bold text-white">
                {overdueInvoices}
              </p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Search - Responsive */}
      <GlassCard className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50"
              size={18}
            />
            <Input
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 text-sm sm:text-base"
            />
          </div>
          <Button
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm w-full sm:w-auto"
          >
            <Filter size={16} className="mr-2" />
            Filter
          </Button>
        </div>
      </GlassCard>

      {/* Invoice Cards - Responsive Grid */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white">
          Recent Invoices
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredInvoices.map((invoice) => (
            <GlassCard
              key={invoice.id}
              className="p-4 sm:p-6 cursor-pointer hover:bg-white/15 transition-all duration-200"
              onClick={() => handleInvoiceClick(invoice)}
            >
              {/* Invoice Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 flex-shrink-0">
                    <FileText className="text-white" size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-sm sm:text-base truncate">
                      {invoice.id}
                    </h3>
                    <p className="text-white/70 text-xs sm:text-sm truncate">
                      {invoice.customer}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(invoice.status)} flex-shrink-0`}
                >
                  {invoice.status}
                </span>
              </div>

              {/* Invoice Details */}
              <div className="space-y-2 text-xs sm:text-sm mb-4">
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
                  <span className="text-white">{invoice.items.length}</span>
                </div>
                {/* Fixed Total Amount Overflow */}
                <div className="flex justify-between items-center pt-2 border-t border-white/20">
                  <span className="text-white/70">Total Amount:</span>
                  <span
                    className="text-white font-bold text-base sm:text-lg truncate ml-2"
                    title={formatCurrency(invoice.amount)}
                  >
                    {formatCurrency(invoice.amount, window.innerWidth < 640)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-white/20 text-white hover:bg-white/10 bg-transparent backdrop-blur-sm text-xs sm:text-sm"
                  onClick={() => handleInvoiceClick(invoice)}
                >
                  <Eye size={14} className="mr-1" />
                  View
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-white/20 text-white hover:bg-white/10 bg-transparent backdrop-blur-sm text-xs sm:text-sm"
                  onClick={(e) => handleDownload(invoice, e)}
                >
                  <Download size={14} className="mr-1" />
                  Download
                </Button>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* No Results State */}
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

      {/* Invoice Detail Dialog */}
      <InvoiceDetailDialog
        open={showInvoiceDetail}
        onClose={() => {
          setShowInvoiceDetail(false);
          setSelectedInvoice(null);
        }}
        invoice={selectedInvoice}
        onSave={handleSaveInvoice}
      />
    </div>
  );
};
