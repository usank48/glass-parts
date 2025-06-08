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
} from "lucide-react";
import { GlassCard } from "./GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExcelImportDialog } from "./dialogs/ExcelImportDialog";
import { exportInventoryToExcel, InventoryData } from "@/lib/excelUtils";
import { toast } from "sonner";

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

interface Category {
  id: string;
  name: string;
  products: Product[];
}

export const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showExcelImport, setShowExcelImport] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(),
  );

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

  // Group products by category
  const categories: Category[] = [
    {
      id: "brake-pads",
      name: "BRAKE PADS",
      products: products.filter((p) => p.category === "BRAKE PADS"),
    },
    {
      id: "suspension",
      name: "SUSPENSION",
      products: products.filter((p) => p.category === "SUSPENSION"),
    },
    {
      id: "engine-valve",
      name: "ENGINE VALVE",
      products: products.filter((p) => p.category === "ENGINE VALVE"),
    },
    {
      id: "core",
      name: "CORE",
      products: products.filter((p) => p.category === "CORE"),
    },
    {
      id: "packing-kits",
      name: "PACKING KITS",
      products: products.filter((p) => p.category === "PACKING KITS"),
    },
    {
      id: "head-gasket",
      name: "HEAD GASKET",
      products: products.filter((p) => p.category === "HEAD GASKET"),
    },
  ];

  // Filter categories and products based on search term
  const filteredCategories = categories
    .map((category) => ({
      ...category,
      products: category.products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.vehicle.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    }))
    .filter(
      (category) =>
        category.products.length > 0 ||
        category.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const getTotalProductsInCategory = (category: Category) => {
    return category.products.length;
  };

  const getCategoryStockStatus = (category: Category) => {
    const totalStock = category.products.reduce(
      (sum, product) => sum + product.stock,
      0,
    );
    const lowStockCount = category.products.filter(
      (product) => product.status === "Low Stock",
    ).length;

    if (lowStockCount > 0) {
      return { status: "Low Stock", count: lowStockCount, totalStock };
    }
    return { status: "In Stock", count: category.products.length, totalStock };
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Inventory Management
          </h1>
          <p className="text-white/70 mt-1">Manage your car parts inventory</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => setShowExcelImport(true)}
            className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white border-0"
          >
            <Upload size={20} className="mr-2" />
            Import Excel
          </Button>
          <Button
            onClick={handleExcelExport}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Download size={20} className="mr-2" />
            Export Excel
          </Button>
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
          >
            <Plus size={20} className="mr-2" />
            Add Product
          </Button>
        </div>
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
              placeholder="Search products..."
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

      {/* Excel Import/Export Info Card */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-teal-600">
              <FileSpreadsheet className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-white font-semibold">Bulk Operations</h3>
              <p className="text-white/70 text-sm">
                Import multiple products at once using Excel files or export
                your current inventory
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowExcelImport(true)}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Upload size={16} className="mr-1" />
              Import
            </Button>
            <Button
              onClick={handleExcelExport}
              size="sm"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Download size={16} className="mr-1" />
              Export
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Categories */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white mb-4">CATEGORIES</h2>

        {filteredCategories.map((category) => {
          const isExpanded = expandedCategories.has(category.id);
          const stockStatus = getCategoryStockStatus(category);

          return (
            <GlassCard key={category.id} className="overflow-hidden">
              {/* Category Header */}
              <div
                className="p-6 cursor-pointer hover:bg-white/10 transition-all duration-200"
                onClick={() => toggleCategory(category.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {isExpanded ? (
                        <ChevronDown className="text-white" size={24} />
                      ) : (
                        <ChevronRight className="text-white" size={24} />
                      )}
                      <h3 className="text-xl font-bold text-white tracking-wide">
                        {category.name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-white/70">
                        {getTotalProductsInCategory(category)}{" "}
                        {getTotalProductsInCategory(category) === 1
                          ? "Product"
                          : "Products"}
                      </span>
                      <span className="text-white/70">•</span>
                      <span className="text-white/70">
                        {stockStatus.totalStock} Total Stock
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
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
              </div>

              {/* Expanded Products */}
              {isExpanded && (
                <div className="border-t border-white/20">
                  <div className="p-6 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {category.products.map((product) => (
                        <div
                          key={product.id}
                          className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200 backdrop-blur-sm"
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

      {filteredCategories.length === 0 && (
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
      />
    </div>
  );
};
