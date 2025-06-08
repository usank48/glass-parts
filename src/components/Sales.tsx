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
import { useInventorySync, InventoryItem } from "@/hooks/useInventorySync";
import { formatInventoryValue } from "@/utils/inventoryManager";
import { toast } from "sonner";
import { ProductDetailDialog } from "./dialogs/ProductDetailDialog";

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
  const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(
    null,
  );
  const [showProductDetail, setShowProductDetail] = useState(false);

  // Use inventory sync hook for real-time inventory management
  const {
    inventory,
    stockAlerts,
    processSale,
    getItemById,
    getLowStockItems,
    isLoading,
    transactions,
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
    <div className="space-y-4 sm:space-y-6">
      {/* Low Stock Alert */}
      {getLowStockItems().length > 0 && (
        <GlassCard className="p-4 border-l-4 border-l-yellow-500">
          <div className="flex items-start gap-3">
            <AlertTriangle
              className="text-yellow-400 flex-shrink-0 mt-1"
              size={20}
            />
            <div className="flex-1">
              <h3 className="text-white font-semibold text-sm mb-1">
                Low Stock Alert
              </h3>
              <p className="text-white/70 text-xs">
                {getLowStockItems().length} items are running low on stock.
                Check inventory before making sales.
              </p>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Sales Management
          </h1>
          <div className="flex items-center gap-4 mt-1">
            <p className="text-white/70 text-sm sm:text-base">
              Track and manage your sales with real-time inventory
            </p>
            {isLoading && (
              <div className="flex items-center gap-2 text-blue-400">
                <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs">Syncing...</span>
              </div>
            )}
          </div>
        </div>
        <Button
          onClick={() => setShowNewSale(true)}
          className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white border-0 w-full sm:w-auto"
        >
          <Plus size={20} className="mr-2" />
          New Sale
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <GlassCard key={index} className="p-4 sm:p-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div
                  className={`p-2 sm:p-3 rounded-lg bg-gradient-to-r ${stat.color} flex-shrink-0`}
                >
                  <Icon className="text-white" size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white/70 text-xs sm:text-sm">
                    {stat.title}
                  </p>
                  <p
                    className="text-lg sm:text-2xl font-bold text-white truncate"
                    title={stat.value}
                  >
                    {stat.value}
                  </p>
                  <p className="text-green-400 text-xs sm:text-sm">
                    {stat.change}
                  </p>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Sales Status Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlassCard className="p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600">
              <ShoppingCart className="text-white" size={18} />
            </div>
            <div>
              <p className="text-white/70 text-xs sm:text-sm">
                Completed Sales
              </p>
              <p className="text-lg sm:text-xl font-bold text-white">
                {completedSales}
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-600">
              <Package className="text-white" size={18} />
            </div>
            <div>
              <p className="text-white/70 text-xs sm:text-sm">Pending Sales</p>
              <p className="text-lg sm:text-xl font-bold text-white">
                {pendingSales}
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600">
              <AlertTriangle className="text-white" size={18} />
            </div>
            <div>
              <p className="text-white/70 text-xs sm:text-sm">
                Low Stock Items
              </p>
              <p className="text-lg sm:text-xl font-bold text-white">
                {getLowStockItems().length}
              </p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Recent Sales */}
      <GlassCard className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-white">
            Recent Sales
          </h2>
          <Button
            variant="outline"
            size="sm"
            className="!bg-transparent border-white/20 text-white hover:bg-white/10 text-xs sm:text-sm"
          >
            View All
          </Button>
        </div>
        <div className="space-y-3 sm:space-y-4">
          {salesData.map((sale) => (
            <div
              key={sale.id}
              className="p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-medium text-sm sm:text-base">
                      {sale.customerName}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        sale.status === "completed"
                          ? "bg-green-500/20 text-green-300"
                          : sale.status === "pending"
                            ? "bg-yellow-500/20 text-yellow-300"
                            : "bg-blue-500/20 text-blue-300"
                      }`}
                    >
                      {sale.status.charAt(0).toUpperCase() +
                        sale.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-white/70 text-xs sm:text-sm mb-1">
                    {sale.items.map((item) => item.itemName).join(", ")}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-white/50">
                    <span>{sale.date}</span>
                    <span>•</span>
                    <span>{sale.paymentMethod}</span>
                    <span>•</span>
                    <span>
                      {sale.items.length} item
                      {sale.items.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="text-right">
                    <p className="text-white font-semibold text-sm sm:text-base">
                      {formatInventoryValue(sale.total)}
                    </p>
                  </div>
                  <div className="flex gap-1 sm:gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="!bg-transparent border-white/20 text-white hover:bg-white/10 p-2 h-auto"
                      onClick={() => {
                        setSelectedSale(sale);
                        setShowSaleDetail(true);
                      }}
                    >
                      <Eye size={14} />
                    </Button>
                    {sale.status === "pending" && (
                      <Button
                        size="sm"
                        onClick={() => handleCompleteSale(sale)}
                        className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white border-0 px-3 h-auto text-xs"
                      >
                        Complete
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {salesData.length === 0 && (
          <div className="text-center py-8">
            <ShoppingCart className="mx-auto text-white/50 mb-4" size={48} />
            <h3 className="text-white text-lg font-semibold mb-2">
              No sales yet
            </h3>
            <p className="text-white/70 mb-4">
              Start making sales to see them here
            </p>
            <Button
              onClick={() => setShowNewSale(true)}
              className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white border-0"
            >
              <Plus size={16} className="mr-2" />
              Create First Sale
            </Button>
          </div>
        )}
      </GlassCard>
    </div>
  );
};
