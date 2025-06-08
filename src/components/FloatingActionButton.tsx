
import React, { useState } from 'react';
import { Plus, Package, ShoppingCart, ShoppingBag, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AddProductDialog } from './dialogs/AddProductDialog';
import { AddSaleDialog } from './dialogs/AddSaleDialog';
import { AddPurchaseDialog } from './dialogs/AddPurchaseDialog';

interface FloatingActionButtonProps {
  onAddProduct: () => void;
  onAddSale: () => void;
  onAddPurchase: () => void;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onAddProduct,
  onAddSale,
  onAddPurchase,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'product' | 'sale' | 'purchase' | null>(null);

  const actions = [
    { 
      label: 'Add Product', 
      icon: Package, 
      onClick: () => {
        setDialogType('product');
        setIsOpen(false);
      }, 
      color: 'from-blue-500/80 to-purple-600/80' 
    },
    { 
      label: 'Add Sale', 
      icon: ShoppingCart, 
      onClick: () => {
        setDialogType('sale');
        setIsOpen(false);
      }, 
      color: 'from-green-500/80 to-teal-600/80' 
    },
    { 
      label: 'Add Purchase', 
      icon: ShoppingBag, 
      onClick: () => {
        setDialogType('purchase');
        setIsOpen(false);
      }, 
      color: 'from-orange-500/80 to-red-600/80' 
    },
  ];

  return (
    <>
      <div className="fixed bottom-20 right-4 z-50 md:bottom-6">
        {/* Action buttons */}
        {isOpen && (
          <div className="absolute bottom-16 right-0 space-y-3">
            {actions.map((action, index) => {
              const Icon = action.icon;
              return (
                <div key={index} className="flex items-center gap-3">
                  <span className="bg-black/20 backdrop-blur-md border border-white/20 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap shadow-lg">
                    {action.label}
                  </span>
                  <button
                    onClick={action.onClick}
                    className={`w-12 h-12 rounded-full bg-gradient-to-r ${action.color} backdrop-blur-md border border-white/20 text-white shadow-lg hover:scale-110 transition-transform flex items-center justify-center`}
                  >
                    <Icon size={20} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
        
        {/* Main FAB */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full bg-gradient-to-r from-purple-500/80 to-pink-600/80 backdrop-blur-md border border-white/20 text-white shadow-lg hover:scale-110 transition-all duration-200 flex items-center justify-center ${
            isOpen ? 'rotate-45' : ''
          }`}
        >
          {isOpen ? <X size={24} /> : <Plus size={24} />}
        </button>
      </div>

      {/* Dialog Windows */}
      <Dialog open={dialogType === 'product'} onOpenChange={() => setDialogType(null)}>
        <DialogContent className="bg-white/10 backdrop-blur-md border border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Add New Product</DialogTitle>
          </DialogHeader>
          <AddProductDialog onClose={() => setDialogType(null)} />
        </DialogContent>
      </Dialog>

      <Dialog open={dialogType === 'sale'} onOpenChange={() => setDialogType(null)}>
        <DialogContent className="bg-white/10 backdrop-blur-md border border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Add New Sale</DialogTitle>
          </DialogHeader>
          <AddSaleDialog onClose={() => setDialogType(null)} />
        </DialogContent>
      </Dialog>

      <Dialog open={dialogType === 'purchase'} onOpenChange={() => setDialogType(null)}>
        <DialogContent className="bg-white/10 backdrop-blur-md border border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Add New Purchase</DialogTitle>
          </DialogHeader>
          <AddPurchaseDialog onClose={() => setDialogType(null)} />
        </DialogContent>
      </Dialog>
    </>
  );
};
