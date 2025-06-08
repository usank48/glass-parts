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
import { InvoiceDetailDialog } from "./dialogs/InvoiceDetailDialog";

interface InvoiceItem {
  id: string;
  partNumber: string;
  partName: string;
  brand: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
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
}

export const Invoicing = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showInvoiceDetail, setShowInvoiceDetail] = useState(false);
  const [invoicesList, setInvoicesList] = useState<Invoice[]>([]);

  const invoices: Invoice[] = [
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
      discountAmount: 200,
      notes:
        "Bulk order discount applied. Customer requested expedited shipping.",
      items: [
        {
          id: "1",
          partNumber: "BP-BMW-X5-2020",
          partName: "Premium Brake Pad Set",
          brand: "Bosch",
          quantity: 2,
          unitPrice: 129.99,
          totalPrice: 259.98,
        },
        {
          id: "2",
          partNumber: "SUS-BMW-X5-2020",
          partName: "Front Strut Assembly",
          brand: "Monroe",
          quantity: 4,
          unitPrice: 275.99,
          totalPrice: 1103.96,
        },
        {
          id: "3",
          partNumber: "EV-BMW-X5-2020",
          partName: "Intake Valve Set",
          brand: "Mahle",
          quantity: 1,
          unitPrice: 229.99,
          totalPrice: 229.99,
        },
        {
          id: "4",
          partNumber: "CR-BMW-X5-2020",
          partName: "Radiator Core",
          brand: "Denso",
          quantity: 3,
          unitPrice: 359.99,
          totalPrice: 1079.97,
        },
        {
          id: "5",
          partNumber: "PK-BMW-X5-2020",
          partName: "Engine Gasket Kit",
          brand: "Felpro",
          quantity: 5,
          unitPrice: 189.99,
          totalPrice: 949.95,
        },
      ],
    },
    {
      id: "INV-2024-0155",
      customer: "City Motors",
      customerEmail: "orders@citymotors.com",
      customerPhone: "+1 (555) 987-6543",
      customerAddress: "456 Industrial Ave, Metro City, NY 10001",
      date: "2024-01-14",
      dueDate: "2024-02-13",
      amount: 8925.5,
      status: "Pending",
      paymentTerms: "Net 15",
      taxRate: 7.25,
      notes: "Regular customer - monthly service contract.",
      items: [
        {
          id: "1",
          partNumber: "BP-TOY-CAM-2019",
          partName: "Ceramic Brake Pads",
          brand: "Akebono",
          quantity: 8,
          unitPrice: 95.99,
          totalPrice: 767.92,
        },
        {
          id: "2",
          partNumber: "SUS-TOY-CAM-2019",
          partName: "Shock Absorber Set",
          brand: "KYB",
          quantity: 6,
          unitPrice: 149.99,
          totalPrice: 899.94,
        },
        {
          id: "3",
          partNumber: "EV-TOY-CAM-2019",
          partName: "Exhaust Valve Kit",
          brand: "Denso",
          quantity: 10,
          unitPrice: 129.99,
          totalPrice: 1299.9,
        },
      ],
    },
    {
      id: "INV-2024-0154",
      customer: "Quick Fix Garage",
      customerEmail: "billing@quickfix.com",
      customerPhone: "+1 (555) 456-7890",
      customerAddress: "789 Service Road, Suburb, TX 75001",
      date: "2024-01-13",
      dueDate: "2024-01-28",
      amount: 5672.25,
      status: "Overdue",
      paymentTerms: "Net 15",
      taxRate: 8.25,
      discountAmount: 100,
      notes: "Payment overdue. Follow-up required.",
      items: [
        {
          id: "1",
          partNumber: "BP-HON-CIV-2021",
          partName: "Sport Brake Pads",
          brand: "Brembo",
          quantity: 4,
          unitPrice: 159.99,
          totalPrice: 639.96,
        },
        {
          id: "2",
          partNumber: "SUS-HON-CIV-2021",
          partName: "Coil Spring Set",
          brand: "Eibach",
          quantity: 3,
          unitPrice: 189.99,
          totalPrice: 569.97,
        },
        {
          id: "3",
          partNumber: "CR-TOY-CAM-2019",
          partName: "AC Evaporator Core",
          brand: "Valeo",
          quantity: 2,
          unitPrice: 275.99,
          totalPrice: 551.98,
        },
        {
          id: "4",
          partNumber: "PK-TOY-CAM-2019",
          partName: "Transmission Seal Kit",
          brand: "Beck Arnley",
          quantity: 6,
          unitPrice: 69.99,
          totalPrice: 419.94,
        },
        {
          id: "5",
          partNumber: "HG-BMW-X5-2020",
          partName: "Cylinder Head Gasket",
          brand: "Mahle",
          quantity: 2,
          unitPrice: 279.99,
          totalPrice: 559.98,
        },
        {
          id: "6",
          partNumber: "HG-TOY-CAM-2019",
          partName: "Multi-Layer Head Gasket",
          brand: "Cometic",
          quantity: 4,
          unitPrice: 229.99,
          totalPrice: 919.96,
        },
        {
          id: "7",
          partNumber: "BP-BMW-X5-2020",
          partName: "Premium Brake Pad Set",
          brand: "Bosch",
          quantity: 1,
          unitPrice: 129.99,
          totalPrice: 129.99,
        },
      ],
    },
    {
      id: "INV-2024-0153",
      customer: "Premium Auto Service",
      customerEmail: "service@premiumauto.com",
      customerPhone: "+1 (555) 321-0987",
      customerAddress: "321 Luxury Lane, Uptown, FL 33101",
      date: "2024-01-12",
      dueDate: "2024-02-11",
      amount: 15240.75,
      status: "Paid",
      paymentTerms: "Net 30",
      taxRate: 6.5,
      notes: "Premium customer - VIP service package.",
      items: [
        {
          id: "1",
          partNumber: "SUS-BMW-X5-2020",
          partName: "Front Strut Assembly",
          brand: "Monroe",
          quantity: 8,
          unitPrice: 275.99,
          totalPrice: 2207.92,
        },
        {
          id: "2",
          partNumber: "EV-BMW-X5-2020",
          partName: "Intake Valve Set",
          brand: "Mahle",
          quantity: 6,
          unitPrice: 229.99,
          totalPrice: 1379.94,
        },
        {
          id: "3",
          partNumber: "CR-BMW-X5-2020",
          partName: "Radiator Core",
          brand: "Denso",
          quantity: 4,
          unitPrice: 359.99,
          totalPrice: 1439.96,
        },
        {
          id: "4",
          partNumber: "PK-BMW-X5-2020",
          partName: "Engine Gasket Kit",
          brand: "Felpro",
          quantity: 10,
          unitPrice: 189.99,
          totalPrice: 1899.9,
        },
        {
          id: "5",
          partNumber: "HG-BMW-X5-2020",
          partName: "Cylinder Head Gasket",
          brand: "Mahle",
          quantity: 12,
          unitPrice: 279.99,
          totalPrice: 3359.88,
        },
        {
          id: "6",
          partNumber: "BP-BMW-X5-2020",
          partName: "Premium Brake Pad Set",
          brand: "Bosch",
          quantity: 15,
          unitPrice: 129.99,
          totalPrice: 1949.85,
        },
        {
          id: "7",
          partNumber: "SUS-TOY-CAM-2019",
          partName: "Shock Absorber Set",
          brand: "KYB",
          quantity: 8,
          unitPrice: 149.99,
          totalPrice: 1199.92,
        },
        {
          id: "8",
          partNumber: "EV-TOY-CAM-2019",
          partName: "Exhaust Valve Kit",
          brand: "Denso",
          quantity: 5,
          unitPrice: 129.99,
          totalPrice: 649.95,
        },
      ],
    },
    {
      id: "INV-2024-0152",
      customer: "Downtown Garage",
      customerEmail: "admin@downtowngarage.com",
      customerPhone: "+1 (555) 654-3210",
      customerAddress: "654 Central St, Downtown, WA 98101",
      date: "2024-01-11",
      dueDate: "2024-02-10",
      amount: 7890.0,
      status: "Pending",
      paymentTerms: "Net 30",
      taxRate: 10.25,
      notes: "Rush order for weekend service.",
      items: [
        {
          id: "1",
          partNumber: "BP-HON-CIV-2021",
          partName: "Sport Brake Pads",
          brand: "Brembo",
          quantity: 6,
          unitPrice: 159.99,
          totalPrice: 959.94,
        },
        {
          id: "2",
          partNumber: "SUS-HON-CIV-2021",
          partName: "Coil Spring Set",
          brand: "Eibach",
          quantity: 4,
          unitPrice: 189.99,
          totalPrice: 759.96,
        },
        {
          id: "3",
          partNumber: "CR-TOY-CAM-2019",
          partName: "AC Evaporator Core",
          brand: "Valeo",
          quantity: 8,
          unitPrice: 275.99,
          totalPrice: 2207.92,
        },
        {
          id: "4",
          partNumber: "PK-TOY-CAM-2019",
          partName: "Transmission Seal Kit",
          brand: "Beck Arnley",
          quantity: 12,
          unitPrice: 69.99,
          totalPrice: 839.88,
        },
      ],
    },
    {
      id: "INV-2024-0151",
      customer: "Express Auto Repair",
      customerEmail: "orders@expressauto.com",
      customerPhone: "+1 (555) 789-0123",
      customerAddress: "987 Express Way, Fastlane, NV 89101",
      date: "2024-01-10",
      dueDate: "2024-01-25",
      amount: 3456.8,
      status: "Overdue",
      paymentTerms: "Net 15",
      taxRate: 8.75,
      discountAmount: 50,
      notes: "Small independent garage - payment plan arranged.",
      items: [
        {
          id: "1",
          partNumber: "HG-TOY-CAM-2019",
          partName: "Multi-Layer Head Gasket",
          brand: "Cometic",
          quantity: 3,
          unitPrice: 229.99,
          totalPrice: 689.97,
        },
        {
          id: "2",
          partNumber: "BP-TOY-CAM-2019",
          partName: "Ceramic Brake Pads",
          brand: "Akebono",
          quantity: 8,
          unitPrice: 95.99,
          totalPrice: 767.92,
        },
      ],
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

  const handleInvoiceClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceDetail(true);
  };

  const handleDownload = (invoice: Invoice, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    console.log("Downloading invoice:", invoice.id);
    // Implement download logic
  };

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
              className="p-6 hover:bg-white/15 transition-all duration-200 cursor-pointer"
              onClick={() => handleInvoiceClick(invoice)}
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
                  <span className="text-white">{invoice.items.length}</span>
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
                  onClick={() => handleInvoiceClick(invoice)}
                >
                  <Eye size={16} className="mr-1" />
                  View Details
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-white/20 text-white hover:bg-white/10 bg-white/5"
                  onClick={(e) => handleDownload(invoice, e)}
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

      {/* Invoice Detail Dialog */}
      <InvoiceDetailDialog
        open={showInvoiceDetail}
        onClose={() => {
          setShowInvoiceDetail(false);
          setSelectedInvoice(null);
        }}
        invoice={selectedInvoice}
      />
    </div>
  );
};
