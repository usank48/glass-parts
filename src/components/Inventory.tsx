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

interface Product {
  id: number;
  partNumber: string;
  name: string;
  brand: string;
  vehicle: string;
  stock: number;
  costPrice: number;
  sellingPrice: number;
  status: string;
  category: string;
}

interface GroupedData {
  id: string;
  name: string;
  products: Product[];
}

type SortMethod = "category" | "vehicle";

export const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showExcelImport, setShowExcelImport] = useState(false);
  const [sortMethod, setSortMethod] = useState<SortMethod>("category");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const [products, setProducts] = useState<Product[]>([
    // Brake Pads
    {
      id: 1,
      partNumber: "BP-BMW-X5-2020",
      name: "Premium Brake Pad Set",
      brand: "Bosch",
      vehicle: "BMW X5 2020",
      stock: 45,
      costPrice: 89.99,
      sellingPrice: 129.99,
      status: "In Stock",
      category: "BRAKE PADS",
    },
    {
      id: 2,
      partNumber: "BP-TOY-CAM-2019",
      name: "Ceramic Brake Pads",
      brand: "Akebono",
      vehicle: "Toyota Camry 2019",
      stock: 32,
      costPrice: 65.5,
      sellingPrice: 95.99,
      status: "In Stock",
      category: "BRAKE PADS",
    },
    {
      id: 3,
      partNumber: "BP-HON-CIV-2021",
      name: "Sport Brake Pads",
      brand: "Brembo",
      vehicle: "Honda Civic 2021",
      stock: 8,
      costPrice: 110.0,
      sellingPrice: 159.99,
      status: "Low Stock",
      category: "BRAKE PADS",
    },

    // Suspension
    {
      id: 4,
      partNumber: "SUS-BMW-X5-2020",
      name: "Front Strut Assembly",
      brand: "Monroe",
      vehicle: "BMW X5 2020",
      stock: 15,
      costPrice: 185.0,
      sellingPrice: 275.99,
      status: "In Stock",
      category: "SUSPENSION",
    },
    {
      id: 5,
      partNumber: "SUS-TOY-CAM-2019",
      name: "Shock Absorber Set",
      brand: "KYB",
      vehicle: "Toyota Camry 2019",
      stock: 22,
      costPrice: 95.75,
      sellingPrice: 149.99,
      status: "In Stock",
      category: "SUSPENSION",
    },
    {
      id: 6,
      partNumber: "SUS-HON-CIV-2021",
      name: "Coil Spring Set",
      brand: "Eibach",
      vehicle: "Honda Civic 2021",
      stock: 18,
      costPrice: 125.0,
      sellingPrice: 189.99,
      status: "In Stock",
      category: "SUSPENSION",
    },

    // Engine Valve
    {
      id: 7,
      partNumber: "EV-BMW-X5-2020",
      name: "Intake Valve Set",
      brand: "Mahle",
      vehicle: "BMW X5 2020",
      stock: 12,
      costPrice: 156.0,
      sellingPrice: 229.99,
      status: "In Stock",
      category: "ENGINE VALVE",
    },
    {
      id: 8,
      partNumber: "EV-TOY-CAM-2019",
      name: "Exhaust Valve Kit",
      brand: "Denso",
      vehicle: "Toyota Camry 2019",
      stock: 25,
      costPrice: 87.5,
      sellingPrice: 129.99,
      status: "In Stock",
      category: "ENGINE VALVE",
    },

    // Core
    {
      id: 9,
      partNumber: "CR-BMW-X5-2020",
      name: "Radiator Core",
      brand: "Denso",
      vehicle: "BMW X5 2020",
      stock: 6,
      costPrice: 245.0,
      sellingPrice: 359.99,
      status: "Low Stock",
      category: "CORE",
    },
    {
      id: 10,
      partNumber: "CR-TOY-CAM-2019",
      name: "AC Evaporator Core",
      brand: "Valeo",
      vehicle: "Toyota Camry 2019",
      stock: 14,
      costPrice: 185.75,
      sellingPrice: 275.99,
      status: "In Stock",
      category: "CORE",
    },

    // Packing Kits
    {
      id: 11,
      partNumber: "PK-BMW-X5-2020",
      name: "Engine Gasket Kit",
      brand: "Felpro",
      vehicle: "BMW X5 2020",
      stock: 28,
      costPrice: 125.0,
      sellingPrice: 189.99,
      status: "In Stock",
      category: "PACKING KITS",
    },
    {
      id: 12,
      partNumber: "PK-TOY-CAM-2019",
      name: "Transmission Seal Kit",
      brand: "Beck Arnley",
      vehicle: "Toyota Camry 2019",
      stock: 35,
      costPrice: 45.5,
      sellingPrice: 69.99,
      status: "In Stock",
      category: "PACKING KITS",
    },

    // Head Gasket
    {
      id: 13,
      partNumber: "HG-BMW-X5-2020",
      name: "Cylinder Head Gasket",
      brand: "Mahle",
      vehicle: "BMW X5 2020",
      stock: 9,
      costPrice: 189.0,
      sellingPrice: 279.99,
      status: "Low Stock",
      category: "HEAD GASKET",
    },
    {
      id: 14,
      partNumber: "HG-TOY-CAM-2019",
      name: "Multi-Layer Head Gasket",
      brand: "Cometic",
      vehicle: "Toyota Camry 2019",
      stock: 16,
      costPrice: 156.75,
      sellingPrice: 229.99,
      status: "In Stock",
      category: "HEAD GASKET",
    },
  ]);

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
        {} as Record<string, Product[]>,
      );

      return Object.entries(categoryGroups)
        .map(([category, products]) => ({
          id: category.toLowerCase().replace(/\s+/g, "-"),
          name: category,
          products: products.sort((a, b) => a.name.localeCompare(b.name)),
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
    } else {
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
        {} as Record<string, Product[]>,
      );

      return Object.entries(vehicleGroups)
        .map(([vehicle, products]) => ({
          id: vehicle.toLowerCase().replace(/\s+/g, "-"),
          name: vehicle,
          products: products.sort((a, b) => a.name.localeCompare(b.name)),
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
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

    const updatedProducts = [...products];
    const nextId = Math.max(...products.map((p) => p.id), 0) + 1;
    let currentId = nextId;

    importedData.forEach((item) => {
      // Find existing product by part number (priority) or by name
      const existingIndex = updatedProducts.findIndex(
        (product) =>
          product.partNumber.toLowerCase() === item.partNumber.toLowerCase() ||
          product.name.toLowerCase() === item.partName.toLowerCase(),
      );

      if (existingIndex !== -1) {
        // Update existing product
        const existingProduct = updatedProducts[existingIndex];
        const oldStock = existingProduct.stock;

        updatedProducts[existingIndex] = {
          ...existingProduct,
          stock: item.quantity,
          costPrice: item.costPrice,
          sellingPrice: item.sellingPrice,
          status: item.quantity > 10 ? "In Stock" : "Low Stock",
          // Update other fields if they're different
          brand: item.brand || existingProduct.brand,
          vehicle: item.vehicleCompatibility || existingProduct.vehicle,
          category: item.category.toUpperCase() || existingProduct.category,
        };

        updatedCount++;
        updatedItems.push({
          partNumber: item.partNumber,
          partName: item.partName,
          oldStock,
          newStock: item.quantity,
        });
      } else {
        // Add new product
        const newProduct: Product = {
          id: currentId++,
          partNumber: item.partNumber,
          name: item.partName,
          brand: item.brand,
          vehicle: item.vehicleCompatibility || "Not specified",
          stock: item.quantity,
          costPrice: item.costPrice,
          sellingPrice: item.sellingPrice,
          status: item.quantity > 10 ? "In Stock" : "Low Stock",
          category: item.category.toUpperCase(),
        };

        updatedProducts.push(newProduct);
        newCount++;
        newItems.push({
          partNumber: item.partNumber,
          partName: item.partName,
          stock: item.quantity,
        });
      }
    });

    setProducts(updatedProducts);

    // Show detailed feedback
    if (updatedCount > 0 && newCount > 0) {
      toast.success(
        `Import completed! Updated ${updatedCount} existing products and added ${newCount} new products.`,
      );
    } else if (updatedCount > 0) {
      toast.success(`Updated stock for ${updatedCount} existing products.`);
    } else if (newCount > 0) {
      toast.success(`Added ${newCount} new products to inventory.`);
    }

    // Log detailed results for debugging
    console.log("Import Results:", {
      updated: updatedItems,
      new: newItems,
      totalProcessed: importedData.length,
    });
  };

  const handleExcelExport = () => {
    exportInventoryToExcel(products);
    toast.success("Inventory exported successfully!");
  };

  // Get current sort method display info
  const getSortDisplayInfo = () => {
    return sortMethod === "category"
      ? {
          icon: Grid3X3,
          label: "Categories",
          description: "Grouped by product categories",
        }
      : {
          icon: Car,
          label: "Vehicle Compatibility",
          description: "Grouped by vehicle models",
        };
  };

  const sortDisplayInfo = getSortDisplayInfo();
  const SortIcon = sortDisplayInfo.icon;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Section - Responsive */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Inventory Management
          </h1>
          <p className="text-white/70 mt-1 text-sm sm:text-base">
            Manage your car parts inventory
          </p>
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
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs sm:text-sm"
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
        </div>
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

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <SortIcon className="text-white/70 flex-shrink-0" size={18} />
            <Select
              value={sortMethod}
              onValueChange={(value: SortMethod) => setSortMethod(value)}
            >
              <SelectTrigger className="w-full sm:w-56 bg-white/10 border-white/20 text-white text-sm">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent className="bg-white/90 backdrop-blur-md border border-white/20">
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
        </div>

        {/* Sort Info */}
        <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm text-white/70">
          <div className="flex items-center gap-2">
            <SortDesc size={14} />
            <span>Sorted by {sortDisplayInfo.label}</span>
          </div>
          <span className="hidden sm:inline">•</span>
          <span>{sortDisplayInfo.description}</span>
        </div>
      </GlassCard>

      {/* Groups - Responsive */}
      <div className="space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
          {sortMethod === "category" ? "CATEGORIES" : "VEHICLE COMPATIBILITY"}
        </h2>

        {filteredGroups.map((group) => {
          const isExpanded = expandedGroups.has(group.id);
          const stockStatus = getGroupStockStatus(group);

          return (
            <GlassCard key={group.id} className="overflow-hidden">
              {/* Group Header - Responsive */}
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

              {/* Expanded Products - Responsive Grid */}
              {isExpanded && (
                <div className="border-t border-white/20">
                  <div className="p-4 sm:p-6 pt-3 sm:pt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      {group.products.map((product) => (
                        <div
                          key={product.id}
                          className="p-3 sm:p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200 backdrop-blur-sm"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                                <Package className="text-white" size={16} />
                              </div>
                              <div>
                                <h4 className="text-white font-semibold text-sm">
                                  {product.name}
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
                              </div>
                            </div>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                product.status === "In Stock"
                                  ? "bg-green-500/20 text-green-300"
                                  : "bg-red-500/20 text-red-300"
                              }`}
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
                              <span className="text-white/70">Price:</span>
                              <span className="text-white font-semibold">
                                ₹{product.sellingPrice}
                              </span>
                            </div>
                          </div>

                          <div className="mt-3 flex gap-2">
                            <Button
                              size="sm"
                              className="flex-1 text-xs h-8 bg-blue-600/70 hover:bg-blue-600/90 text-white border border-white/20 backdrop-blur-sm font-medium transition-all duration-200"
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              className="flex-1 text-xs h-8 bg-purple-600/70 hover:bg-purple-600/90 text-white border border-white/20 backdrop-blur-sm font-medium transition-all duration-200"
                            >
                              Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </GlassCard>
          );
        })}
      </div>

      {filteredGroups.length === 0 && (
        <GlassCard className="p-8 text-center">
          <Package className="mx-auto text-white/50 mb-4" size={48} />
          <h3 className="text-white text-lg font-semibold mb-2">
            No products found
          </h3>
          <p className="text-white/70">Try adjusting your search criteria</p>
        </GlassCard>
      )}

      {/* Excel Import Dialog */}
      <ExcelImportDialog
        open={showExcelImport}
        onClose={() => setShowExcelImport(false)}
        onImport={handleExcelImport}
        existingProducts={products.map((p) => ({
          id: p.id,
          partNumber: p.partNumber,
          name: p.name,
          stock: p.stock,
        }))}
      />
    </div>
  );
};
