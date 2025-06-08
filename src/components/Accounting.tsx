import React from "react";
import { TrendingUp, TrendingDown, IndianRupee, PieChart } from "lucide-react";
import { GlassCard } from "./GlassCard";

export const Accounting = () => {
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

  const recentTransactions = [
    {
      type: "Sale",
      description: "Invoice #INV-2024-0156",
      amount: 12459.99,
      date: "2024-01-15",
    },
    {
      type: "Purchase",
      description: "Supplier Payment - AutoMax",
      amount: -24500.0,
      date: "2024-01-14",
    },
    {
      type: "Sale",
      description: "Invoice #INV-2024-0155",
      amount: 8925.5,
      date: "2024-01-14",
    },
    {
      type: "Expense",
      description: "Office Rent",
      amount: -12000.0,
      date: "2024-01-13",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Accounting & Finance
          </h1>
          <p className="text-white/70 mt-1">Track your financial performance</p>
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
              <p className="text-white/70 text-sm font-medium">{stat.title}</p>
              <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
            </GlassCard>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Recent Transactions
          </h2>
          <div className="space-y-4">
            {recentTransactions.map((transaction, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-white/5"
              >
                <div>
                  <p className="text-white font-medium">
                    {transaction.description}
                  </p>
                  <p className="text-white/70 text-sm">
                    {transaction.type} • {transaction.date}
                  </p>
                </div>
                <span
                  className={`font-bold ${
                    transaction.amount > 0 ? "text-green-300" : "text-red-300"
                  }`}
                >
                  ₹{Math.abs(transaction.amount).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Monthly Summary */}
        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            This Month Summary
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
              <span className="text-white/70">Total Sales</span>
              <span className="text-white font-bold">₹4,52,300</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
              <span className="text-white/70">Total Purchases</span>
              <span className="text-white font-bold">₹1,84,500</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
              <span className="text-white/70">Operating Expenses</span>
              <span className="text-white font-bold">₹1,00,000</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-green-500/20 border border-green-500/30">
              <span className="text-green-300 font-medium">Net Profit</span>
              <span className="text-green-300 font-bold text-lg">
                ₹1,67,800
              </span>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
