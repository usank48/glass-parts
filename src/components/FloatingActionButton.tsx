import React, { useState } from "react";
import {
  Plus,
  Package,
  ShoppingCart,
  ShoppingBag,
  BarChart3,
  Upload,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AddProductDialog } from "./dialogs/AddProductDialog";
import { AddSaleDialog } from "./dialogs/AddSaleDialog";
import { AddPurchaseDialog } from "./dialogs/AddPurchaseDialog";
import { ExcelImportDialog } from "./dialogs/ExcelImportDialog";

interface FloatingActionButtonProps {
  activeModule: string;
  onAddProduct: () => void;
  onAddSale: () => void;
  onAddPurchase: () => void;
  existingProducts?: Array<{
    id: number;
    partNumber: string;
    name: string;
    stock: number;
  }>;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  activeModule,
  onAddProduct,
  onAddSale,
  onAddPurchase,
  existingProducts = [],
}) => {
  const [dialogType, setDialogType] = useState<
    | "product"
    | "sale"
    | "purchase"
    | "dashboard"
    | "inventory"
    | "excel-import"
    | null
  >(null);

  // Get context-specific action based on active module
  const getContextAction = () => {
    switch (activeModule) {
      case "inventory":
        return {
          label: "Add Product",
          icon: Package,
          onClick: () => setDialogType("inventory"),
          color: "from-blue-500/80 to-purple-600/80",
        };
      case "purchase":
        return {
          label: "Add Purchase",
          icon: ShoppingBag,
          onClick: () => setDialogType("purchase"),
          color: "from-orange-500/80 to-red-600/80",
        };
      case "sales":
        return {
          label: "Add Sale",
          icon: ShoppingCart,
          onClick: () => setDialogType("sale"),
          color: "from-green-500/80 to-teal-600/80",
        };
      case "dashboard":
      default:
        return {
          label: "Quick Add",
          icon: BarChart3,
          onClick: () => setDialogType("dashboard"),
          color: "from-purple-500/80 to-pink-600/80",
        };
    }
  };

  const contextAction = getContextAction();
  const ActionIcon = contextAction.icon;

  return (
    <>
      {/* Positioned above bottom navigation bar */}
      <div className="fixed bottom-20 right-4 z-50">
        <button
          onClick={contextAction.onClick}
          className={`w-14 h-14 rounded-full bg-gradient-to-r ${contextAction.color} backdrop-blur-md border border-white/20 text-white shadow-lg hover:scale-110 transition-all duration-200 flex items-center justify-center group`}
          title={contextAction.label}
        >
          <ActionIcon size={24} />

          {/* Tooltip */}
          <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-md border border-white/20 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            {contextAction.label}
          </div>
        </button>
      </div>

      {/* Context-specific dialogs */}
      <Dialog
        open={dialogType === "product"}
        onOpenChange={() => setDialogType(null)}
      >
        <DialogContent className="bg-white/10 backdrop-blur-md border border-white/20 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">Add New Product</DialogTitle>
          </DialogHeader>
          <AddProductDialog onClose={() => setDialogType(null)} />
        </DialogContent>
      </Dialog>

      <Dialog
        open={dialogType === "sale"}
        onOpenChange={() => setDialogType(null)}
      >
        <DialogContent className="bg-white/10 backdrop-blur-md border border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Add New Sale</DialogTitle>
          </DialogHeader>
          <AddSaleDialog onClose={() => setDialogType(null)} />
        </DialogContent>
      </Dialog>

      <Dialog
        open={dialogType === "purchase"}
        onOpenChange={() => setDialogType(null)}
      >
        <DialogContent className="bg-white/10 backdrop-blur-md border border-white/20 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Add New Purchase</DialogTitle>
          </DialogHeader>
          <AddPurchaseDialog onClose={() => setDialogType(null)} />
        </DialogContent>
      </Dialog>

      {/* Dashboard quick actions dialog */}
      <Dialog
        open={dialogType === "dashboard"}
        onOpenChange={() => setDialogType(null)}
      >
        <DialogContent className="bg-white/10 backdrop-blur-md border border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Quick Actions</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <button
              onClick={() => {
                setDialogType("product");
              }}
              className="w-full p-4 bg-gradient-to-r from-blue-500/20 to-purple-600/20 backdrop-blur-md border border-white/20 rounded-lg text-white hover:from-blue-500/30 hover:to-purple-600/30 transition-all duration-200 flex items-center gap-3"
            >
              <Package size={20} />
              <span>Add Product to Inventory</span>
            </button>

            <button
              onClick={() => {
                setDialogType("sale");
              }}
              className="w-full p-4 bg-gradient-to-r from-green-500/20 to-teal-600/20 backdrop-blur-md border border-white/20 rounded-lg text-white hover:from-green-500/30 hover:to-teal-600/30 transition-all duration-200 flex items-center gap-3"
            >
              <ShoppingCart size={20} />
              <span>Record New Sale</span>
            </button>

            <button
              onClick={() => {
                setDialogType("purchase");
              }}
              className="w-full p-4 bg-gradient-to-r from-orange-500/20 to-red-600/20 backdrop-blur-md border border-white/20 rounded-lg text-white hover:from-orange-500/30 hover:to-red-600/30 transition-all duration-200 flex items-center gap-3"
            >
              <ShoppingBag size={20} />
              <span>Create Purchase Order</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Inventory quick actions dialog */}
      <Dialog
        open={dialogType === "inventory"}
        onOpenChange={() => setDialogType(null)}
      >
        <DialogContent className="bg-white/10 backdrop-blur-md border border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Inventory Actions</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <button
              onClick={() => {
                setDialogType("product");
              }}
              className="w-full p-4 bg-gradient-to-r from-blue-500/20 to-purple-600/20 backdrop-blur-md border border-white/20 rounded-lg text-white hover:from-blue-500/30 hover:to-purple-600/30 transition-all duration-200 flex items-center gap-3"
            >
              <Package size={20} />
              <span>Add Single Product</span>
            </button>

            <button
              onClick={() => {
                setDialogType("excel-import");
              }}
              className="w-full p-4 bg-gradient-to-r from-green-500/20 to-teal-600/20 backdrop-blur-md border border-white/20 rounded-lg text-white hover:from-green-500/30 hover:to-teal-600/30 transition-all duration-200 flex items-center gap-3"
            >
              <Upload size={20} />
              <span>Import from Excel</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Excel Import Dialog */}
      <ExcelImportDialog
        open={dialogType === "excel-import"}
        onClose={() => setDialogType(null)}
        onImport={(data) => {
          // This is a placeholder - in real app, you'd handle the import
          console.log("Imported data:", data);
          setDialogType(null);
        }}
        existingProducts={existingProducts}
      />
    </>
  );
};
