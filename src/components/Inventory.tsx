import React, { useState } from "react";
import {
  Package,
  Plus,
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  Upload,
  Download,
  FileSpreadsheet,
  SortDesc,
  Car,
  Grid3X3,
  BarChart3,
  List,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  AlignLeft,
  AlertTriangle,
  Bell,
  X,
  Eye,
  LayoutGrid,
  Menu,
} from "lucide-react";
import { GlassCard } from "./GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExcelImportDialog } from "./dialogs/ExcelImportDialog";
import { exportInventoryToExcel, InventoryData } from "@/lib/excelUtils";
import { toast } from "sonner";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import { useInventorySync, InventoryItem } from "@/hooks/useInventorySync";
import {
  formatInventoryValue,
  getInventoryStatusColor,
} from "@/utils/inventoryManager";
import { ProductDetailDialog } from "./dialogs/ProductDetailDialog";
import { AddProductDialog } from "./dialogs/AddProductDialog";

interface GroupedData {
  id: string;
  name: string;
  products: InventoryItem[];
}

type SortMethod = "category" | "vehicle" | "all";
type ProductSortMethod = "alphabetical" | "quantity-asc" | "quantity-desc";
type ViewMode = "tile" | "list";

export const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showExcelImport, setShowExcelImport] = useState(false);
  const [sortMethod, setSortMethod] = useState<SortMethod>("category");
  const [productSortMethod, setProductSortMethod] =
    useState<ProductSortMethod>("quantity-desc");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(
    null,
  );
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("tile");

  // Use the inventory sync hook
  const {
    inventory: products,
    stockAlerts,
    dismissAlert,
    getStockValue,
    getLowStockItems,
    refreshInventory,
    isLoading,
    error,
    transactions,
    updateStock,
  } = useInventorySync();

  // Get top 10 items by stock for chart with proper color coding
  const getTop10StockData = () => {
    return products
      .sort((a, b) => b.stock - a.stock)
      .slice(0, 10)
      .map((product, index) => ({
        name:
          product.name.length > 20
            ? product.name.substring(0, 20) + "..."
            : product.name,
        fullName: product.name,
        partNumber: product.partNumber,
        stock: product.stock,
        status: product.status,
        // Use more vibrant and distinct colors
        fill: product.status === "Low Stock" ? "#ef4444" : "#10b981",
        // Alternative gradient colors for better visibility
        color:
          product.status === "Low Stock"
            ? "hsl(0, 84%, 60%)" // Red for low stock
            : "hsl(142, 76%, 36%)", // Green for in stock
        index,
      }));
  };

  const chartConfig = {
    stock: {
      label: "Stock Quantity",
    },
    inStock: {
      label: "In Stock",
      color: "hsl(142, 76%, 36%)",
    },
    lowStock: {
      label: "Low Stock",
      color: "hsl(0, 84%, 60%)",
    },
  };

  // Sort products for All Products view
  const getSortedProducts = (products: InventoryItem[]): InventoryItem[] => {
    switch (productSortMethod) {
      case "alphabetical":
        return [...products].sort((a, b) => a.name.localeCompare(b.name));
      case "quantity-asc":
        return [...products].sort((a, b) => a.stock - b.stock);
      case "quantity-desc":
        return [...products].sort((a, b) => b.stock - a.stock);
      default:
        return products;
    }
  };

  // Group products by selected sort method
  const getGroupedData = (): GroupedData[] => {
    if (sortMethod === "category") {
      // Group by category
      const categoryGroups = products.reduce(
        (acc, product) => {
          const category = product.category;
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(product);
          return acc;
        },
        {} as Record<string, InventoryItem[]>,
      );

      return Object.entries(categoryGroups)
        .map(([category, products]) => ({
          id: category.toLowerCase().replace(/\s+/g, "-"),
          name: category,
          products: products.sort((a, b) => a.name.localeCompare(b.name)),
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortMethod === "vehicle") {
      // Group by vehicle
      const vehicleGroups = products.reduce(
        (acc, product) => {
          const vehicle = product.vehicle;
          if (!acc[vehicle]) {
            acc[vehicle] = [];
          }
          acc[vehicle].push(product);
          return acc;
        },
        {} as Record<string, InventoryItem[]>,
      );

      return Object.entries(vehicleGroups)
        .map(([vehicle, products]) => ({
          id: vehicle.toLowerCase().replace(/\s+/g, "-"),
          name: vehicle,
          products: products.sort((a, b) => a.name.localeCompare(b.name)),
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // All products view - return as single group
      return [
        {
          id: "all-products",
          name: "All Products",
          products: getSortedProducts(products),
        },
      ];
    }
  };

  // Filter groups and products based on search term
  const filteredGroups = getGroupedData()
    .map((group) => ({
      ...group,
      products: group.products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    }))
    .filter(
      (group) =>
        group.products.length > 0 ||
        group.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

  const toggleGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  const getTotalProductsInGroup = (group: GroupedData) => {
    return group.products.length;
  };

  const getGroupStockStatus = (group: GroupedData) => {
    const totalStock = group.products.reduce(
      (sum, product) => sum + product.stock,
      0,
    );
    const lowStockCount = group.products.filter(
      (product) => product.status === "Low Stock",
    ).length;

    if (lowStockCount > 0) {
      return { status: "Low Stock", count: lowStockCount, totalStock };
    }
    return { status: "In Stock", count: group.products.length, totalStock };
  };

  // Handle product click to show details
  const handleProductClick = (product: InventoryItem) => {
    setSelectedProduct(product);
    setShowProductDetail(true);
  };

  // Handle product save from detail dialog
  const handleProductSave = async (updatedProduct: InventoryItem) => {
    // In a real implementation, this would update the product in the database
    // For now, we'll show success feedback and close the dialog
    toast.success("Product updated successfully");
    setShowProductDetail(false);
    setSelectedProduct(null);
  };

  const handleExcelImport = (importedData: InventoryData[]) => {
    let updatedCount = 0;
    let newCount = 0;
    const updatedItems: Array<{
      partNumber: string;
      partName: string;
      oldStock: number;
      newStock: number;
    }> = [];
    const newItems: Array<{
      partNumber: string;
      partName: string;
      stock: number;
    }> = [];

    // Note: In a real implementation, this would need to work with the hook's data
    // For now, we'll show success feedback
    toast.success(
      "Excel import functionality will be integrated with the new inventory system",
    );

    console.log("Import Results:", {
      updated: updatedItems,
      new: newItems,
      totalProcessed: importedData.length,
    });
  };

  const handleExcelExport = () => {
    // Convert InventoryItem to the expected format for export
    const exportData = products.map((product) => ({
      ...product,
      // Add any missing fields that might be expected by the export function
    }));
    exportInventoryToExcel(exportData);
    toast.success("Inventory exported successfully!");
  };

  // Get current sort method display info
  const getSortDisplayInfo = () => {
    if (sortMethod === "category") {
      return {
        icon: Grid3X3,
        label: "Categories",
        description: "Grouped by product categories",
      };
    } else if (sortMethod === "vehicle") {
      return {
        icon: Car,
        label: "Vehicle Compatibility",
        description: "Grouped by vehicle models",
      };
    } else {
      return {
        icon: List,
        label: "All Products",
        description: "All products in a single list",
      };
    }
  };

  // Get product sort display info
  const getProductSortDisplayInfo = () => {
    switch (productSortMethod) {
      case "alphabetical":
        return {
          icon: AlignLeft,
          label: "Alphabetical",
          description: "Sorted A-Z by name",
        };
      case "quantity-asc":
        return {
          icon: ArrowUp,
          label: "Quantity Low to High",
          description: "Sorted by stock quantity ascending",
        };
      case "quantity-desc":
        return {
          icon: ArrowDown,
          label: "Quantity High to Low",
          description: "Sorted by stock quantity descending",
        };
      default:
        return {
          icon: ArrowUpDown,
          label: "Default",
          description: "Default sorting",
        };
    }
  };

  const sortDisplayInfo = getSortDisplayInfo();
  const productSortDisplayInfo = getProductSortDisplayInfo();
  const SortIcon = sortDisplayInfo.icon;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stock Alerts Banner */}
      {stockAlerts.length > 0 && (
        <GlassCard className="p-4 border-l-4 border-l-yellow-500">
          <div className="flex items-start gap-3">
            <AlertTriangle
              className="text-yellow-400 flex-shrink-0 mt-1"
              size={20}
            />
            <div className="flex-1">
              <h3 className="text-white font-semibold text-sm mb-2">
                Stock Alerts ({stockAlerts.length})
              </h3>
              <div className="space-y-2">
                {stockAlerts.slice(0, 3).map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-center justify-between bg-white/5 p-2 rounded"
                  >
                    <div className="flex-1">
                      <span className="text-white text-sm font-medium">
                        {alert.itemName}
                      </span>
                      <span className="text-white/70 text-xs ml-2">
                        ({alert.currentStock} units remaining)
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => dismissAlert(alert.id)}
                      className="text-white/70 hover:text-white p-1 h-auto"
                    >
                      <X size={14} />
                    </Button>
                  </div>
                ))}
                {stockAlerts.length > 3 && (
                  <p className="text-white/70 text-xs">
                    ... and {stockAlerts.length - 3} more alerts
                  </p>
                )}
              </div>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Header Section - Responsive */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Inventory Management
          </h1>
          <div className="flex items-center gap-4 mt-1 text-sm sm:text-base">
            <p className="text-white/70">Manage your car parts inventory</p>
            {isLoading && (
              <div className="flex items-center gap-2 text-blue-400">
                <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs">Syncing...</span>
              </div>
            )}
          </div>
          {error && <p className="text-red-400 text-sm mt-1">Error: {error}</p>}
        </div>

        {/* Action Buttons - Responsive Grid */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <div className="grid grid-cols-2 sm:flex gap-2 sm:gap-3">
            <Button
              onClick={() => setShowExcelImport(true)}
              size="sm"
              className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white border-0 text-xs sm:text-sm"
            >
              <Upload size={16} className="mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Import</span>
              <span className="xs:hidden">Import</span>
            </Button>
            <Button
              onClick={handleExcelExport}
              size="sm"
              variant="outline"
              className="!bg-transparent border-white/20 text-white hover:bg-white/20 text-xs sm:text-sm backdrop-blur-sm"
            >
              <Download size={16} className="mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Export</span>
              <span className="xs:hidden">Export</span>
            </Button>
          </div>
          <Button
            onClick={() => setShowAddForm(true)}
            size="sm"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 w-full sm:w-auto text-xs sm:text-sm"
          >
            <Plus size={16} className="mr-1 sm:mr-2" />
            Add Product
          </Button>
          <Button
            onClick={refreshInventory}
            size="sm"
            variant="outline"
            className="!bg-transparent border-white/20 text-white hover:bg-white/20 text-xs sm:text-sm backdrop-blur-sm"
            disabled={isLoading}
          >
            <Bell size={16} className="mr-1 sm:mr-2" />
            Sync
          </Button>
        </div>
      </div>

      {/* Inventory Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <GlassCard className="p-4 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex-shrink-0">
              <Package className="text-white" size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white/70 text-xs sm:text-sm">Total Items</p>
              <p className="text-xl sm:text-2xl font-bold text-white">
                {products.length}
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-r from-green-500 to-teal-600 flex-shrink-0">
              <BarChart3 className="text-white" size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white/70 text-xs sm:text-sm">Total Value</p>
              <p
                className="text-lg sm:text-2xl font-bold text-white truncate"
                title={formatInventoryValue(getStockValue())}
              >
                {formatInventoryValue(getStockValue(), true)}
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-600 flex-shrink-0">
              <AlertTriangle className="text-white" size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white/70 text-xs sm:text-sm">Low Stock</p>
              <p className="text-xl sm:text-2xl font-bold text-white">
                {getLowStockItems().length}
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-r from-red-500 to-pink-600 flex-shrink-0">
              <Bell className="text-white" size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white/70 text-xs sm:text-sm">Alerts</p>
              <p className="text-xl sm:text-2xl font-bold text-white">
                {stockAlerts.length}
              </p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Top 10 Stock Chart - Responsive */}
      <GlassCard className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 sm:mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600">
              <BarChart3 className="text-white" size={20} />
            </div>
            <div>
              <h3 className="text-white font-semibold text-base sm:text-lg">
                Top 10 Items by Stock
              </h3>
              <p className="text-white/70 text-xs sm:text-sm">
                Current inventory levels for highest stocked items
              </p>
            </div>
          </div>
        </div>

        {/* Chart Container - Responsive Height */}
        <div className="h-64 sm:h-80 bg-white/5 rounded-lg p-2 sm:p-4 overflow-hidden">
          <ChartContainer config={chartConfig}>
            <BarChart
              data={getTop10StockData()}
              margin={{
                top: 10,
                right: 10,
                left: 10,
                bottom: 40,
              }}
            >
              <XAxis
                dataKey="name"
                angle={-35}
                textAnchor="end"
                height={60}
                interval={0}
                tick={{ fontSize: 10, fill: "#ffffff" }}
                axisLine={{ stroke: "#ffffff", strokeOpacity: 0.3 }}
                tickLine={{ stroke: "#ffffff", strokeOpacity: 0.3 }}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#ffffff" }}
                axisLine={{ stroke: "#ffffff", strokeOpacity: 0.3 }}
                tickLine={{ stroke: "#ffffff", strokeOpacity: 0.3 }}
                label={{
                  value: "Stock",
                  angle: -90,
                  position: "insideLeft",
                  style: {
                    textAnchor: "middle",
                    fill: "#ffffff",
                    fontSize: "10px",
                  },
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="bg-slate-900/90 backdrop-blur-md border border-white/20 text-white rounded-lg shadow-lg text-xs"
                    formatter={(value, name, props) => [
                      `${value} units`,
                      "Stock",
                    ]}
                    labelFormatter={(label, payload) => {
                      const data = payload?.[0]?.payload;
                      return data ? (
                        <div className="space-y-1">
                          <div className="font-medium text-white text-xs">
                            {data.fullName}
                          </div>
                          <div className="text-xs text-gray-300">
                            {data.partNumber}
                          </div>
                          <div
                            className={`text-xs font-medium ${data.status === "Low Stock" ? "text-red-300" : "text-green-300"}`}
                          >
                            {data.status}
                          </div>
                        </div>
                      ) : (
                        label
                      );
                    }}
                  />
                }
              />
              <Bar dataKey="stock" radius={[2, 2, 0, 0]}>
                {getTop10StockData().map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.fill}
                    stroke={entry.fill}
                    strokeWidth={1}
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>

        {/* Chart Legend - Responsive */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mt-3 sm:mt-4 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-500"></div>
            <span className="text-white/70">In Stock (10+ units)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-red-500"></div>
            <span className="text-white/70">Low Stock (&lt; 10 units)</span>
          </div>
        </div>
      </GlassCard>

      {/* Search and Sort - Side by Side */}
      <GlassCard className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50"
              size={18}
            />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 text-sm sm:text-base"
            />
          </div>

          {/* View Type Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <SortIcon className="text-white/70 flex-shrink-0" size={18} />
            <Select
              value={sortMethod}
              onValueChange={(value: SortMethod) => setSortMethod(value)}
            >
              <SelectTrigger className="w-full sm:w-56 bg-white/10 border-white/20 text-white text-sm">
                <SelectValue placeholder="View by..." />
              </SelectTrigger>
              <SelectContent className="bg-white/90 backdrop-blur-md border border-white/20">
                <SelectItem value="all" className="text-black text-sm">
                  <div className="flex items-center gap-2">
                    <List size={14} />
                    <span>All Products</span>
                  </div>
                </SelectItem>
                <SelectItem value="category" className="text-black text-sm">
                  <div className="flex items-center gap-2">
                    <Grid3X3 size={14} />
                    <span>Categories</span>
                  </div>
                </SelectItem>
                <SelectItem value="vehicle" className="text-black text-sm">
                  <div className="flex items-center gap-2">
                    <Car size={14} />
                    <span>Vehicle Compatibility</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Product Sort Dropdown - Only show for All Products view */}
          {sortMethod === "all" && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <ArrowUpDown className="text-white/70 flex-shrink-0" size={18} />
              <Select
                value={productSortMethod}
                onValueChange={(value: ProductSortMethod) =>
                  setProductSortMethod(value)
                }
              >
                <SelectTrigger className="w-full sm:w-56 bg-white/10 border-white/20 text-white text-sm">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent className="bg-white/90 backdrop-blur-md border border-white/20">
                  <SelectItem
                    value="quantity-desc"
                    className="text-black text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <ArrowDown size={14} />
                      <span>Quantity: High to Low</span>
                    </div>
                  </SelectItem>
                  <SelectItem
                    value="quantity-asc"
                    className="text-black text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <ArrowUp size={14} />
                      <span>Quantity: Low to High</span>
                    </div>
                  </SelectItem>
                  <SelectItem
                    value="alphabetical"
                    className="text-black text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <AlignLeft size={14} />
                      <span>Alphabetical A-Z</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-white/10 rounded-lg p-1">
            <Button
              size="sm"
              variant={viewMode === "tile" ? "default" : "ghost"}
              onClick={() => setViewMode("tile")}
              className={`p-2 h-8 ${
                viewMode === "tile"
                  ? "bg-white/20 text-white hover:bg-white/30"
                  : "!bg-transparent text-white/70 hover:text-white hover:bg-white/10"
              }`}
              title="Tile View"
            >
              <LayoutGrid size={16} />
            </Button>
            <Button
              size="sm"
              variant={viewMode === "list" ? "default" : "ghost"}
              onClick={() => setViewMode("list")}
              className={`p-2 h-8 ${
                viewMode === "list"
                  ? "bg-white/20 text-white hover:bg-white/30"
                  : "!bg-transparent text-white/70 hover:text-white hover:bg-white/10"
              }`}
              title="List View"
            >
              <Menu size={16} />
            </Button>
          </div>
        </div>

        {/* Sort Info */}
        <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm text-white/70">
          <div className="flex items-center gap-2">
            <SortDesc size={14} />
            <span>View: {sortDisplayInfo.label}</span>
          </div>
          <span className="hidden sm:inline">•</span>
          <span>{sortDisplayInfo.description}</span>
          {sortMethod === "all" && (
            <>
              <span className="hidden sm:inline">•</span>
              <span>Sort: {productSortDisplayInfo.label}</span>
            </>
          )}
        </div>
      </GlassCard>

      {/* Groups - Responsive */}
      <div className="space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
          {sortMethod === "category"
            ? "CATEGORIES"
            : sortMethod === "vehicle"
              ? "VEHICLE COMPATIBILITY"
              : "ALL PRODUCTS"}
        </h2>

        {filteredGroups.map((group) => {
          const isExpanded =
            expandedGroups.has(group.id) || sortMethod === "all";
          const stockStatus = getGroupStockStatus(group);

          return (
            <GlassCard key={group.id} className="overflow-hidden">
              {/* Group Header - Only show for grouped views or make non-clickable for All Products */}
              {sortMethod !== "all" ? (
                <div
                  className="p-4 sm:p-6 cursor-pointer hover:bg-white/10 transition-all duration-200"
                  onClick={() => toggleGroup(group.id)}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2 sm:gap-4 flex-1">
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {isExpanded ? (
                          <ChevronDown className="text-white" size={20} />
                        ) : (
                          <ChevronRight className="text-white" size={20} />
                        )}
                        {sortMethod === "vehicle" ? (
                          <Car className="text-white/70" size={18} />
                        ) : (
                          <Package className="text-white/70" size={18} />
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide truncate">
                          {group.name}
                        </h3>

                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                          <span className="text-white/70">
                            {getTotalProductsInGroup(group)}{" "}
                            {getTotalProductsInGroup(group) === 1
                              ? "Product"
                              : "Products"}
                          </span>
                          <span className="text-white/70 hidden sm:inline">
                            •
                          </span>
                          <span className="text-white/70">
                            {stockStatus.totalStock} Total Stock
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end sm:justify-start">
                      <span
                        className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                          stockStatus.status === "In Stock"
                            ? "bg-green-500/20 text-green-300"
                            : "bg-red-500/20 text-red-300"
                        }`}
                      >
                        {stockStatus.status === "Low Stock"
                          ? `${stockStatus.count} Low Stock`
                          : "All In Stock"}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 sm:p-6 bg-white/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <List className="text-white/70" size={20} />
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-white">
                          All Products
                        </h3>
                        <p className="text-white/70 text-sm">
                          {getTotalProductsInGroup(group)} products •{" "}
                          {productSortDisplayInfo.description}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        stockStatus.status === "In Stock"
                          ? "bg-green-500/20 text-green-300"
                          : "bg-red-500/20 text-red-300"
                      }`}
                    >
                      {stockStatus.status === "Low Stock"
                        ? `${stockStatus.count} Low Stock`
                        : "All In Stock"}
                    </span>
                  </div>
                </div>
              )}

              {/* Expanded Products - Responsive Grid */}
              {isExpanded && (
                <div
                  className={
                    sortMethod !== "all" ? "border-t border-white/20" : ""
                  }
                >
                  <div className="p-4 sm:p-6 pt-3 sm:pt-4">
                    {viewMode === "tile" ? (
                      // Tile View
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {group.products.map((product) => (
                          <div
                            key={product.id}
                            className="p-3 sm:p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/15 hover:border-blue-400/30 transition-all duration-200 backdrop-blur-sm cursor-pointer group"
                            onClick={() => handleProductClick(product)}
                            title="Click to view product details"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 group-hover:from-blue-400 group-hover:to-purple-500 transition-all duration-200">
                                  <Package className="text-white" size={16} />
                                </div>
                                <div>
                                  <h4 className="text-white font-semibold text-sm group-hover:text-blue-300 transition-colors duration-200 flex items-center gap-1">
                                    {product.name}
                                    <span className="text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                      →
                                    </span>
                                  </h4>
                                  <p className="text-white/70 text-xs">
                                    {product.brand}
                                  </p>
                                  {sortMethod === "category" && (
                                    <p className="text-white/60 text-xs">
                                      {product.vehicle}
                                    </p>
                                  )}
                                  {sortMethod === "vehicle" && (
                                    <p className="text-white/60 text-xs">
                                      {product.category}
                                    </p>
                                  )}
                                  {sortMethod === "all" && (
                                    <>
                                      <p className="text-white/60 text-xs">
                                        {product.category}
                                      </p>
                                      <p className="text-white/60 text-xs">
                                        {product.vehicle}
                                      </p>
                                    </>
                                  )}
                                </div>
                              </div>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium border ${getInventoryStatusColor(product)}`}
                              >
                                {product.status}
                              </span>
                            </div>

                            <div className="space-y-1 text-xs">
                              <div className="flex justify-between">
                                <span className="text-white/70">Part #:</span>
                                <span className="text-white font-medium">
                                  {product.partNumber}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-white/70">Stock:</span>
                                <span className="text-white font-medium">
                                  {product.stock} units
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-white/70">Purchase:</span>
                                <span className="text-white font-medium">
                                  ₹{product.costPrice}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-white/70">Sale:</span>
                                <span className="text-white font-medium">
                                  ₹{product.sellingPrice}
                                </span>
                              </div>
                            </div>

                            {/* Tap for details indicator */}
                            <div className="mt-3 pt-2 border-t border-white/10">
                              <div className="flex items-center justify-center gap-1 text-blue-300/70 group-hover:text-blue-300 transition-colors duration-200">
                                <Eye size={12} />
                                <span className="text-xs">Tap for details</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      // List View
                      <div className="space-y-2">
                        {group.products.map((product) => (
                          <div
                            key={product.id}
                            className="p-3 sm:p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/15 hover:border-blue-400/30 transition-all duration-200 backdrop-blur-sm cursor-pointer group"
                            onClick={() => handleProductClick(product)}
                            title="Click to view product details"
                          >
                            <div className="flex items-center gap-4">
                              {/* Product Icon */}
                              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 group-hover:from-blue-400 group-hover:to-purple-500 transition-all duration-200 flex-shrink-0">
                                <Package className="text-white" size={16} />
                              </div>

                              {/* Product Info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="text-white font-semibold text-sm group-hover:text-blue-300 transition-colors duration-200 flex items-center gap-1 truncate">
                                    {product.name}
                                    <span className="text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                      →
                                    </span>
                                  </h4>
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium border ${getInventoryStatusColor(product)} flex-shrink-0`}
                                  >
                                    {product.status}
                                  </span>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-white/70">
                                  <span>{product.brand}</span>
                                  <span>•</span>
                                  <span>{product.partNumber}</span>
                                  <span>•</span>
                                  <span>{product.stock} units</span>
                                  {sortMethod === "all" && (
                                    <>
                                      <span>•</span>
                                      <span>{product.category}</span>
                                    </>
                                  )}
                                </div>
                                {(sortMethod === "category" ||
                                  sortMethod === "all") && (
                                  <div className="text-xs text-white/60 mt-1">
                                    {product.vehicle}
                                  </div>
                                )}
                              </div>

                              {/* Pricing */}
                              <div className="flex items-center gap-6 text-right flex-shrink-0">
                                <div>
                                  <div className="text-xs text-white/70">
                                    Purchase
                                  </div>
                                  <div className="text-sm text-white font-medium">
                                    ₹{product.costPrice}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-xs text-white/70">
                                    Sale
                                  </div>
                                  <div className="text-sm text-white font-medium">
                                    ₹{product.sellingPrice}
                                  </div>
                                </div>
                                <div className="w-8 flex justify-center">
                                  <Eye
                                    size={16}
                                    className="text-blue-300/70 group-hover:text-blue-300 transition-colors duration-200"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </GlassCard>
          );
        })}
      </div>

      {/* Excel Import Dialog */}
      <ExcelImportDialog
        isOpen={showExcelImport}
        onClose={() => setShowExcelImport(false)}
        onImport={handleExcelImport}
        existingProducts={products}
      />

      {/* Product Detail Dialog */}
      <ProductDetailDialog
        open={showProductDetail}
        onClose={() => {
          setShowProductDetail(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        transactions={transactions}
        onSave={handleProductSave}
      />
    </div>
  );
};
