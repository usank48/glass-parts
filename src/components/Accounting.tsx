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
import { toast } from "sonner";

interface Party {
  id: string;
  name: string;
  type: "customer" | "supplier";
  email: string;
  phone: string;
  balance: number;
  pending: number;
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  type: "debit" | "credit";
  amount: number;
  reference?: string;
  status: "completed" | "pending";
}

interface AccountStatement {
  partyId: string;
  transactions: Transaction[];
  openingBalance: number;
  closingBalance: number;
  totalPending: number;
}

export const Accounting = () => {
  const [selectedParty, setSelectedParty] = useState<string>("");
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [transactionForm, setTransactionForm] = useState({
    description: "",
    type: "debit" as "debit" | "credit",
    amount: "",
    reference: "",
    status: "completed" as "completed" | "pending",
    date: new Date().toISOString().split("T")[0],
  });

  const financialStats = [
    {
      title: "Total Revenue",
      value: "₹4,52,300",
      change: "+12.5%",
      icon: TrendingUp,
      positive: true,
    },
    {
      title: "Total Expenses",
      value: "₹2,84,500",
      change: "+8.2%",
      icon: TrendingDown,
      positive: false,
    },
    {
      title: "Net Profit",
      value: "₹1,67,800",
      change: "+18.7%",
      icon: IndianRupee,
      positive: true,
    },
    {
      title: "Profit Margin",
      value: "37.1%",
      change: "+2.3%",
      icon: PieChart,
      positive: true,
    },
  ];

  const parties: Party[] = [
    {
      id: "cust001",
      name: "Johnson Auto Repair",
      type: "customer",
      email: "contact@johnsonrepair.com",
      phone: "+1-555-0123",
      balance: 125000,
      pending: 25000,
    },
    {
      id: "cust002",
      name: "City Motors Ltd",
      type: "customer",
      email: "billing@citymotors.com",
      phone: "+1-555-0456",
      balance: 75000,
      pending: 0,
    },
    {
      id: "supp001",
      name: "AutoMax Suppliers",
      type: "supplier",
      email: "accounts@automax.com",
      phone: "+1-555-0789",
      balance: -85000,
      pending: 15000,
    },
    {
      id: "supp002",
      name: "Global Parts Inc",
      type: "supplier",
      email: "finance@globalparts.com",
      phone: "+1-555-0321",
      balance: -45000,
      pending: 8000,
    },
  ];

  const [accountStatements, setAccountStatements] = useState<
    Record<string, AccountStatement>
  >({
    cust001: {
      partyId: "cust001",
      openingBalance: 100000,
      closingBalance: 125000,
      totalPending: 25000,
      transactions: [
        {
          id: "txn001",
          date: "2024-01-15",
          description: "Invoice #INV-2024-0156 - Brake Parts",
          type: "debit",
          amount: 45000,
          reference: "INV-2024-0156",
          status: "completed",
        },
        {
          id: "txn002",
          date: "2024-01-12",
          description: "Payment Received",
          type: "credit",
          amount: 20000,
          reference: "PAY-001",
          status: "completed",
        },
        {
          id: "txn003",
          date: "2024-01-10",
          description: "Invoice #INV-2024-0145 - Engine Components",
          type: "debit",
          amount: 25000,
          reference: "INV-2024-0145",
          status: "pending",
        },
      ],
    },
    supp001: {
      partyId: "supp001",
      openingBalance: -70000,
      closingBalance: -85000,
      totalPending: 15000,
      transactions: [
        {
          id: "txn004",
          date: "2024-01-14",
          description: "Purchase Order #PO-2024-0089",
          type: "credit",
          amount: 30000,
          reference: "PO-2024-0089",
          status: "completed",
        },
        {
          id: "txn005",
          date: "2024-01-08",
          description: "Payment Made",
          type: "debit",
          amount: 15000,
          reference: "PAY-002",
          status: "completed",
        },
        {
          id: "txn006",
          date: "2024-01-16",
          description: "Purchase Order #PO-2024-0091",
          type: "credit",
          amount: 15000,
          reference: "PO-2024-0091",
          status: "pending",
        },
      ],
    },
  });

  const selectedPartyData = parties.find((p) => p.id === selectedParty);
  const selectedStatement = selectedParty
    ? accountStatements[selectedParty]
    : null;

  const handleAddTransaction = () => {
    if (
      !selectedParty ||
      !transactionForm.description ||
      !transactionForm.amount
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    const newTransaction: Transaction = {
      id: `txn${Date.now()}`,
      date: transactionForm.date,
      description: transactionForm.description,
      type: transactionForm.type,
      amount: parseFloat(transactionForm.amount),
      reference: transactionForm.reference || undefined,
      status: transactionForm.status,
    };

    setAccountStatements((prev) => ({
      ...prev,
      [selectedParty]: {
        ...prev[selectedParty],
        transactions: [
          newTransaction,
          ...(prev[selectedParty]?.transactions || []),
        ],
      },
    }));

    setTransactionForm({
      description: "",
      type: "debit",
      amount: "",
      reference: "",
      status: "completed",
      date: new Date().toISOString().split("T")[0],
    });
    setShowAddTransaction(false);
    toast.success("Transaction added successfully");
  };

  const handleDeleteTransaction = (transactionId: string) => {
    if (!selectedParty) return;

    setAccountStatements((prev) => ({
      ...prev,
      [selectedParty]: {
        ...prev[selectedParty],
        transactions: prev[selectedParty].transactions.filter(
          (t) => t.id !== transactionId,
        ),
      },
    }));
    toast.success("Transaction deleted successfully");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!selectedParty) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Accounting & Finance
            </h1>
            <p className="text-white/70 mt-1">
              Track your financial performance
            </p>
          </div>
        </div>

        {/* Financial Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {financialStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <GlassCard key={index} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-3 rounded-lg bg-gradient-to-r ${
                      stat.positive
                        ? "from-green-500 to-teal-600"
                        : "from-red-500 to-orange-600"
                    }`}
                  >
                    <Icon className="text-white" size={24} />
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      stat.positive ? "text-green-300" : "text-red-300"
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
                <p className="text-white/70 text-sm font-medium">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-white mt-1">
                  {stat.value}
                </p>
              </GlassCard>
            );
          })}
        </div>

        {/* Party Selection */}
        <GlassCard className="p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-white mb-4">
              Select Party Account
            </h2>
            <p className="text-white/70 mb-6">
              Choose a customer or supplier to view their account statement
            </p>

            <div className="max-w-md mx-auto">
              <Select value={selectedParty} onValueChange={setSelectedParty}>
                <SelectTrigger className="!bg-white/10 border-white/20 text-white h-12">
                  <SelectValue placeholder="Select a party to view account" />
                </SelectTrigger>
                <SelectContent className="!bg-gray-900/95 backdrop-blur-md border border-white/20 text-white">
                  {parties.map((party) => (
                    <SelectItem
                      key={party.id}
                      value={party.id}
                      className="text-white focus:bg-white/20 hover:bg-white/10"
                    >
                      <div className="flex items-center gap-3">
                        {party.type === "customer" ? (
                          <User className="text-blue-400" size={16} />
                        ) : (
                          <Building className="text-orange-400" size={16} />
                        )}
                        <div className="text-left">
                          <div className="font-medium">{party.name}</div>
                          <div className="text-xs text-white/60">
                            {party.type === "customer"
                              ? "Customer"
                              : "Supplier"}{" "}
                            • Balance: {formatCurrency(Math.abs(party.balance))}
                            {party.balance >= 0 ? " (Dr)" : " (Cr)"}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </GlassCard>

        {/* Parties Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <User className="text-blue-400" size={20} />
              Customer Accounts
            </h3>
            <div className="space-y-3">
              {parties
                .filter((p) => p.type === "customer")
                .map((party) => (
                  <div
                    key={party.id}
                    className="flex justify-between items-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                    onClick={() => setSelectedParty(party.id)}
                  >
                    <div>
                      <p className="text-white font-medium">{party.name}</p>
                      {party.pending > 0 && (
                        <p className="text-orange-300 text-sm">
                          Pending: {formatCurrency(party.pending)}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-green-300 font-bold">
                        {formatCurrency(party.balance)}
                      </span>
                      <p className="text-white/60 text-xs">Outstanding</p>
                    </div>
                  </div>
                ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Building className="text-orange-400" size={20} />
              Supplier Accounts
            </h3>
            <div className="space-y-3">
              {parties
                .filter((p) => p.type === "supplier")
                .map((party) => (
                  <div
                    key={party.id}
                    className="flex justify-between items-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                    onClick={() => setSelectedParty(party.id)}
                  >
                    <div>
                      <p className="text-white font-medium">{party.name}</p>
                      {party.pending > 0 && (
                        <p className="text-orange-300 text-sm">
                          Pending: {formatCurrency(party.pending)}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-red-300 font-bold">
                        {formatCurrency(Math.abs(party.balance))}
                      </span>
                      <p className="text-white/60 text-xs">Payable</p>
                    </div>
                  </div>
                ))}
            </div>
          </GlassCard>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Party Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setSelectedParty("")}
            className="!bg-transparent border-white/20 text-white hover:bg-white/10"
          >
            ← Back to Overview
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              {selectedPartyData?.type === "customer" ? (
                <User className="text-blue-400" size={24} />
              ) : (
                <Building className="text-orange-400" size={24} />
              )}
              {selectedPartyData?.name}
            </h1>
            <p className="text-white/70 text-sm">
              {selectedPartyData?.type === "customer" ? "Customer" : "Supplier"}{" "}
              Account Statement
            </p>
          </div>
        </div>
        <Button
          onClick={() => setShowAddTransaction(true)}
          className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white border-0"
        >
          <Plus size={16} className="mr-2" />
          Add Transaction
        </Button>
      </div>

      {/* Account Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
              <IndianRupee className="text-white" size={24} />
            </div>
          </div>
          <p className="text-white/70 text-sm font-medium">Current Balance</p>
          <p
            className={`text-2xl font-bold mt-1 ${selectedPartyData?.balance >= 0 ? "text-green-300" : "text-red-300"}`}
          >
            {formatCurrency(Math.abs(selectedPartyData?.balance || 0))}
          </p>
          <p className="text-white/60 text-xs mt-1">
            {selectedPartyData?.balance >= 0 ? "Receivable" : "Payable"}
          </p>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-orange-500 to-red-600">
              <Calendar className="text-white" size={24} />
            </div>
          </div>
          <p className="text-white/70 text-sm font-medium">Pending Amount</p>
          <p className="text-2xl font-bold text-orange-300 mt-1">
            {formatCurrency(selectedStatement?.totalPending || 0)}
          </p>
          <p className="text-white/60 text-xs mt-1">Awaiting clearance</p>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600">
              <TrendingUp className="text-white" size={24} />
            </div>
          </div>
          <p className="text-white/70 text-sm font-medium">
            Total Transactions
          </p>
          <p className="text-2xl font-bold text-white mt-1">
            {selectedStatement?.transactions.length || 0}
          </p>
          <p className="text-white/60 text-xs mt-1">This period</p>
        </GlassCard>
      </div>

      {/* Account Statement */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">
            Account Statement
          </h2>
          <div className="flex items-center gap-2">
            <Filter className="text-white/60" size={16} />
            <span className="text-white/60 text-sm">Last 30 days</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left text-white/70 font-medium pb-3">
                  Date
                </th>
                <th className="text-left text-white/70 font-medium pb-3">
                  Description
                </th>
                <th className="text-left text-white/70 font-medium pb-3">
                  Reference
                </th>
                <th className="text-right text-white/70 font-medium pb-3">
                  Debit
                </th>
                <th className="text-right text-white/70 font-medium pb-3">
                  Credit
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
              {selectedStatement?.transactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="border-b border-white/10 hover:bg-white/5 transition-colors"
                >
                  <td className="py-3 text-white/80 text-sm">
                    {transaction.date}
                  </td>
                  <td className="py-3 text-white font-medium">
                    {transaction.description}
                  </td>
                  <td className="py-3 text-white/60 text-sm">
                    {transaction.reference || "-"}
                  </td>
                  <td className="py-3 text-right text-red-300 font-medium">
                    {transaction.type === "debit"
                      ? formatCurrency(transaction.amount)
                      : "-"}
                  </td>
                  <td className="py-3 text-right text-green-300 font-medium">
                    {transaction.type === "credit"
                      ? formatCurrency(transaction.amount)
                      : "-"}
                  </td>
                  <td className="py-3 text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.status === "completed"
                          ? "bg-green-500/20 text-green-300"
                          : "bg-orange-500/20 text-orange-300"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                  <td className="py-3 text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTransaction(transaction.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Add Transaction Dialog */}
      <Dialog open={showAddTransaction} onOpenChange={setShowAddTransaction}>
        <DialogContent className="!bg-gray-900/95 backdrop-blur-md border border-white/20 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">
              Add New Transaction
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="text-white text-sm">Date</Label>
              <Input
                type="date"
                value={transactionForm.date}
                onChange={(e) =>
                  setTransactionForm((prev) => ({
                    ...prev,
                    date: e.target.value,
                  }))
                }
                className="bg-white/10 border-white/20 text-white"
              />
            </div>

            <div>
              <Label className="text-white text-sm">Description *</Label>
              <Input
                placeholder="Enter transaction description"
                value={transactionForm.description}
                onChange={(e) =>
                  setTransactionForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white text-sm">Type</Label>
                <Select
                  value={transactionForm.type}
                  onValueChange={(value: "debit" | "credit") =>
                    setTransactionForm((prev) => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="!bg-gray-900/95 backdrop-blur-md border border-white/20 text-white">
                    <SelectItem
                      value="debit"
                      className="text-white focus:bg-white/20"
                    >
                      Debit
                    </SelectItem>
                    <SelectItem
                      value="credit"
                      className="text-white focus:bg-white/20"
                    >
                      Credit
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white text-sm">Amount *</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={transactionForm.amount}
                  onChange={(e) =>
                    setTransactionForm((prev) => ({
                      ...prev,
                      amount: e.target.value,
                    }))
                  }
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
            </div>

            <div>
              <Label className="text-white text-sm">Reference</Label>
              <Input
                placeholder="Invoice #, PO #, etc."
                value={transactionForm.reference}
                onChange={(e) =>
                  setTransactionForm((prev) => ({
                    ...prev,
                    reference: e.target.value,
                  }))
                }
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>

            <div>
              <Label className="text-white text-sm">Status</Label>
              <Select
                value={transactionForm.status}
                onValueChange={(value: "completed" | "pending") =>
                  setTransactionForm((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="!bg-gray-900/95 backdrop-blur-md border border-white/20 text-white">
                  <SelectItem
                    value="completed"
                    className="text-white focus:bg-white/20"
                  >
                    Completed
                  </SelectItem>
                  <SelectItem
                    value="pending"
                    className="text-white focus:bg-white/20"
                  >
                    Pending
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowAddTransaction(false)}
                className="flex-1 !bg-transparent border-white/20 text-white hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddTransaction}
                className="flex-1 bg-green-600/80 hover:bg-green-700 text-white border-0"
              >
                Add Transaction
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
