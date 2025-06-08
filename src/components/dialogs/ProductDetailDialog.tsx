import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Edit,
  Save,
  X,
  Car,
  IndianRupee,
  BarChart3,
  AlertTriangle,
  Calendar,
  MapPin,
  User,
  TrendingUp,
  TrendingDown,
  Clock,
  Building,
} from "lucide-react";
import { InventoryItem, InventoryTransaction } from "@/hooks/useInventorySync";
import {
  formatInventoryValue,
  getInventoryStatusColor,
} from "@/utils/inventoryManager";
import { GlassCard } from "../GlassCard";
import { toast } from "sonner";

interface ProductDetailDialogProps {
  open: boolean;
  onClose: () => void;
  product: InventoryItem | null;
  transactions?: InventoryTransaction[];
  onSave?: (updatedProduct: InventoryItem) => void;
}

export const ProductDetailDialog: React.FC<ProductDetailDialogProps> = ({
  open,
  onClose,
  product,
  transactions = [],
  onSave,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState<InventoryItem | null>(
    null,
  );

  // Initialize edited product when product changes
  React.useEffect(() => {
    if (product) {
      setEditedProduct({ ...product });
    }
  }, [product]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProduct(product ? { ...product } : null);
  };

  const handleSave = () => {
    if (editedProduct && onSave) {
      onSave(editedProduct);
      setIsEditing(false);
      toast.success("Product updated successfully");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProduct(product ? { ...product } : null);
  };

  const handleInputChange = (field: keyof InventoryItem, value: any) => {
    if (editedProduct) {
      setEditedProduct({
        ...editedProduct,
        [field]: value,
      });
    }
  };

  // Get product transactions
  const productTransactions = transactions
    .filter((t) => t.itemId === product?.id)
    .slice(0, 10);

  // Calculate product analytics
  const calculateAnalytics = () => {
    if (!product || !transactions.length) return null;

    const productTxns = transactions.filter((t) => t.itemId === product.id);
    const salesTxns = productTxns.filter((t) => t.type === "sale");
    const purchaseTxns = productTxns.filter((t) => t.type === "purchase");

    const totalSales = salesTxns.reduce((sum, t) => sum + t.quantity, 0);
    const totalPurchases = purchaseTxns.reduce((sum, t) => sum + t.quantity, 0);
    const revenue = salesTxns.reduce((sum, t) => sum + t.totalValue, 0);
    const averageSalePrice =
      salesTxns.length > 0
        ? revenue / salesTxns.reduce((sum, t) => sum + t.quantity, 0)
        : 0;

    // Calculate velocity (sales per day over last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentSales = salesTxns.filter(
      (t) => new Date(t.date) >= thirtyDaysAgo,
    );
    const velocity = recentSales.reduce((sum, t) => sum + t.quantity, 0) / 30;

    return {
      totalSales,
      totalPurchases,
      revenue,
      averageSalePrice,
      velocity: Math.round(velocity * 100) / 100,
      lastSaleDate: salesTxns.length > 0 ? salesTxns[0].date : null,
      lastPurchaseDate: purchaseTxns.length > 0 ? purchaseTxns[0].date : null,
    };
  };

  const analytics = calculateAnalytics();

  if (!product) return null;

  const currentProduct = isEditing ? editedProduct : product;
  if (!currentProduct) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] bg-slate-900/95 backdrop-blur-md border-white/20 text-white overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 border-b border-white/20 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                <Package className="text-white" size={20} />
              </div>
              <div>
                <DialogTitle className="text-lg sm:text-xl font-bold text-white">
                  Product Details
                </DialogTitle>
                <p className="text-white/70 text-sm">
                  {currentProduct.partNumber} • {currentProduct.category}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <Button
                  size="sm"
                  onClick={handleEdit}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
                >
                  <Edit size={16} className="mr-2" />
                  Edit
                </Button>
              ) : (
                <>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white border-0"
                  >
                    <Save size={16} className="mr-2" />
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancel}
                    className="!bg-transparent border-white/20 text-white hover:bg-white/10"
                  >
                    <X size={16} className="mr-2" />
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            {/* Main Product Information */}
            <div className="lg:col-span-2 space-y-6">
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Package size={18} />
                  Product Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white/70 text-sm">
                      Product Name
                    </Label>
                    {isEditing ? (
                      <Input
                        value={currentProduct.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        className="mt-1 bg-white/10 border-white/20 text-white"
                      />
                    ) : (
                      <p className="text-white font-medium mt-1">
                        {currentProduct.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="text-white/70 text-sm">Part Number</Label>
                    {isEditing ? (
                      <Input
                        value={currentProduct.partNumber}
                        onChange={(e) =>
                          handleInputChange("partNumber", e.target.value)
                        }
                        className="mt-1 bg-white/10 border-white/20 text-white"
                      />
                    ) : (
                      <p className="text-white font-medium mt-1">
                        {currentProduct.partNumber}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="text-white/70 text-sm">
                      OEM Part Number
                    </Label>
                    {isEditing ? (
                      <Input
                        value={currentProduct.oemPartNumber || ""}
                        onChange={(e) =>
                          handleInputChange("oemPartNumber", e.target.value)
                        }
                        className="mt-1 bg-white/10 border-white/20 text-white"
                        placeholder="Enter OEM part number"
                      />
                    ) : (
                      <p className="text-white font-medium mt-1">
                        {currentProduct.oemPartNumber || "Not specified"}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="text-white/70 text-sm">Brand</Label>
                    {isEditing ? (
                      <Input
                        value={currentProduct.brand}
                        onChange={(e) =>
                          handleInputChange("brand", e.target.value)
                        }
                        className="mt-1 bg-white/10 border-white/20 text-white"
                      />
                    ) : (
                      <p className="text-white font-medium mt-1">
                        {currentProduct.brand}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="text-white/70 text-sm">Category</Label>
                    {isEditing ? (
                      <Input
                        value={currentProduct.category}
                        onChange={(e) =>
                          handleInputChange("category", e.target.value)
                        }
                        className="mt-1 bg-white/10 border-white/20 text-white"
                      />
                    ) : (
                      <p className="text-white font-medium mt-1">
                        {currentProduct.category}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <Label className="text-white/70 text-sm flex items-center gap-2">
                      <Car size={14} />
                      Vehicle Compatibility
                    </Label>
                    {isEditing ? (
                      <Input
                        value={currentProduct.vehicle}
                        onChange={(e) =>
                          handleInputChange("vehicle", e.target.value)
                        }
                        className="mt-1 bg-white/10 border-white/20 text-white"
                      />
                    ) : (
                      <p className="text-white font-medium mt-1">
                        {currentProduct.vehicle}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="text-white/70 text-sm">Location</Label>
                    {isEditing ? (
                      <Input
                        value={currentProduct.location || "Not specified"}
                        onChange={(e) =>
                          handleInputChange("location", e.target.value)
                        }
                        className="mt-1 bg-white/10 border-white/20 text-white"
                        placeholder="Warehouse location"
                      />
                    ) : (
                      <p className="text-white font-medium mt-1">
                        {currentProduct.location || "Not specified"}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="text-white/70 text-sm">Supplier</Label>
                    {isEditing ? (
                      <Input
                        value={currentProduct.supplier || "Not specified"}
                        onChange={(e) =>
                          handleInputChange("supplier", e.target.value)
                        }
                        className="mt-1 bg-white/10 border-white/20 text-white"
                        placeholder="Primary supplier"
                      />
                    ) : (
                      <p className="text-white font-medium mt-1">
                        {currentProduct.supplier || "Not specified"}
                      </p>
                    )}
                  </div>
                </div>
              </GlassCard>

              {/* Pricing and Stock */}
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <IndianRupee size={18} />
                  Pricing & Stock
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-white/70 text-sm">
                      Current Stock
                    </Label>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={currentProduct.stock}
                        onChange={(e) =>
                          handleInputChange(
                            "stock",
                            parseInt(e.target.value) || 0,
                          )
                        }
                        className="mt-1 bg-white/10 border-white/20 text-white"
                      />
                    ) : (
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-white font-medium text-lg">
                          {currentProduct.stock} units
                        </p>
                        <Badge
                          className={`${getInventoryStatusColor(currentProduct)} text-xs`}
                        >
                          {currentProduct.status}
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="text-white/70 text-sm">Cost Price</Label>
                    {isEditing ? (
                      <Input
                        type="number"
                        step="0.01"
                        value={currentProduct.costPrice}
                        onChange={(e) =>
                          handleInputChange(
                            "costPrice",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                        className="mt-1 bg-white/10 border-white/20 text-white"
                      />
                    ) : (
                      <p className="text-white font-medium mt-1">
                        {formatInventoryValue(currentProduct.costPrice)}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="text-white/70 text-sm">
                      Selling Price
                    </Label>
                    {isEditing ? (
                      <Input
                        type="number"
                        step="0.01"
                        value={currentProduct.sellingPrice}
                        onChange={(e) =>
                          handleInputChange(
                            "sellingPrice",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                        className="mt-1 bg-white/10 border-white/20 text-white"
                      />
                    ) : (
                      <p className="text-white font-medium mt-1">
                        {formatInventoryValue(currentProduct.sellingPrice)}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="text-white/70 text-sm">
                      Min Stock Level
                    </Label>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={currentProduct.minStockLevel || 10}
                        onChange={(e) =>
                          handleInputChange(
                            "minStockLevel",
                            parseInt(e.target.value) || 10,
                          )
                        }
                        className="mt-1 bg-white/10 border-white/20 text-white"
                      />
                    ) : (
                      <p className="text-white font-medium mt-1">
                        {currentProduct.minStockLevel || 10} units
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="text-white/70 text-sm">Stock Value</Label>
                    <p className="text-white font-medium mt-1">
                      {formatInventoryValue(
                        currentProduct.stock * currentProduct.costPrice,
                      )}
                    </p>
                  </div>

                  <div>
                    <Label className="text-white/70 text-sm">
                      Profit Margin
                    </Label>
                    <p className="text-white font-medium mt-1">
                      {currentProduct.costPrice > 0
                        ? `${(((currentProduct.sellingPrice - currentProduct.costPrice) / currentProduct.costPrice) * 100).toFixed(1)}%`
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </GlassCard>

              {/* Recent Transactions */}
              {productTransactions.length > 0 && (
                <GlassCard className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Clock size={18} />
                    Recent Transactions
                  </h3>

                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {productTransactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg ${
                              transaction.type === "sale"
                                ? "bg-red-500/20 text-red-300"
                                : transaction.type === "purchase"
                                  ? "bg-green-500/20 text-green-300"
                                  : "bg-blue-500/20 text-blue-300"
                            }`}
                          >
                            {transaction.type === "sale" ? (
                              <TrendingDown size={14} />
                            ) : (
                              <TrendingUp size={14} />
                            )}
                          </div>
                          <div>
                            <p className="text-white font-medium text-sm capitalize">
                              {transaction.type}
                            </p>
                            <p className="text-white/70 text-xs">
                              {new Date(transaction.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-medium text-sm">
                            {transaction.type === "sale" ? "-" : "+"}
                            {transaction.quantity} units
                          </p>
                          <p className="text-white/70 text-xs">
                            {formatInventoryValue(transaction.totalValue)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}
            </div>

            {/* Analytics Sidebar */}
            <div className="space-y-6">
              {analytics && (
                <GlassCard className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <BarChart3 size={18} />
                    Analytics
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-white/70 text-sm">
                        Total Sales
                      </Label>
                      <p className="text-white font-bold text-lg">
                        {analytics.totalSales} units
                      </p>
                    </div>

                    <div>
                      <Label className="text-white/70 text-sm">
                        Total Revenue
                      </Label>
                      <p className="text-white font-bold text-lg">
                        {formatInventoryValue(analytics.revenue)}
                      </p>
                    </div>

                    <div>
                      <Label className="text-white/70 text-sm">
                        Avg Sale Price
                      </Label>
                      <p className="text-white font-medium">
                        {formatInventoryValue(analytics.averageSalePrice)}
                      </p>
                    </div>

                    <div>
                      <Label className="text-white/70 text-sm">
                        Sales Velocity
                      </Label>
                      <p className="text-white font-medium">
                        {analytics.velocity} units/day
                      </p>
                    </div>

                    {analytics.lastSaleDate && (
                      <div>
                        <Label className="text-white/70 text-sm">
                          Last Sale
                        </Label>
                        <p className="text-white font-medium">
                          {new Date(
                            analytics.lastSaleDate,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    )}

                    {analytics.lastPurchaseDate && (
                      <div>
                        <Label className="text-white/70 text-sm">
                          Last Purchase
                        </Label>
                        <p className="text-white font-medium">
                          {new Date(
                            analytics.lastPurchaseDate,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </GlassCard>
              )}

              {/* Stock Alerts */}
              {currentProduct.stock <= (currentProduct.minStockLevel || 10) && (
                <GlassCard className="p-6 border-l-4 border-l-yellow-500">
                  <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                    <AlertTriangle size={18} className="text-yellow-400" />
                    Stock Alert
                  </h3>
                  <p className="text-white/70 text-sm mb-3">
                    {currentProduct.stock === 0
                      ? "This item is out of stock!"
                      : "This item is running low on stock."}
                  </p>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white border-0"
                  >
                    Reorder Now
                  </Button>
                </GlassCard>
              )}

              {/* Quick Actions */}
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <Button
                    className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white border-0"
                    size="sm"
                  >
                    Add Stock
                  </Button>
                  <Button
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
                    size="sm"
                  >
                    Create Sale
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full !bg-transparent border-white/20 text-white hover:bg-white/10"
                    size="sm"
                  >
                    View Reports
                  </Button>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
