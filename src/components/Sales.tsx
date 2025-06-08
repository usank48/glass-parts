import React, { useState } from "react";
import {
  ShoppingCart,
  TrendingUp,
  IndianRupee,
  Users,
  Plus,
  Eye,
  Package,
  AlertTriangle,
} from "lucide-react";
import { GlassCard } from "./GlassCard";
import { Button } from "@/components/ui/button";
import { useInventorySync } from "@/hooks/useInventorySync";
import { formatInventoryValue } from "@/utils/inventoryManager";
import { toast } from "sonner";

interface Sale {
  id: string;
  customerName: string;
  customerPhone: string;
  items: Array<{
    itemId: number;
    partNumber: string;
    itemName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  total: number;
  date: string;
  status: "completed" | "pending" | "processing";
  paymentMethod: string;
}

export const Sales = () => {
  const [showNewSale, setShowNewSale] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [showSaleDetail, setShowSaleDetail] = useState(false);

  // Use inventory sync hook for real-time inventory management
  const {
    inventory,
    stockAlerts,
    processSale,
    getItemById,
    getLowStockItems,
    isLoading,
  } = useInventorySync();

  // Sample sales data with inventory integration
  const [salesData, setSalesData] = useState<Sale[]>([
    {
      id: "SALE-2024-001",
      customerName: "John Smith",
      customerPhone: "+91 98765 43210",
      items: [
        {
          itemId: 1,
          partNumber: "BP-BMW-X5-2020",
          itemName: "Premium Brake Pad Set",
          quantity: 2,
          unitPrice: 129.99,
          totalPrice: 259.98,
        },
        {
          itemId: 2,
          partNumber: "BP-TOY-CAM-2019",
          itemName: "Ceramic Brake Pads",
          quantity: 1,
          unitPrice: 95.99,
          totalPrice: 95.99,
        },
      ],
      total: 355.97,
      date: "2024-01-15",
      status: "completed",
      paymentMethod: "Cash",
    },
    {
      id: "SALE-2024-002",
      customerName: "Sarah Johnson",
      customerPhone: "+91 87654 32109",
      items: [
        {
          itemId: 4,
          partNumber: "SUS-BMW-X5-2020",
          itemName: "Air Suspension Strut",
          quantity: 1,
          unitPrice: 449.99,
          totalPrice: 449.99,
        },
      ],
      total: 449.99,
      date: "2024-01-15",
      status: "pending",
      paymentMethod: "Card",
    },
    {
      id: "SALE-2024-003",
      customerName: "Mike Wilson",
      customerPhone: "+91 76543 21098",
      items: [
        {
          itemId: 3,
          partNumber: "BP-HON-CIV-2021",
          itemName: "Sport Brake Pads",
          quantity: 4,
          unitPrice: 159.99,
          totalPrice: 639.96,
        },
      ],
      total: 639.96,
      date: "2024-01-14",
      status: "completed",
      paymentMethod: "UPI",
    },
  ]);

  // Process a sale and update inventory
  const handleCompleteSale = async (sale: Sale) => {
    try {
      const success = await processSale(
        sale.id,
        sale.items.map((item) => ({
          itemId: item.itemId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
        sale.customerName,
      );

      if (success) {
        // Update sale status
        setSalesData((prevSales) =>
          prevSales.map((s) =>
            s.id === sale.id ? { ...s, status: "completed" as const } : s,
          ),
        );
        toast.success(`Sale ${sale.id} completed and inventory updated`);
      }
    } catch (error) {
      toast.error("Failed to complete sale");
    }
  };

  // Calculate dynamic stats based on actual sales data
  const todaysSales = salesData
    .filter((sale) => sale.date === new Date().toISOString().split("T")[0])
    .reduce((sum, sale) => sum + sale.total, 0);

  const totalOrders = salesData.length;
  const uniqueCustomers = new Set(salesData.map((sale) => sale.customerName))
    .size;
  const totalRevenue = salesData.reduce((sum, sale) => sum + sale.total, 0);
  const completedSales = salesData.filter(
    (sale) => sale.status === "completed",
  ).length;
  const pendingSales = salesData.filter(
    (sale) => sale.status === "pending",
  ).length;

  const stats = [
    {
      title: "Today's Sales",
      value: formatInventoryValue(todaysSales),
      icon: IndianRupee,
      change: "+12%",
      color: "from-green-500 to-teal-600",
    },
    {
      title: "Total Orders",
      value: totalOrders.toString(),
      icon: ShoppingCart,
      change: "+8%",
      color: "from-blue-500 to-purple-600",
    },
    {
      title: "Customers",
      value: uniqueCustomers.toString(),
      icon: Users,
      change: "+5%",
      color: "from-purple-500 to-pink-600",
    },
    {
      title: "Total Revenue",
      value: formatInventoryValue(totalRevenue, true),
      icon: TrendingUp,
      change: "+15%",
      color: "from-orange-500 to-red-600",
    },
  ];

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Sales Management</h1>
          <p className="text-white/70 mt-1">Track and manage your sales</p>
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
                  <p className="text-green-400 text-sm">{stat.change}</p>
                </div>
                <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Recent Sales */}
      <GlassCard className="p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Recent Sales</h2>
        <div className="space-y-4">
          {salesData.map((sale) => (
            <div
              key={sale.id}
              className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
            >
              <div>
                <h3 className="text-white font-medium">{sale.customerName}</h3>
                <p className="text-white/70 text-sm">{sale.items}</p>
                <p className="text-white/50 text-xs">{sale.date}</p>
              </div>
              <div className="text-right">
                <p className="text-white font-semibold">₹{sale.total}</p>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    sale.status === "Completed"
                      ? "bg-green-500/20 text-green-300"
                      : "bg-yellow-500/20 text-yellow-300"
                  }`}
                >
                  {sale.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};
