import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  IndianRupee,
  PieChart,
  Plus,
  Trash2,
  User,
  Building,
  Calendar,
  Filter,
  Search,
  Users,
  Home,
  FileText,
  CreditCard,
  Receipt,
  BarChart3,
  BookOpen,
  Clock,
  Bell,
  Edit,
  Eye,
  Download,
  Send,
  Calculator,
} from "lucide-react";
import { GlassCard } from "./GlassCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Types
interface ChartOfAccount {
  id: string;
  code: string;
  name: string;
  type: "assets" | "liabilities" | "equity" | "revenue" | "expenses";
  subType: string;
  balance: number;
  isActive: boolean;
}

interface JournalEntry {
  id: string;
  date: string;
  reference: string;
  description: string;
  entries: {
    accountId: string;
    accountName: string;
    debit: number;
    credit: number;
  }[];
  totalDebit: number;
  totalCredit: number;
  status: "draft" | "posted";
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  date: string;
  dueDate: string;
  amount: number;
  paidAmount: number;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  items: {
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }[];
}

interface Bill {
  id: string;
  billNumber: string;
  supplierId: string;
  supplierName: string;
  date: string;
  dueDate: string;
  amount: number;
  paidAmount: number;
  status: "received" | "approved" | "paid" | "overdue";
}

