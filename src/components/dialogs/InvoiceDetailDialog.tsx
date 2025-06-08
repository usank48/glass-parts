import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Download,
  Printer,
  Mail,
  Calendar,
  DollarSign,
  Package,
  User,
  X,
} from "lucide-react";

interface InvoiceItem {
  id: string;
  partNumber: string;
  partName: string;
  brand: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Invoice {
  id: string;
  customer: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  date: string;
  dueDate: string;
  amount: number;
  status: string;
  items: InvoiceItem[];
  notes?: string;
  paymentTerms: string;
  taxRate: number;
  discountAmount?: number;
}

interface InvoiceDetailDialogProps {
  open: boolean;
  onClose: () => void;
  invoice: Invoice | null;
}

export const InvoiceDetailDialog: React.FC<InvoiceDetailDialogProps> = ({
  open,
  onClose,
  invoice,
}) => {
  if (!invoice) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "Pending":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "Overdue":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const subtotal = invoice.items.reduce(
    (sum, item) => sum + item.totalPrice,
    0,
  );
  const taxAmount = subtotal * (invoice.taxRate / 100);
  const discountAmount = invoice.discountAmount || 0;
  const finalTotal = subtotal + taxAmount - discountAmount;

  const handleDownload = () => {
    console.log("Downloading invoice:", invoice.id);
    // Implement PDF download logic
  };

  const handlePrint = () => {
    console.log("Printing invoice:", invoice.id);
    // Implement print logic
  };

  const handleSendEmail = () => {
    console.log("Sending email for invoice:", invoice.id);
    // Implement email sending logic
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white/10 backdrop-blur-md border border-white/20 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600">
                <FileText size={24} />
              </div>
              <div>
                <span>Invoice Details</span>
                <p className="text-sm text-white/70 font-normal">
                  {invoice.id}
                </p>
              </div>
            </DialogTitle>
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(invoice.status)}`}
              >
                {invoice.status}
              </span>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Invoice Header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Information */}
            <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <User size={20} />
                Customer Information
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-white/70">Name:</span>
                  <span className="text-white ml-2 font-medium">
                    {invoice.customer}
                  </span>
                </div>
                <div>
                  <span className="text-white/70">Email:</span>
                  <span className="text-white ml-2">
                    {invoice.customerEmail}
                  </span>
                </div>
                <div>
                  <span className="text-white/70">Phone:</span>
                  <span className="text-white ml-2">
                    {invoice.customerPhone}
                  </span>
                </div>
                <div>
                  <span className="text-white/70">Address:</span>
                  <span className="text-white ml-2">
                    {invoice.customerAddress}
                  </span>
                </div>
              </div>
            </div>

            {/* Invoice Information */}
            <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Calendar size={20} />
                Invoice Information
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-white/70">Invoice Date:</span>
                  <span className="text-white ml-2 font-medium">
                    {invoice.date}
                  </span>
                </div>
                <div>
                  <span className="text-white/70">Due Date:</span>
                  <span className="text-white ml-2">{invoice.dueDate}</span>
                </div>
                <div>
                  <span className="text-white/70">Payment Terms:</span>
                  <span className="text-white ml-2">
                    {invoice.paymentTerms}
                  </span>
                </div>
                <div>
                  <span className="text-white/70">Total Amount:</span>
                  <span className="text-white ml-2 font-bold text-lg">
                    ₹{finalTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Items */}
          <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Package size={20} />
              Invoice Items
            </h3>

            {/* Items Table Header */}
            <div className="hidden md:grid md:grid-cols-6 gap-4 pb-2 border-b border-white/20 text-sm text-white/70 font-medium">
              <div>Part Number</div>
              <div>Item Description</div>
              <div>Brand</div>
              <div className="text-center">Qty</div>
              <div className="text-right">Unit Price</div>
              <div className="text-right">Total</div>
            </div>

            {/* Items List */}
            <div className="space-y-3 mt-4">
              {invoice.items.map((item) => (
                <div
                  key={item.id}
                  className="md:grid md:grid-cols-6 gap-4 p-3 bg-white/5 rounded-lg border border-white/10"
                >
                  {/* Mobile Layout */}
                  <div className="md:hidden space-y-2">
                    <div className="flex justify-between">
                      <span className="text-white font-medium">
                        {item.partName}
                      </span>
                      <span className="text-white font-bold">
                        ₹{item.totalPrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm text-white/70">
                      <div>Part #: {item.partNumber}</div>
                      <div>Brand: {item.brand}</div>
                      <div>
                        Qty: {item.quantity} × ₹
                        {item.unitPrice.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden md:block text-white/90 text-sm">
                    {item.partNumber}
                  </div>
                  <div className="hidden md:block text-white font-medium">
                    {item.partName}
                  </div>
                  <div className="hidden md:block text-white/90 text-sm">
                    {item.brand}
                  </div>
                  <div className="hidden md:block text-center text-white">
                    {item.quantity}
                  </div>
                  <div className="hidden md:block text-right text-white">
                    ₹{item.unitPrice.toLocaleString()}
                  </div>
                  <div className="hidden md:block text-right text-white font-bold">
                    ₹{item.totalPrice.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Invoice Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Notes */}
            {invoice.notes && (
              <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                <h3 className="text-white font-semibold mb-3">Notes</h3>
                <p className="text-white/80 text-sm">{invoice.notes}</p>
              </div>
            )}

            {/* Totals */}
            <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <DollarSign size={20} />
                Invoice Summary
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-white/80">
                  <span>Subtotal:</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-300">
                    <span>Discount:</span>
                    <span>-₹{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-white/80">
                  <span>Tax ({invoice.taxRate}%):</span>
                  <span>₹{taxAmount.toLocaleString()}</span>
                </div>
                <div className="border-t border-white/20 pt-2">
                  <div className="flex justify-between text-white font-bold text-lg">
                    <span>Total Amount:</span>
                    <span>₹{finalTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-white/20">
            <Button
              onClick={handleDownload}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
            >
              <Download size={16} className="mr-2" />
              Download PDF
            </Button>
            <Button
              onClick={handlePrint}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 bg-white/5"
            >
              <Printer size={16} className="mr-2" />
              Print
            </Button>
            <Button
              onClick={handleSendEmail}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 bg-white/5"
            >
              <Mail size={16} className="mr-2" />
              Send Email
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="ml-auto border-white/20 text-white hover:bg-white/10 bg-white/5"
            >
              <X size={16} className="mr-2" />
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
