
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

interface AddSaleDialogProps {
  onClose: () => void;
}

export const AddSaleDialog: React.FC<AddSaleDialogProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    productName: '',
    quantity: '',
    unitPrice: '',
    discount: '',
    paymentMethod: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Adding sale:', formData);
    // Here you would typically save to your database
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const totalAmount = (Number(formData.quantity) * Number(formData.unitPrice)) - Number(formData.discount || 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-1">Customer Name</label>
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
            placeholder="Enter customer name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/80 mb-1">Phone Number</label>
          <input
            type="tel"
            name="customerPhone"
            value={formData.customerPhone}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
            placeholder="Enter phone number"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white/80 mb-1">Product</label>
        <select
          name="productName"
          value={formData.productName}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/30"
          required
        >
          <option value="">Select product</option>
          <option value="brake-pad">Brake Pad - Honda Civic</option>
          <option value="air-filter">Air Filter - Toyota Corolla</option>
          <option value="spark-plug">Spark Plug - Maruti Swift</option>
          <option value="oil-filter">Oil Filter - Hyundai i20</option>
        </select>
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
          <label className="block text-sm font-medium text-white/80 mb-1">Unit Price (₹)</label>
          <input
            type="number"
            name="unitPrice"
            value={formData.unitPrice}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
            placeholder="0"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/80 mb-1">Discount (₹)</label>
          <input
            type="number"
            name="discount"
            value={formData.discount}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
            placeholder="0"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-1">Payment Method</label>
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/30"
            required
          >
            <option value="">Select payment method</option>
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="upi">UPI</option>
            <option value="credit">Credit</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-white/80 mb-1">Total Amount</label>
          <div className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white text-lg font-semibold">
            ₹{totalAmount.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button 
          type="submit"
          className="flex-1 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white border-0"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Complete Sale
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