export const Accounting = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showDialog, setShowDialog] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAccountSearch, setShowAccountSearch] = useState(false);
  const [accountSearchQuery, setAccountSearchQuery] = useState("");

  // Form states for quick actions
  const [invoiceForm, setInvoiceForm] = useState({
    customerName: "",
    customerEmail: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    items: [{ description: "", quantity: 1, rate: 0, amount: 0 }],
    notes: "",
    taxRate: 18,
  });

  const [paymentForm, setPaymentForm] = useState({
    invoiceNumber: "",
    customerName: "",
    paymentAmount: "",
    paymentDate: new Date().toISOString().split("T")[0],
    paymentMethod: "cash",
    reference: "",
    notes: "",
  });

  const [billForm, setBillForm] = useState({
    supplierName: "",
    supplierEmail: "",
    billNumber: "",
    billDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    amount: "",
    description: "",
    category: "supplies",
    notes: "",
  });

  const [journalForm, setJournalForm] = useState({
    date: new Date().toISOString().split("T")[0],
    reference: "",
    description: "",
    entries: [
      { accountId: "", accountName: "", debit: 0, credit: 0 },
      { accountId: "", accountName: "", debit: 0, credit: 0 },
    ],
  });

  // Sample data
  const [chartOfAccounts] = useState<ChartOfAccount[]>([
    {
      id: "1001",
      code: "1001",
      name: "Cash",
      type: "assets",
      subType: "Current Assets",
      balance: 150000,
      isActive: true,
    },
    {
      id: "1002",
      code: "1002",
      name: "Accounts Receivable",
      type: "assets",
      subType: "Current Assets",
      balance: 85000,
      isActive: true,
    },
    {
      id: "1003",
      code: "1003",
      name: "Inventory",
      type: "assets",
      subType: "Current Assets",
      balance: 200000,
      isActive: true,
    },
    {
      id: "2001",
      code: "2001",
      name: "Accounts Payable",
      type: "liabilities",
      subType: "Current Liabilities",
      balance: 65000,
      isActive: true,
    },
    {
      id: "3001",
      code: "3001",
      name: "Owner Equity",
      type: "equity",
      subType: "Equity",
      balance: 300000,
      isActive: true,
    },
    {
      id: "4001",
      code: "4001",
      name: "Sales Revenue",
      type: "revenue",
      subType: "Revenue",
      balance: 450000,
      isActive: true,
    },
    {
      id: "5001",
      code: "5001",
      name: "Cost of Goods Sold",
      type: "expenses",
      subType: "Cost of Sales",
      balance: 180000,
      isActive: true,
    },
  ]);

  const [journalEntries] = useState<JournalEntry[]>([
    {
      id: "je001",
      date: "2024-01-15",
      reference: "JE001",
      description: "Sales transaction - Invoice #INV-2024-0156",
      entries: [
        {
          accountId: "1002",
          accountName: "Accounts Receivable",
          debit: 45000,
          credit: 0,
        },
        {
          accountId: "4001",
          accountName: "Sales Revenue",
          debit: 0,
          credit: 45000,
        },
      ],
      totalDebit: 45000,
      totalCredit: 45000,
      status: "posted",
    },
  ]);

  const [invoices] = useState<Invoice[]>([
    {
      id: "inv001",
      invoiceNumber: "INV-2024-0156",
      customerId: "cust001",
      customerName: "Johnson Auto Repair",
      date: "2024-01-15",
      dueDate: "2024-02-14",
      amount: 45000,
      paidAmount: 20000,
      status: "sent",
      items: [
        {
          description: "Brake Pads Set",
          quantity: 2,
          rate: 15000,
          amount: 30000,
        },
        { description: "Oil Filter", quantity: 5, rate: 3000, amount: 15000 },
      ],
    },
  ]);

  const [bills] = useState<Bill[]>([
    {
      id: "bill001",
      billNumber: "BILL-2024-0089",
      supplierId: "supp001",
      supplierName: "AutoMax Suppliers",
      date: "2024-01-14",
      dueDate: "2024-02-13",
      amount: 30000,
      paidAmount: 15000,
      status: "approved",
    },
  ]);

  // Financial metrics calculations
  const totalAssets = chartOfAccounts
    .filter((a) => a.type === "assets")
    .reduce((sum, a) => sum + a.balance, 0);
  const totalLiabilities = chartOfAccounts
    .filter((a) => a.type === "liabilities")
    .reduce((sum, a) => sum + a.balance, 0);
  const totalRevenue = chartOfAccounts
    .filter((a) => a.type === "revenue")
    .reduce((sum, a) => sum + a.balance, 0);
  const totalExpenses = chartOfAccounts
    .filter((a) => a.type === "expenses")
    .reduce((sum, a) => sum + a.balance, 0);
  const netProfit = totalRevenue - totalExpenses;

  const outstandingReceivables = invoices.reduce(
    (sum, inv) => sum + (inv.amount - inv.paidAmount),
    0,
  );
  const outstandingPayables = bills.reduce(
    (sum, bill) => sum + (bill.amount - bill.paidAmount),
    0,
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
      case "posted":
        return "bg-green-500/20 text-green-300";
      case "sent":
      case "approved":
        return "bg-blue-500/20 text-blue-300";
      case "overdue":
        return "bg-red-500/20 text-red-300";
      case "draft":
        return "bg-gray-500/20 text-gray-300";
      default:
        return "bg-orange-500/20 text-orange-300";
    }
  };

  // Filter accounts based on search query
  const filteredAccounts = chartOfAccounts.filter(
    (account) =>
      account.name.toLowerCase().includes(accountSearchQuery.toLowerCase()) ||
      account.code.toLowerCase().includes(accountSearchQuery.toLowerCase()) ||
      account.type.toLowerCase().includes(accountSearchQuery.toLowerCase()) ||
      account.subType.toLowerCase().includes(accountSearchQuery.toLowerCase()),
  );

  const handleAccountSelect = (account: ChartOfAccount) => {
    toast.success(`Selected account: ${account.name} (${account.code})`);
    setShowAccountSearch(false);
    setAccountSearchQuery("");
    // You can add additional logic here to handle what happens when an account is selected
  };

  // Form handlers
  const handleCreateInvoice = () => {
    if (!invoiceForm.customerName || !invoiceForm.items[0].description) {
      toast.error("Please fill in required fields");
      return;
    }

    const totalAmount = invoiceForm.items.reduce(
      (sum, item) => sum + item.amount,
      0,
    );
    const taxAmount = (totalAmount * invoiceForm.taxRate) / 100;
    const finalAmount = totalAmount + taxAmount;

    toast.success(
      `Invoice created successfully! Total: ${formatCurrency(finalAmount)}`,
    );
    setShowDialog("");
    setInvoiceForm({
      customerName: "",
      customerEmail: "",
      invoiceDate: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      items: [{ description: "", quantity: 1, rate: 0, amount: 0 }],
      notes: "",
      taxRate: 18,
    });
  };

  const handleRecordPayment = () => {
    if (!paymentForm.invoiceNumber || !paymentForm.paymentAmount) {
      toast.error("Please fill in required fields");
      return;
    }

    toast.success(
      `Payment of ${formatCurrency(parseFloat(paymentForm.paymentAmount))} recorded successfully!`,
    );
    setShowDialog("");
    setPaymentForm({
      invoiceNumber: "",
      customerName: "",
      paymentAmount: "",
      paymentDate: new Date().toISOString().split("T")[0],
      paymentMethod: "cash",
      reference: "",
      notes: "",
    });
  };

  const handleAddBill = () => {
    if (!billForm.supplierName || !billForm.amount) {
      toast.error("Please fill in required fields");
      return;
    }

    toast.success(
      `Bill for ${formatCurrency(parseFloat(billForm.amount))} added successfully!`,
    );
    setShowDialog("");
    setBillForm({
      supplierName: "",
      supplierEmail: "",
      billNumber: "",
      billDate: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      amount: "",
      description: "",
      category: "supplies",
      notes: "",
    });
  };

  const handleJournalEntry = () => {
    const totalDebit = journalForm.entries.reduce(
      (sum, entry) => sum + entry.debit,
      0,
    );
    const totalCredit = journalForm.entries.reduce(
      (sum, entry) => sum + entry.credit,
      0,
    );

    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      toast.error("Debit and Credit amounts must be equal");
      return;
    }

    if (!journalForm.description || totalDebit === 0) {
      toast.error("Please fill in description and at least one entry");
      return;
    }

    toast.success(
      `Journal entry posted successfully! Total: ${formatCurrency(totalDebit)}`,
    );
    setShowDialog("");
    setJournalForm({
      date: new Date().toISOString().split("T")[0],
      reference: "",
      description: "",
      entries: [
        { accountId: "", accountName: "", debit: 0, credit: 0 },
        { accountId: "", accountName: "", debit: 0, credit: 0 },
      ],
    });
  };

  const addInvoiceItem = () => {
    setInvoiceForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { description: "", quantity: 1, rate: 0, amount: 0 },
      ],
    }));
  };

  const updateInvoiceItem = (index: number, field: string, value: any) => {
    setInvoiceForm((prev) => ({
      ...prev,
      items: prev.items.map((item, i) => {
        if (i === index) {
          const updated = { ...item, [field]: value };
          if (field === "quantity" || field === "rate") {
            updated.amount = updated.quantity * updated.rate;
          }
          return updated;
        }
        return item;
      }),
    }));
  };

  const addJournalEntry = () => {
    setJournalForm((prev) => ({
      ...prev,
      entries: [
        ...prev.entries,
        { accountId: "", accountName: "", debit: 0, credit: 0 },
      ],
    }));
  };

  const updateJournalEntry = (index: number, field: string, value: any) => {
    setJournalForm((prev) => ({
      ...prev,
      entries: prev.entries.map((entry, i) =>
        i === index ? { ...entry, [field]: value } : entry,
      ),
    }));
  };

  const navigationTabs = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "general-ledger", label: "General Ledger", icon: BookOpen },
    { id: "accounts-receivable", label: "A/R", icon: TrendingUp },
    { id: "accounts-payable", label: "A/P", icon: TrendingDown },
    { id: "reports", label: "Reports", icon: BarChart3 },
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-teal-600">
              <IndianRupee className="text-white" size={24} />
            </div>
            <span className="text-green-300 text-sm font-medium">+12.5%</span>
          </div>
          <p className="text-white/70 text-sm font-medium">Total Revenue</p>
          <p className="text-2xl font-bold text-white mt-1">
            {formatCurrency(totalRevenue)}
          </p>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
              <TrendingUp className="text-white" size={24} />
            </div>
            <span className="text-blue-300 text-sm font-medium">
              Outstanding
            </span>
          </div>
          <p className="text-white/70 text-sm font-medium">
            Accounts Receivable
          </p>
          <p className="text-2xl font-bold text-white mt-1">
            {formatCurrency(outstandingReceivables)}
          </p>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-red-500 to-orange-600">
              <TrendingDown className="text-white" size={24} />
            </div>
            <span className="text-red-300 text-sm font-medium">Due</span>
          </div>
          <p className="text-white/70 text-sm font-medium">Accounts Payable</p>
          <p className="text-2xl font-bold text-white mt-1">
            {formatCurrency(outstandingPayables)}
          </p>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600">
              <PieChart className="text-white" size={24} />
            </div>
            <span className="text-green-300 text-sm font-medium">+18.7%</span>
          </div>
          <p className="text-white/70 text-sm font-medium">Net Profit</p>
          <p className="text-2xl font-bold text-white mt-1">
            {formatCurrency(netProfit)}
          </p>
        </GlassCard>
      </div>

      {/* Quick Actions */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            onClick={() => setShowDialog("create-invoice")}
            className="bg-green-600/80 hover:bg-green-700 text-white border-0 h-16 flex flex-col"
          >
            <FileText size={20} className="mb-1" />
            <span className="text-xs">Create Invoice</span>
          </Button>
          <Button
            onClick={() => setShowDialog("record-payment")}
            className="bg-blue-600/80 hover:bg-blue-700 text-white border-0 h-16 flex flex-col"
          >
            <CreditCard size={20} className="mb-1" />
            <span className="text-xs">Record Payment</span>
          </Button>
          <Button
            onClick={() => setShowDialog("add-bill")}
            className="bg-orange-600/80 hover:bg-orange-700 text-white border-0 h-16 flex flex-col"
          >
            <Receipt size={20} className="mb-1" />
            <span className="text-xs">Add Bill</span>
          </Button>
          <Button
            onClick={() => setShowDialog("journal-entry")}
            className="bg-purple-600/80 hover:bg-purple-700 text-white border-0 h-16 flex flex-col"
          >
            <BookOpen size={20} className="mb-1" />
            <span className="text-xs">Journal Entry</span>
          </Button>
        </div>
      </GlassCard>

      {/* Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              Recent Invoices
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveSection("accounts-receivable")}
            >
              <Eye size={14} />
            </Button>
          </div>
          <div className="space-y-3">
            {invoices.slice(0, 3).map((invoice) => (
              <div
                key={invoice.id}
                className="flex justify-between items-center p-3 rounded-lg bg-white/5"
              >
                <div>
                  <p className="text-white font-medium">
                    {invoice.invoiceNumber}
                  </p>
                  <p className="text-white/60 text-sm">
                    {invoice.customerName}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">
                    {formatCurrency(invoice.amount)}
                  </p>
                  <Badge className={getStatusColor(invoice.status)}>
                    {invoice.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Recent Bills</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveSection("accounts-payable")}
            >
              <Eye size={14} />
            </Button>
          </div>
          <div className="space-y-3">
            {bills.slice(0, 3).map((bill) => (
              <div
                key={bill.id}
                className="flex justify-between items-center p-3 rounded-lg bg-white/5"
              >
                <div>
                  <p className="text-white font-medium">{bill.billNumber}</p>
                  <p className="text-white/60 text-sm">{bill.supplierName}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">
                    {formatCurrency(bill.amount)}
                  </p>
                  <Badge className={getStatusColor(bill.status)}>
                    {bill.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );

  const renderGeneralLedger = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">General Ledger</h2>
        <div className="flex gap-3">
          <Button
            onClick={() => setShowDialog("add-account")}
            variant="outline"
            className="!bg-transparent border-white/20 text-white hover:bg-white/10"
          >
            <Plus size={16} className="mr-2" />
            Add Account
          </Button>
          <Button
            onClick={() => setShowDialog("journal-entry")}
            className="bg-green-600/80 hover:bg-green-700 text-white border-0"
          >
            <BookOpen size={16} className="mr-2" />
            Journal Entry
          </Button>
        </div>
      </div>

      {/* Chart of Accounts */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Chart of Accounts
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left text-white/70 font-medium pb-3">
                  Code
                </th>
                <th className="text-left text-white/70 font-medium pb-3">
                  Account Name
                </th>
                <th className="text-left text-white/70 font-medium pb-3">
                  Type
                </th>
                <th className="text-right text-white/70 font-medium pb-3">
                  Balance
                </th>
                <th className="text-center text-white/70 font-medium pb-3">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {chartOfAccounts.map((account) => (
                <tr
                  key={account.id}
                  className="border-b border-white/10 hover:bg-white/5"
                >
                  <td className="py-3 text-white/80">{account.code}</td>
                  <td className="py-3 text-white font-medium">
                    {account.name}
                  </td>
                  <td className="py-3 text-white/60">{account.subType}</td>
                  <td className="py-3 text-right text-white font-medium">
                    {formatCurrency(account.balance)}
                  </td>
                  <td className="py-3 text-center">
                    <Badge
                      className={
                        account.isActive
                          ? "bg-green-500/20 text-green-300"
                          : "bg-gray-500/20 text-gray-300"
                      }
                    >
                      {account.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Recent Journal Entries */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Recent Journal Entries
        </h3>
        <div className="space-y-4">
          {journalEntries.map((entry) => (
            <div
              key={entry.id}
              className="p-4 rounded-lg bg-white/5 border border-white/10"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-white font-medium">{entry.reference}</h4>
                  <p className="text-white/60 text-sm">{entry.description}</p>
                  <p className="text-white/40 text-xs">{entry.date}</p>
                </div>
                <Badge className={getStatusColor(entry.status)}>
                  {entry.status}
                </Badge>
              </div>
              <div className="space-y-2">
                {entry.entries.map((line, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-white/80">{line.accountName}</span>
                    <div className="flex gap-4">
                      <span className="text-red-300 w-20 text-right">
                        {line.debit > 0 ? formatCurrency(line.debit) : "-"}
                      </span>
                      <span className="text-green-300 w-20 text-right">
                        {line.credit > 0 ? formatCurrency(line.credit) : "-"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );

  const renderAccountsReceivable = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Accounts Receivable</h2>
        <div className="flex gap-3">
          <Button
            onClick={() => setShowDialog("send-reminder")}
            variant="outline"
            className="!bg-transparent border-white/20 text-white hover:bg-white/10"
          >
            <Bell size={16} className="mr-2" />
            Send Reminders
          </Button>
          <Button
            onClick={() => setShowDialog("create-invoice")}
            className="bg-green-600/80 hover:bg-green-700 text-white border-0"
          >
            <Plus size={16} className="mr-2" />
            Create Invoice
          </Button>
        </div>
      </div>

      {/* A/R Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
              <FileText className="text-white" size={24} />
            </div>
          </div>
          <p className="text-white/70 text-sm font-medium">Total Outstanding</p>
          <p className="text-2xl font-bold text-blue-300 mt-1">
            {formatCurrency(outstandingReceivables)}
          </p>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-orange-500 to-red-600">
              <Clock className="text-white" size={24} />
            </div>
          </div>
          <p className="text-white/70 text-sm font-medium">Overdue Amount</p>
          <p className="text-2xl font-bold text-orange-300 mt-1">
            {formatCurrency(
              invoices
                .filter((inv) => inv.status === "overdue")
                .reduce((sum, inv) => sum + (inv.amount - inv.paidAmount), 0),
            )}
          </p>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-teal-600">
              <Calculator className="text-white" size={24} />
            </div>
          </div>
          <p className="text-white/70 text-sm font-medium">
            Average Days to Pay
          </p>
          <p className="text-2xl font-bold text-green-300 mt-1">28 days</p>
        </GlassCard>
      </div>

      {/* Invoices List */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Invoices</h3>
          <div className="flex items-center gap-2">
            <Search className="text-white/60" size={16} />
            <Input
              placeholder="Search invoices..."
              className="w-64 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left text-white/70 font-medium pb-3">
                  Invoice #
                </th>
                <th className="text-left text-white/70 font-medium pb-3">
                  Customer
                </th>
                <th className="text-left text-white/70 font-medium pb-3">
                  Date
                </th>
                <th className="text-left text-white/70 font-medium pb-3">
                  Due Date
                </th>
                <th className="text-right text-white/70 font-medium pb-3">
                  Amount
                </th>
                <th className="text-right text-white/70 font-medium pb-3">
                  Paid
                </th>
                <th className="text-right text-white/70 font-medium pb-3">
                  Balance
                </th>
                <th className="text-center text-white/70 font-medium pb-3">
                  Status
                </th>
                <th className="text-center text-white/70 font-medium pb-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="border-b border-white/10 hover:bg-white/5"
                >
                  <td className="py-3 text-white font-medium">
                    {invoice.invoiceNumber}
                  </td>
                  <td className="py-3 text-white/80">{invoice.customerName}</td>
                  <td className="py-3 text-white/60">{invoice.date}</td>
                  <td className="py-3 text-white/60">{invoice.dueDate}</td>
                  <td className="py-3 text-right text-white font-medium">
                    {formatCurrency(invoice.amount)}
                  </td>
                  <td className="py-3 text-right text-green-300">
                    {formatCurrency(invoice.paidAmount)}
                  </td>
                  <td className="py-3 text-right text-orange-300">
                    {formatCurrency(invoice.amount - invoice.paidAmount)}
                  </td>
                  <td className="py-3 text-center">
                    <Badge className={getStatusColor(invoice.status)}>
                      {invoice.status}
                    </Badge>
                  </td>
                  <td className="py-3 text-center">
                    <div className="flex justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <Eye size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-green-400 hover:text-green-300"
                      >
                        <Send size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );

  const renderAccountsPayable = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Accounts Payable</h2>
        <div className="flex gap-3">
          <Button
            onClick={() => setShowDialog("schedule-payment")}
            variant="outline"
            className="!bg-transparent border-white/20 text-white hover:bg-white/10"
          >
            <Calendar size={16} className="mr-2" />
            Schedule Payment
          </Button>
          <Button
            onClick={() => setShowDialog("add-bill")}
            className="bg-red-600/80 hover:bg-red-700 text-white border-0"
          >
            <Plus size={16} className="mr-2" />
            Add Bill
          </Button>
        </div>
      </div>

      {/* A/P Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-red-500 to-orange-600">
              <Receipt className="text-white" size={24} />
            </div>
          </div>
          <p className="text-white/70 text-sm font-medium">Total Payable</p>
          <p className="text-2xl font-bold text-red-300 mt-1">
            {formatCurrency(outstandingPayables)}
          </p>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-orange-500 to-yellow-600">
              <Clock className="text-white" size={24} />
            </div>
          </div>
          <p className="text-white/70 text-sm font-medium">Due This Week</p>
          <p className="text-2xl font-bold text-orange-300 mt-1">₹15,000</p>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600">
              <Building className="text-white" size={24} />
            </div>
          </div>
          <p className="text-white/70 text-sm font-medium">Active Suppliers</p>
          <p className="text-2xl font-bold text-purple-300 mt-1">12</p>
        </GlassCard>
      </div>

      {/* Bills List */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Bills</h3>
          <div className="flex items-center gap-2">
            <Search className="text-white/60" size={16} />
            <Input
              placeholder="Search bills..."
              className="w-64 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left text-white/70 font-medium pb-3">
                  Bill #
                </th>
                <th className="text-left text-white/70 font-medium pb-3">
                  Supplier
                </th>
                <th className="text-left text-white/70 font-medium pb-3">
                  Date
                </th>
                <th className="text-left text-white/70 font-medium pb-3">
                  Due Date
                </th>
                <th className="text-right text-white/70 font-medium pb-3">
                  Amount
                </th>
                <th className="text-right text-white/70 font-medium pb-3">
                  Paid
                </th>
                <th className="text-right text-white/70 font-medium pb-3">
                  Balance
                </th>
                <th className="text-center text-white/70 font-medium pb-3">
                  Status
                </th>
                <th className="text-center text-white/70 font-medium pb-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill) => (
                <tr
                  key={bill.id}
                  className="border-b border-white/10 hover:bg-white/5"
                >
                  <td className="py-3 text-white font-medium">
                    {bill.billNumber}
                  </td>
                  <td className="py-3 text-white/80">{bill.supplierName}</td>
                  <td className="py-3 text-white/60">{bill.date}</td>
                  <td className="py-3 text-white/60">{bill.dueDate}</td>
                  <td className="py-3 text-right text-white font-medium">
                    {formatCurrency(bill.amount)}
                  </td>
                  <td className="py-3 text-right text-green-300">
                    {formatCurrency(bill.paidAmount)}
                  </td>
                  <td className="py-3 text-right text-red-300">
                    {formatCurrency(bill.amount - bill.paidAmount)}
                  </td>
                  <td className="py-3 text-center">
                    <Badge className={getStatusColor(bill.status)}>
                      {bill.status}
                    </Badge>
                  </td>
                  <td className="py-3 text-center">
                    <div className="flex justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <Eye size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-green-400 hover:text-green-300"
                      >
                        <CreditCard size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Financial Reports</h2>
        <Button
          onClick={() => toast.success("Reports exported successfully!")}
          className="bg-blue-600/80 hover:bg-blue-700 text-white border-0"
        >
          <Download size={16} className="mr-2" />
          Export All
        </Button>
      </div>

      {/* Report Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <GlassCard className="p-6 hover:bg-white/5 cursor-pointer transition-colors">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-teal-600">
              <TrendingUp className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-white font-semibold">Profit & Loss</h3>
              <p className="text-white/60 text-sm">Income statement report</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 hover:bg-white/5 cursor-pointer transition-colors">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
              <BarChart3 className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-white font-semibold">Balance Sheet</h3>
              <p className="text-white/60 text-sm">Financial position report</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 hover:bg-white/5 cursor-pointer transition-colors">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600">
              <IndianRupee className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-white font-semibold">Cash Flow</h3>
              <p className="text-white/60 text-sm">Cash movement report</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 hover:bg-white/5 cursor-pointer transition-colors">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-orange-500 to-red-600">
              <FileText className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-white font-semibold">General Ledger</h3>
              <p className="text-white/60 text-sm">Complete GL report</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 hover:bg-white/5 cursor-pointer transition-colors">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-600">
              <Clock className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-white font-semibold">A/R Aging</h3>
              <p className="text-white/60 text-sm">Receivables aging report</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 hover:bg-white/5 cursor-pointer transition-colors">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-red-500 to-pink-600">
              <Calendar className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-white font-semibold">A/P Aging</h3>
              <p className="text-white/60 text-sm">Payables aging report</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Sample Report */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Profit & Loss Summary
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 rounded-lg bg-green-500/10 border border-green-500/20">
            <span className="text-white font-medium">Total Revenue</span>
            <span className="text-green-300 font-bold">
              {formatCurrency(totalRevenue)}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <span className="text-white font-medium">Total Expenses</span>
            <span className="text-red-300 font-bold">
              {formatCurrency(totalExpenses)}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <span className="text-white font-bold text-lg">Net Profit</span>
            <span className="text-blue-300 font-bold text-lg">
              {formatCurrency(netProfit)}
            </span>
          </div>
        </div>
      </GlassCard>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "general-ledger":
        return renderGeneralLedger();
      case "accounts-receivable":
        return renderAccountsReceivable();
      case "accounts-payable":
        return renderAccountsPayable();
      case "reports":
        return renderReports();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Financial Management
          </h1>
          <p className="text-white/70 mt-1">
            Complete accounting and financial control
          </p>
        </div>
        <Button
          onClick={() => setShowAccountSearch(true)}
          className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white border-0"
        >
          <Search size={16} className="mr-2" />
          Search Accounts
        </Button>
      </div>

      {/* Navigation */}
      <GlassCard className="p-1">
        <div className="flex overflow-x-auto">
          {navigationTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                variant="ghost"
                className={`flex-shrink-0 px-6 py-3 rounded-lg transition-all ${
                  activeSection === tab.id
                    ? "bg-white/20 text-white"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon size={18} className="mr-2" />
                {tab.label}
              </Button>
            );
          })}
        </div>
      </GlassCard>

      {/* Content */}
      {renderContent()}

      {/* Account Search Dialog */}
      <Dialog open={showAccountSearch} onOpenChange={setShowAccountSearch}>
        <DialogContent className="!bg-gray-900/95 backdrop-blur-md border border-white/20 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Search Accounts</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60"
                size={16}
              />
              <Input
                placeholder="Search by account name, code, or type..."
                value={accountSearchQuery}
                onChange={(e) => setAccountSearchQuery(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>

            {/* Account List */}
            <div className="max-h-96 overflow-y-auto space-y-2">
              {filteredAccounts.map((account) => (
                <div
                  key={account.id}
                  onClick={() => handleAccountSelect(account)}
                  className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border border-white/10"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          account.type === "assets"
                            ? "bg-green-500/20"
                            : account.type === "liabilities"
                              ? "bg-red-500/20"
                              : account.type === "equity"
                                ? "bg-blue-500/20"
                                : account.type === "revenue"
                                  ? "bg-purple-500/20"
                                  : "bg-orange-500/20"
                        }`}
                      >
                        {account.type === "assets" && (
                          <TrendingUp className="text-green-400" size={20} />
                        )}
                        {account.type === "liabilities" && (
                          <TrendingDown className="text-red-400" size={20} />
                        )}
                        {account.type === "equity" && (
                          <PieChart className="text-blue-400" size={20} />
                        )}
                        {account.type === "revenue" && (
                          <IndianRupee className="text-purple-400" size={20} />
                        )}
                        {account.type === "expenses" && (
                          <Calculator className="text-orange-400" size={20} />
                        )}
                      </div>
                      <div>
                        <h3 className="text-white font-medium">
                          {account.name}
                        </h3>
                        <p className="text-white/60 text-sm">
                          Code: {account.code} • {account.subType}
                        </p>
                        <p className="text-white/40 text-xs capitalize">
                          {account.type}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-bold ${
                          account.balance >= 0
                            ? "text-green-300"
                            : "text-red-300"
                        }`}
                      >
                        {formatCurrency(Math.abs(account.balance))}
                      </p>
                      <p className="text-white/60 text-xs">
                        {account.balance >= 0 ? "Debit" : "Credit"}
                      </p>
                      <Badge
                        className={
                          account.isActive
                            ? "bg-green-500/20 text-green-300 mt-1"
                            : "bg-gray-500/20 text-gray-300 mt-1"
                        }
                      >
                        {account.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}

              {filteredAccounts.length === 0 && (
                <div className="text-center py-8">
                  <Search className="mx-auto text-white/40 mb-2" size={24} />
                  <p className="text-white/60">
                    No accounts found matching your search
                  </p>
                  <p className="text-white/40 text-sm mt-1">
                    Try searching by account name, code, or type
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4 border-t border-white/20">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAccountSearch(false);
                  setAccountSearchQuery("");
                }}
                className="!bg-transparent border-white/20 text-white hover:bg-white/10"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Invoice Dialog */}
      {showDialog === "create-invoice" && (
        <Dialog open={true} onOpenChange={() => setShowDialog("")}>
          <DialogContent className="!bg-gray-900/95 backdrop-blur-md border border-white/20 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white">Create Invoice</DialogTitle>
            </DialogHeader>

            <div className="space-y-6 p-6">
              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white text-sm">Customer Name *</Label>
                  <Input
                    placeholder="Enter customer name"
                    value={invoiceForm.customerName}
                    onChange={(e) =>
                      setInvoiceForm((prev) => ({
                        ...prev,
                        customerName: e.target.value,
                      }))
                    }
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
                <div>
                  <Label className="text-white text-sm">Customer Email</Label>
                  <Input
                    type="email"
                    placeholder="customer@example.com"
                    value={invoiceForm.customerEmail}
                    onChange={(e) =>
                      setInvoiceForm((prev) => ({
                        ...prev,
                        customerEmail: e.target.value,
                      }))
                    }
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
                <div>
                  <Label className="text-white text-sm">Invoice Date</Label>
                  <Input
                    type="date"
                    value={invoiceForm.invoiceDate}
                    onChange={(e) =>
                      setInvoiceForm((prev) => ({
                        ...prev,
                        invoiceDate: e.target.value,
                      }))
                    }
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white text-sm">Due Date</Label>
                  <Input
                    type="date"
                    value={invoiceForm.dueDate}
                    onChange={(e) =>
                      setInvoiceForm((prev) => ({
                        ...prev,
                        dueDate: e.target.value,
                      }))
                    }
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>

              {/* Line Items */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <Label className="text-white text-sm">Line Items *</Label>
                  <Button
                    type="button"
                    onClick={addInvoiceItem}
                    size="sm"
                    className="bg-blue-600/80 hover:bg-blue-700 text-white border-0"
                  >
                    <Plus size={14} className="mr-1" />
                    Add Item
                  </Button>
                </div>
                <div className="space-y-3">
                  {invoiceForm.items.map((item, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-12 gap-2 items-end"
                    >
                      <div className="col-span-5">
                        <Input
                          placeholder="Item description"
                          value={item.description}
                          onChange={(e) =>
                            updateInvoiceItem(
                              index,
                              "description",
                              e.target.value,
                            )
                          }
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          placeholder="Qty"
                          value={item.quantity}
                          onChange={(e) =>
                            updateInvoiceItem(
                              index,
                              "quantity",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          placeholder="Rate"
                          value={item.rate}
                          onChange={(e) =>
                            updateInvoiceItem(
                              index,
                              "rate",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          value={formatCurrency(item.amount)}
                          disabled
                          className="bg-white/5 border-white/20 text-white/80"
                        />
                      </div>
                      <div className="col-span-1">
                        {invoiceForm.items.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setInvoiceForm((prev) => ({
                                ...prev,
                                items: prev.items.filter((_, i) => i !== index),
                              }))
                            }
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 size={14} />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-2 border-t border-white/20 pt-4">
                <div className="flex justify-between">
                  <span className="text-white/70">Subtotal:</span>
                  <span className="text-white">
                    {formatCurrency(
                      invoiceForm.items.reduce(
                        (sum, item) => sum + item.amount,
                        0,
                      ),
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">
                    Tax ({invoiceForm.taxRate}%):
                  </span>
                  <span className="text-white">
                    {formatCurrency(
                      (invoiceForm.items.reduce(
                        (sum, item) => sum + item.amount,
                        0,
                      ) *
                        invoiceForm.taxRate) /
                        100,
                    )}
                  </span>
                </div>
                <div className="flex justify-between font-bold border-t border-white/20 pt-2">
                  <span className="text-white">Total:</span>
                  <span className="text-white">
                    {formatCurrency(
                      invoiceForm.items.reduce(
                        (sum, item) => sum + item.amount,
                        0,
                      ) *
                        (1 + invoiceForm.taxRate / 100),
                    )}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDialog("")}
                  className="flex-1 !bg-transparent border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateInvoice}
                  className="flex-1 bg-green-600/80 hover:bg-green-700 text-white border-0"
                >
                  Create Invoice
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Record Payment Dialog */}
      {showDialog === "record-payment" && (
        <Dialog open={true} onOpenChange={() => setShowDialog("")}>
          <DialogContent className="!bg-gray-900/95 backdrop-blur-md border border-white/20 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">Record Payment</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white text-sm">Invoice Number *</Label>
                  <Input
                    placeholder="INV-2024-xxxx"
                    value={paymentForm.invoiceNumber}
                    onChange={(e) =>
                      setPaymentForm((prev) => ({
                        ...prev,
                        invoiceNumber: e.target.value,
                      }))
                    }
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
                <div>
                  <Label className="text-white text-sm">Customer Name</Label>
                  <Input
                    placeholder="Customer name"
                    value={paymentForm.customerName}
                    onChange={(e) =>
                      setPaymentForm((prev) => ({
                        ...prev,
                        customerName: e.target.value,
                      }))
                    }
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
                <div>
                  <Label className="text-white text-sm">Payment Amount *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={paymentForm.paymentAmount}
                    onChange={(e) =>
                      setPaymentForm((prev) => ({
                        ...prev,
                        paymentAmount: e.target.value,
                      }))
                    }
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
                <div>
                  <Label className="text-white text-sm">Payment Date</Label>
                  <Input
                    type="date"
                    value={paymentForm.paymentDate}
                    onChange={(e) =>
                      setPaymentForm((prev) => ({
                        ...prev,
                        paymentDate: e.target.value,
                      }))
                    }
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white text-sm">Payment Method</Label>
                  <Select
                    value={paymentForm.paymentMethod}
                    onValueChange={(value) =>
                      setPaymentForm((prev) => ({
                        ...prev,
                        paymentMethod: value,
                      }))
                    }
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="!bg-gray-900/95 backdrop-blur-md border border-white/20 text-white">
                      <SelectItem
                        value="cash"
                        className="text-white focus:bg-white/20"
                      >
                        Cash
                      </SelectItem>
                      <SelectItem
                        value="check"
                        className="text-white focus:bg-white/20"
                      >
                        Check
                      </SelectItem>
                      <SelectItem
                        value="bank_transfer"
                        className="text-white focus:bg-white/20"
                      >
                        Bank Transfer
                      </SelectItem>
                      <SelectItem
                        value="credit_card"
                        className="text-white focus:bg-white/20"
                      >
                        Credit Card
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-white text-sm">Reference</Label>
                  <Input
                    placeholder="Transaction reference"
                    value={paymentForm.reference}
                    onChange={(e) =>
                      setPaymentForm((prev) => ({
                        ...prev,
                        reference: e.target.value,
                      }))
                    }
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
              </div>

              <div>
                <Label className="text-white text-sm">Notes</Label>
                <Textarea
                  placeholder="Payment notes..."
                  value={paymentForm.notes}
                  onChange={(e) =>
                    setPaymentForm((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 resize-none"
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDialog("")}
                  className="flex-1 !bg-transparent border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleRecordPayment}
                  className="flex-1 bg-green-600/80 hover:bg-green-700 text-white border-0"
                >
                  Record Payment
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Bill Dialog */}
      {showDialog === "add-bill" && (
        <Dialog open={true} onOpenChange={() => setShowDialog("")}>
          <DialogContent className="!bg-gray-900/95 backdrop-blur-md border border-white/20 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">Add Bill</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white text-sm">Supplier Name *</Label>
                  <Input
                    placeholder="Supplier name"
                    value={billForm.supplierName}
                    onChange={(e) =>
                      setBillForm((prev) => ({
                        ...prev,
                        supplierName: e.target.value,
                      }))
                    }
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
                <div>
                  <Label className="text-white text-sm">Supplier Email</Label>
                  <Input
                    type="email"
                    placeholder="supplier@example.com"
                    value={billForm.supplierEmail}
                    onChange={(e) =>
                      setBillForm((prev) => ({
                        ...prev,
                        supplierEmail: e.target.value,
                      }))
                    }
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
                <div>
                  <Label className="text-white text-sm">Bill Number</Label>
                  <Input
                    placeholder="BILL-2024-xxxx"
                    value={billForm.billNumber}
                    onChange={(e) =>
                      setBillForm((prev) => ({
                        ...prev,
                        billNumber: e.target.value,
                      }))
                    }
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
                <div>
                  <Label className="text-white text-sm">Amount *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={billForm.amount}
                    onChange={(e) =>
                      setBillForm((prev) => ({
                        ...prev,
                        amount: e.target.value,
                      }))
                    }
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
                <div>
                  <Label className="text-white text-sm">Bill Date</Label>
                  <Input
                    type="date"
                    value={billForm.billDate}
                    onChange={(e) =>
                      setBillForm((prev) => ({
                        ...prev,
                        billDate: e.target.value,
                      }))
                    }
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white text-sm">Due Date</Label>
                  <Input
                    type="date"
                    value={billForm.dueDate}
                    onChange={(e) =>
                      setBillForm((prev) => ({
                        ...prev,
                        dueDate: e.target.value,
                      }))
                    }
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>

              <div>
                <Label className="text-white text-sm">Category</Label>
                <Select
                  value={billForm.category}
                  onValueChange={(value) =>
                    setBillForm((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="!bg-gray-900/95 backdrop-blur-md border border-white/20 text-white">
                    <SelectItem
                      value="supplies"
                      className="text-white focus:bg-white/20"
                    >
                      Supplies
                    </SelectItem>
                    <SelectItem
                      value="utilities"
                      className="text-white focus:bg-white/20"
                    >
                      Utilities
                    </SelectItem>
                    <SelectItem
                      value="rent"
                      className="text-white focus:bg-white/20"
                    >
                      Rent
                    </SelectItem>
                    <SelectItem
                      value="professional_services"
                      className="text-white focus:bg-white/20"
                    >
                      Professional Services
                    </SelectItem>
                    <SelectItem
                      value="other"
                      className="text-white focus:bg-white/20"
                    >
                      Other
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white text-sm">Description</Label>
                <Textarea
                  placeholder="Bill description..."
                  value={billForm.description}
                  onChange={(e) =>
                    setBillForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 resize-none"
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDialog("")}
                  className="flex-1 !bg-transparent border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddBill}
                  className="flex-1 bg-red-600/80 hover:bg-red-700 text-white border-0"
                >
                  Add Bill
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Journal Entry Dialog */}
      {showDialog === "journal-entry" && (
        <Dialog open={true} onOpenChange={() => setShowDialog("")}>
          <DialogContent className="!bg-gray-900/95 backdrop-blur-md border border-white/20 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white">
                Manual Journal Entry
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-white text-sm">Date</Label>
                  <Input
                    type="date"
                    value={journalForm.date}
                    onChange={(e) =>
                      setJournalForm((prev) => ({
                        ...prev,
                        date: e.target.value,
                      }))
                    }
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white text-sm">Reference</Label>
                  <Input
                    placeholder="JE-xxxx"
                    value={journalForm.reference}
                    onChange={(e) =>
                      setJournalForm((prev) => ({
                        ...prev,
                        reference: e.target.value,
                      }))
                    }
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
                <div>
                  <Label className="text-white text-sm">Description *</Label>
                  <Input
                    placeholder="Journal entry description"
                    value={journalForm.description}
                    onChange={(e) =>
                      setJournalForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
              </div>

              {/* Journal Entries */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <Label className="text-white text-sm">Journal Entries</Label>
                  <Button
                    type="button"
                    onClick={addJournalEntry}
                    size="sm"
                    className="bg-purple-600/80 hover:bg-purple-700 text-white border-0"
                  >
                    <Plus size={14} className="mr-1" />
                    Add Entry
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-12 gap-2 text-sm text-white/70 border-b border-white/20 pb-2">
                    <div className="col-span-6">Account</div>
                    <div className="col-span-2 text-right">Debit</div>
                    <div className="col-span-2 text-right">Credit</div>
                    <div className="col-span-2 text-center">Action</div>
                  </div>

                  {journalForm.entries.map((entry, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-12 gap-2 items-center"
                    >
                      <div className="col-span-6">
                        <Select
                          value={entry.accountId}
                          onValueChange={(value) => {
                            const account = chartOfAccounts.find(
                              (a) => a.id === value,
                            );
                            updateJournalEntry(index, "accountId", value);
                            updateJournalEntry(
                              index,
                              "accountName",
                              account?.name || "",
                            );
                          }}
                        >
                          <SelectTrigger className="bg-white/10 border-white/20 text-white">
                            <SelectValue placeholder="Select account" />
                          </SelectTrigger>
                          <SelectContent className="!bg-gray-900/95 backdrop-blur-md border border-white/20 text-white">
                            {chartOfAccounts.map((account) => (
                              <SelectItem
                                key={account.id}
                                value={account.id}
                                className="text-white focus:bg-white/20"
                              >
                                {account.code} - {account.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={entry.debit || ""}
                          onChange={(e) =>
                            updateJournalEntry(
                              index,
                              "debit",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={entry.credit || ""}
                          onChange={(e) =>
                            updateJournalEntry(
                              index,
                              "credit",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        />
                      </div>
                      <div className="col-span-2 text-center">
                        {journalForm.entries.length > 2 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setJournalForm((prev) => ({
                                ...prev,
                                entries: prev.entries.filter(
                                  (_, i) => i !== index,
                                ),
                              }))
                            }
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 size={14} />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-2 border-t border-white/20 pt-4">
                <div className="flex justify-between">
                  <span className="text-white/70">Total Debit:</span>
                  <span className="text-white">
                    {formatCurrency(
                      journalForm.entries.reduce(
                        (sum, entry) => sum + entry.debit,
                        0,
                      ),
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Total Credit:</span>
                  <span className="text-white">
                    {formatCurrency(
                      journalForm.entries.reduce(
                        (sum, entry) => sum + entry.credit,
                        0,
                      ),
                    )}
                  </span>
                </div>
                <div className="flex justify-between font-bold border-t border-white/20 pt-2">
                  <span className="text-white">Difference:</span>
                  <span
                    className={`${Math.abs(journalForm.entries.reduce((sum, entry) => sum + entry.debit, 0) - journalForm.entries.reduce((sum, entry) => sum + entry.credit, 0)) < 0.01 ? "text-green-300" : "text-red-300"}`}
                  >
                    {formatCurrency(
                      Math.abs(
                        journalForm.entries.reduce(
                          (sum, entry) => sum + entry.debit,
                          0,
                        ) -
                          journalForm.entries.reduce(
                            (sum, entry) => sum + entry.credit,
                            0,
                          ),
                      ),
                    )}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDialog("")}
                  className="flex-1 !bg-transparent border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleJournalEntry}
                  className="flex-1 bg-purple-600/80 hover:bg-purple-700 text-white border-0"
                >
                  Post Journal Entry
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
