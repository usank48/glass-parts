
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';

interface AddPurchaseDialogProps {
  onClose: () => void;
}

export const AddPurchaseDialog: React.FC<AddPurchaseDialogProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    supplierName: '',
    supplierContact: '',
    productName: '',
    partNumber: '',
    quantity: '',
    unitCost: '',
    totalCost: '',
    orderDate: '',
    expectedDelivery: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Adding purchase:', formData);
    // Here you would typically save to your database
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const calculatedTotal = Number(formData.quantity) * Number(formData.unitCost);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-1">Supplier Name</label>
          <select
            name="supplierName"
            value={formData.supplierName}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/30"
            required
          >
            <option value="">Select supplier</option>
            <option value="auto-parts-corp">Auto Parts Corp</option>
            <option value="genuine-parts">Genuine Parts Ltd</option>
            <option value="universal-auto">Universal Auto</option>
            <option value="premium-parts">Premium Parts India</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-white/80 mb-1">Contact Person</label>
          <input
            type="text"
            name="supplierContact"
            value={formData.supplierContact}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
            placeholder="Contact person name"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-1">Product Name</label>
          <input
            type="text"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
            placeholder="Enter product name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/80 mb-1">Part Number</label>
          <input
            type="text"
            name="partNumber"
            value={formData.partNumber}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
            placeholder="Enter part number"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-1">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
            placeholder="1"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/80 mb-1">Unit Cost (₹)</label>
          <input
            type="number"
            name="unitCost"
            value={formData.unitCost}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
            placeholder="0"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/80 mb-1">Total Cost (₹)</label>
          <div className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white font-semibold">
            ₹{calculatedTotal.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-1">Order Date</label>
          <input
            type="date"
            name="orderDate"
            value={formData.orderDate}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/30"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/80 mb-1">Expected Delivery</label>
          <input
            type="date"
            name="expectedDelivery"
            value={formData.expectedDelivery}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/30"
            required
          />
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button 
          type="submit"
          className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white border-0"
        >
          <ShoppingBag className="w-4 h-4 mr-2" />
          Create Purchase Order
        </Button>
        <Button 
          type="button"
          onClick={onClose}
          variant="outline"
          className="px-6 bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};
