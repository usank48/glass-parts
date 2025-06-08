import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FileText,
  Download,
  Printer,
  MessageCircle,
  Calendar,
  DollarSign,
  Package,
  User,
  X,
  Edit3,
  Save,
  Trash2,
  Plus,
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "sonner";

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
  onSave?: (invoice: Invoice) => void;
}

export const InvoiceDetailDialog: React.FC<InvoiceDetailDialogProps> = ({
  open,
  onClose,
  invoice,
  onSave,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedInvoice, setEditedInvoice] = useState<Invoice | null>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);
  const printableInvoiceRef = useRef<HTMLDivElement>(null);

  if (!invoice) return null;

  const currentInvoice = isEditing ? editedInvoice || invoice : invoice;

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

  const subtotal = currentInvoice.items.reduce(
    (sum, item) => sum + item.totalPrice,
    0,
  );
  const taxAmount = subtotal * (currentInvoice.taxRate / 100);
  const discountAmount = currentInvoice.discountAmount || 0;
  const finalTotal = subtotal + taxAmount - discountAmount;

  const handleEdit = () => {
    setEditedInvoice({ ...invoice });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editedInvoice && onSave) {
      onSave({ ...editedInvoice, amount: finalTotal });
      setIsEditing(false);
      toast.success("Invoice updated successfully!");
    }
  };

  const handleCancel = () => {
    setEditedInvoice(null);
    setIsEditing(false);
  };

  const updateInvoiceField = (field: keyof Invoice, value: any) => {
    if (editedInvoice) {
      setEditedInvoice({ ...editedInvoice, [field]: value });
    }
  };

  const updateItem = (itemId: string, field: keyof InvoiceItem, value: any) => {
    if (editedInvoice) {
      const updatedItems = editedInvoice.items.map((item) => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [field]: value };
          if (field === "quantity" || field === "unitPrice") {
            updatedItem.totalPrice =
              updatedItem.quantity * updatedItem.unitPrice;
          }
          return updatedItem;
        }
        return item;
      });
      setEditedInvoice({ ...editedInvoice, items: updatedItems });
    }
  };

  const removeItem = (itemId: string) => {
    if (editedInvoice) {
      const updatedItems = editedInvoice.items.filter(
        (item) => item.id !== itemId,
      );
      setEditedInvoice({ ...editedInvoice, items: updatedItems });
    }
  };

  const addNewItem = () => {
    if (editedInvoice) {
      const newItem: InvoiceItem = {
        id: Date.now().toString(),
        partNumber: "",
        partName: "",
        brand: "",
        quantity: 1,
        unitPrice: 0,
        totalPrice: 0,
      };
      setEditedInvoice({
        ...editedInvoice,
        items: [...editedInvoice.items, newItem],
      });
    }
  };

  // Professional Invoice Format Component
  const ProfessionalInvoice = ({
    invoice,
    showForPrint = false,
  }: {
    invoice: Invoice;
    showForPrint?: boolean;
  }) => {
    const subtotal = invoice.items.reduce(
      (sum, item) => sum + item.totalPrice,
      0,
    );
    const taxAmount = subtotal * (invoice.taxRate / 100);
    const discountAmount = invoice.discountAmount || 0;
    const finalTotal = subtotal + taxAmount - discountAmount;

    return (
      <div
        className={`${showForPrint ? "text-black bg-white" : "text-white"} max-w-2xl mx-auto p-8 font-sans`}
      >
        {/* Company Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Auto Parts Pro</h1>
          <p className="text-sm mb-1">
            456 Industrial Ave, Mechanicsville, USA
          </p>
          <p className="text-sm mb-4">contact@autopartspro.com</p>
          <h2 className="text-xl font-bold">INVOICE</h2>
        </div>

        {/* Invoice Details */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span>Invoice #:</span>
            <span className="font-medium">{invoice.id}</span>
          </div>
          <div className="flex justify-between">
            <span>Date:</span>
            <span className="font-medium">{invoice.date}</span>
          </div>
        </div>

        {/* Bill To */}
        <div className="mb-6">
          <h3 className="font-bold mb-2">Bill To:</h3>
          <div className="text-sm">
            <p className="font-medium">{invoice.customer}</p>
            <p>{invoice.customerAddress}</p>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full mb-6">
          <thead>
            <tr
              className={`border-b-2 ${showForPrint ? "border-black" : "border-white/20"}`}
            >
              <th className="text-left py-2">Item</th>
              <th className="text-center py-2">Qty</th>
              <th className="text-right py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item) => (
              <tr
                key={item.id}
                className={`border-b ${showForPrint ? "border-gray-300" : "border-white/10"}`}
              >
                <td className="py-2">
                  <div>
                    {item.partName} ({item.partNumber})
                  </div>
                </td>
                <td className="text-center py-2">{item.quantity}</td>
                <td className="text-right py-2">
                  ₹{item.totalPrice.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-64">
            <div className="flex justify-between py-1">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between py-1">
                <span>Discount</span>
                <span>-₹{discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between py-1">
              <span>Tax ({invoice.taxRate}%)</span>
              <span>₹{taxAmount.toFixed(2)}</span>
            </div>
            <div
              className={`flex justify-between py-2 border-t-2 font-bold text-lg ${showForPrint ? "border-black" : "border-white/20"}`}
            >
              <span>TOTAL</span>
              <span>₹{finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="font-medium">Thank you for your business!</p>
        </div>
      </div>
    );
  };

  const generatePDF = async () => {
    try {
      // Create a temporary container for the professional invoice
      const tempDiv = document.createElement("div");
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      tempDiv.style.background = "white";
      tempDiv.style.width = "800px";
      tempDiv.style.padding = "40px";

      // Create the professional invoice HTML
      tempDiv.innerHTML = `
        <div style="font-family: Arial, sans-serif; color: black; max-width: 700px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="font-size: 28px; font-weight: bold; margin-bottom: 10px; margin-top: 0;">Auto Parts Pro</h1>
            <p style="margin: 5px 0;">456 Industrial Ave, Mechanicsville, USA</p>
            <p style="margin: 5px 0;">contact@autopartspro.com</p>
            <h2 style="font-size: 24px; font-weight: bold; margin-top: 20px; margin-bottom: 0;">INVOICE</h2>
          </div>
          
          <div style="margin-bottom: 30px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span>Invoice #:</span>
              <span style="font-weight: 500;">${currentInvoice.id}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>Date:</span>
              <span style="font-weight: 500;">${currentInvoice.date}</span>
            </div>
          </div>
          
          <div style="margin-bottom: 30px;">
            <h3 style="font-weight: bold; margin-bottom: 10px; margin-top: 0;">Bill To:</h3>
            <div>
              <p style="font-weight: 500; margin: 5px 0;">${currentInvoice.customer}</p>
              <p style="margin: 5px 0;">${currentInvoice.customerAddress}</p>
            </div>
          </div>
          
          <table style="width: 100%; margin-bottom: 30px; border-collapse: collapse;">
            <thead>
              <tr style="border-bottom: 2px solid black;">
                <th style="text-align: left; padding: 10px 0; font-weight: bold;">Item</th>
                <th style="text-align: center; padding: 10px 0; font-weight: bold;">Qty</th>
                <th style="text-align: right; padding: 10px 0; font-weight: bold;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${currentInvoice.items
                .map(
                  (item) => `
                <tr style="border-bottom: 1px solid #ccc;">
                  <td style="padding: 8px 0;">${item.partName} (${item.partNumber})</td>
                  <td style="text-align: center; padding: 8px 0;">${item.quantity}</td>
                  <td style="text-align: right; padding: 8px 0;">₹${item.totalPrice.toFixed(2)}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
          
          <div style="display: flex; justify-content: flex-end;">
            <div style="width: 250px;">
              <div style="display: flex; justify-content: space-between; padding: 5px 0;">
                <span>Subtotal</span>
                <span>₹${subtotal.toFixed(2)}</span>
              </div>
              ${
                discountAmount > 0
                  ? `
                <div style="display: flex; justify-content: space-between; padding: 5px 0;">
                  <span>Discount</span>
                  <span>-₹${discountAmount.toFixed(2)}</span>
                </div>
              `
                  : ""
              }
              <div style="display: flex; justify-content: space-between; padding: 5px 0;">
                <span>Tax (${currentInvoice.taxRate}%)</span>
                <span>₹${taxAmount.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 10px 0; border-top: 2px solid black; font-weight: bold; font-size: 18px;">
                <span>TOTAL</span>
                <span>₹${finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 40px;">
            <p style="font-weight: 500;">Thank you for your business!</p>
          </div>
        </div>
      `;

      document.body.appendChild(tempDiv);

      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        width: 800,
        height: tempDiv.scrollHeight,
      });

      document.body.removeChild(tempDiv);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;

      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio,
      );
      pdf.save(`${currentInvoice.id}.pdf`);

      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");

    if (printWindow) {
      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Invoice ${currentInvoice.id}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              background: white; 
              color: black; 
              margin: 0;
              padding: 20px;
            }
            .invoice-container {
              max-width: 700px;
              margin: 0 auto;
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
            }
            .company-name {
              font-size: 28px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .invoice-title {
              font-size: 24px;
              font-weight: bold;
              margin-top: 20px;
            }
            .invoice-details {
              margin-bottom: 30px;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 10px;
            }
            .bill-to {
              margin-bottom: 30px;
            }
            .items-table {
              width: 100%;
              margin-bottom: 30px;
              border-collapse: collapse;
            }
            .items-table th {
              text-align: left;
              padding: 10px 0;
              font-weight: bold;
              border-bottom: 2px solid black;
            }
            .items-table th.center { text-align: center; }
            .items-table th.right { text-align: right; }
            .items-table td {
              padding: 8px 0;
              border-bottom: 1px solid #ccc;
            }
            .items-table td.center { text-align: center; }
            .items-table td.right { text-align: right; }
            .totals {
              display: flex;
              justify-content: flex-end;
            }
            .totals-inner {
              width: 250px;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              padding: 5px 0;
            }
            .total-final {
              display: flex;
              justify-content: space-between;
              padding: 10px 0;
              border-top: 2px solid black;
              font-weight: bold;
              font-size: 18px;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              font-weight: 500;
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="header">
              <h1 class="company-name">Auto Parts Pro</h1>
              <p>456 Industrial Ave, Mechanicsville, USA</p>
              <p>contact@autopartspro.com</p>
              <h2 class="invoice-title">INVOICE</h2>
            </div>
            
            <div class="invoice-details">
              <div class="detail-row">
                <span>Invoice #:</span>
                <span><strong>${currentInvoice.id}</strong></span>
              </div>
              <div class="detail-row">
                <span>Date:</span>
                <span><strong>${currentInvoice.date}</strong></span>
              </div>
            </div>
            
            <div class="bill-to">
              <h3><strong>Bill To:</strong></h3>
              <div>
                <p><strong>${currentInvoice.customer}</strong></p>
                <p>${currentInvoice.customerAddress}</p>
              </div>
            </div>
            
            <table class="items-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th class="center">Qty</th>
                  <th class="right">Total</th>
                </tr>
              </thead>
              <tbody>
                ${currentInvoice.items
                  .map(
                    (item) => `
                  <tr>
                    <td>${item.partName} (${item.partNumber})</td>
                    <td class="center">${item.quantity}</td>
                    <td class="right">₹${item.totalPrice.toFixed(2)}</td>
                  </tr>
                `,
                  )
                  .join("")}
              </tbody>
            </table>
            
            <div class="totals">
              <div class="totals-inner">
                <div class="total-row">
                  <span>Subtotal</span>
                  <span>₹${subtotal.toFixed(2)}</span>
                </div>
                ${
                  discountAmount > 0
                    ? `
                  <div class="total-row">
                    <span>Discount</span>
                    <span>-₹${discountAmount.toFixed(2)}</span>
                  </div>
                `
                    : ""
                }
                <div class="total-row">
                  <span>Tax (${currentInvoice.taxRate}%)</span>
                  <span>₹${taxAmount.toFixed(2)}</span>
                </div>
                <div class="total-final">
                  <span>TOTAL</span>
                  <span>₹${finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div class="footer">
              <p>Thank you for your business!</p>
            </div>
          </div>
        </body>
        </html>
      `;

      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();

      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);

      toast.success("Invoice sent to printer!");
    }
  };

  const handleWhatsApp = () => {
    const message =
      `*INVOICE - ${currentInvoice.id}*%0A%0A` +
      `*Auto Parts Pro*%0A` +
      `456 Industrial Ave, Mechanicsville, USA%0A` +
      `contact@autopartspro.com%0A%0A` +
      `*Invoice #:* ${currentInvoice.id}%0A` +
      `*Date:* ${currentInvoice.date}%0A%0A` +
      `*Bill To:*%0A${currentInvoice.customer}%0A${currentInvoice.customerAddress}%0A%0A` +
      `*ITEMS:*%0A` +
      currentInvoice.items
        .map(
          (item) =>
            `• ${item.partName} (${item.partNumber}) - Qty: ${item.quantity} - ₹${item.totalPrice.toFixed(2)}`,
        )
        .join("%0A") +
      `%0A%0A*TOTALS:*%0A` +
      `Subtotal: ₹${subtotal.toFixed(2)}%0A` +
      (discountAmount > 0
        ? `Discount: -₹${discountAmount.toFixed(2)}%0A`
        : "") +
      `Tax (${currentInvoice.taxRate}%): ₹${taxAmount.toFixed(2)}%0A` +
      `*TOTAL: ₹${finalTotal.toFixed(2)}*%0A%0A` +
      `Thank you for your business! 🚗✨`;

    const whatsappUrl = `https://wa.me/?text=${message}`;
    window.open(whatsappUrl, "_blank");
    toast.success("WhatsApp opened with invoice details!");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white/10 backdrop-blur-md border border-white/20 text-white max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600">
                <FileText size={24} />
              </div>
              <div>
                <span>{isEditing ? "Edit Invoice" : "Invoice Details"}</span>
                <p className="text-sm text-white/70 font-normal">
                  {currentInvoice.id}
                </p>
              </div>
            </DialogTitle>
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(currentInvoice.status)}`}
              >
                {currentInvoice.status}
              </span>
              {!isEditing && (
                <Button
                  onClick={handleEdit}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Edit3 size={16} className="mr-1" />
                  Edit
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <div ref={invoiceRef} className="space-y-6">
          {/* Invoice Header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Information */}
            <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <User size={20} />
                Customer Information
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-white/70">Name:</span>
                  {isEditing ? (
                    <Input
                      value={currentInvoice.customer}
                      onChange={(e) =>
                        updateInvoiceField("customer", e.target.value)
                      }
                      className="mt-1 bg-white/10 border-white/20 text-white"
                    />
                  ) : (
                    <span className="text-white ml-2 font-medium">
                      {currentInvoice.customer}
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-white/70">Email:</span>
                  {isEditing ? (
                    <Input
                      value={currentInvoice.customerEmail}
                      onChange={(e) =>
                        updateInvoiceField("customerEmail", e.target.value)
                      }
                      className="mt-1 bg-white/10 border-white/20 text-white"
                    />
                  ) : (
                    <span className="text-white ml-2">
                      {currentInvoice.customerEmail}
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-white/70">Phone:</span>
                  {isEditing ? (
                    <Input
                      value={currentInvoice.customerPhone}
                      onChange={(e) =>
                        updateInvoiceField("customerPhone", e.target.value)
                      }
                      className="mt-1 bg-white/10 border-white/20 text-white"
                    />
                  ) : (
                    <span className="text-white ml-2">
                      {currentInvoice.customerPhone}
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-white/70">Address:</span>
                  {isEditing ? (
                    <Textarea
                      value={currentInvoice.customerAddress}
                      onChange={(e) =>
                        updateInvoiceField("customerAddress", e.target.value)
                      }
                      className="mt-1 bg-white/10 border-white/20 text-white"
                      rows={2}
                    />
                  ) : (
                    <span className="text-white ml-2">
                      {currentInvoice.customerAddress}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Invoice Information */}
            <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Calendar size={20} />
                Invoice Information
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-white/70">Invoice Date:</span>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={currentInvoice.date}
                      onChange={(e) =>
                        updateInvoiceField("date", e.target.value)
                      }
                      className="mt-1 bg-white/10 border-white/20 text-white"
                    />
                  ) : (
                    <span className="text-white ml-2 font-medium">
                      {currentInvoice.date}
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-white/70">Due Date:</span>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={currentInvoice.dueDate}
                      onChange={(e) =>
                        updateInvoiceField("dueDate", e.target.value)
                      }
                      className="mt-1 bg-white/10 border-white/20 text-white"
                    />
                  ) : (
                    <span className="text-white ml-2">
                      {currentInvoice.dueDate}
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-white/70">Payment Terms:</span>
                  {isEditing ? (
                    <Input
                      value={currentInvoice.paymentTerms}
                      onChange={(e) =>
                        updateInvoiceField("paymentTerms", e.target.value)
                      }
                      className="mt-1 bg-white/10 border-white/20 text-white"
                    />
                  ) : (
                    <span className="text-white ml-2">
                      {currentInvoice.paymentTerms}
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-white/70">Tax Rate (%):</span>
                  {isEditing ? (
                    <Input
                      type="number"
                      step="0.01"
                      value={currentInvoice.taxRate}
                      onChange={(e) =>
                        updateInvoiceField(
                          "taxRate",
                          parseFloat(e.target.value) || 0,
                        )
                      }
                      className="mt-1 bg-white/10 border-white/20 text-white"
                    />
                  ) : (
                    <span className="text-white ml-2">
                      {currentInvoice.taxRate}%
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-white/70">Total Amount:</span>
                  <span className="text-white ml-2 font-bold text-lg">
                    ₹{finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Items */}
          <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Package size={20} />
                Invoice Items
              </h3>
              {isEditing && (
                <Button
                  onClick={addNewItem}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Plus size={16} className="mr-1" />
                  Add Item
                </Button>
              )}
            </div>

            {/* Items Table Header */}
            <div className="hidden md:grid md:grid-cols-7 gap-4 pb-2 border-b border-white/20 text-sm text-white/70 font-medium">
              <div>Part Number</div>
              <div>Item Description</div>
              <div>Brand</div>
              <div className="text-center">Qty</div>
              <div className="text-right">Unit Price</div>
              <div className="text-right">Total</div>
              {isEditing && <div className="text-center">Actions</div>}
            </div>

            {/* Items List */}
            <div className="space-y-3 mt-4">
              {currentInvoice.items.map((item) => (
                <div
                  key={item.id}
                  className="md:grid md:grid-cols-7 gap-4 p-3 bg-white/5 rounded-lg border border-white/10"
                >
                  {/* Mobile Layout */}
                  <div className="md:hidden space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-white font-medium">
                        {item.partName}
                      </span>
                      {isEditing && (
                        <Button
                          onClick={() => removeItem(item.id)}
                          size="sm"
                          variant="outline"
                          className="border-red-500/20 text-red-300 hover:bg-red-500/20 p-1 h-auto"
                        >
                          <Trash2 size={14} />
                        </Button>
                      )}
                    </div>
                    <div className="text-sm text-white/70">
                      <div>Part #: {item.partNumber}</div>
                      <div>Brand: {item.brand}</div>
                      <div>
                        Qty: {item.quantity} × ₹{item.unitPrice.toFixed(2)} = ₹
                        {item.totalPrice.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden md:block">
                    {isEditing ? (
                      <Input
                        value={item.partNumber}
                        onChange={(e) =>
                          updateItem(item.id, "partNumber", e.target.value)
                        }
                        className="bg-white/10 border-white/20 text-white text-sm"
                      />
                    ) : (
                      <span className="text-white/90 text-sm">
                        {item.partNumber}
                      </span>
                    )}
                  </div>
                  <div className="hidden md:block">
                    {isEditing ? (
                      <Input
                        value={item.partName}
                        onChange={(e) =>
                          updateItem(item.id, "partName", e.target.value)
                        }
                        className="bg-white/10 border-white/20 text-white"
                      />
                    ) : (
                      <span className="text-white font-medium">
                        {item.partName}
                      </span>
                    )}
                  </div>
                  <div className="hidden md:block">
                    {isEditing ? (
                      <Input
                        value={item.brand}
                        onChange={(e) =>
                          updateItem(item.id, "brand", e.target.value)
                        }
                        className="bg-white/10 border-white/20 text-white text-sm"
                      />
                    ) : (
                      <span className="text-white/90 text-sm">
                        {item.brand}
                      </span>
                    )}
                  </div>
                  <div className="hidden md:block text-center">
                    {isEditing ? (
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(
                            item.id,
                            "quantity",
                            parseInt(e.target.value) || 0,
                          )
                        }
                        className="bg-white/10 border-white/20 text-white text-center"
                      />
                    ) : (
                      <span className="text-white">{item.quantity}</span>
                    )}
                  </div>
                  <div className="hidden md:block text-right">
                    {isEditing ? (
                      <Input
                        type="number"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) =>
                          updateItem(
                            item.id,
                            "unitPrice",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                        className="bg-white/10 border-white/20 text-white text-right"
                      />
                    ) : (
                      <span className="text-white">
                        ₹{item.unitPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <div className="hidden md:block text-right text-white font-bold">
                    ₹{item.totalPrice.toFixed(2)}
                  </div>
                  {isEditing && (
                    <div className="hidden md:flex justify-center">
                      <Button
                        onClick={() => removeItem(item.id)}
                        size="sm"
                        variant="outline"
                        className="border-red-500/20 text-red-300 hover:bg-red-500/20 p-1 h-auto"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Invoice Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Notes */}
            <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
              <h3 className="text-white font-semibold mb-3">Notes</h3>
              {isEditing ? (
                <Textarea
                  value={currentInvoice.notes || ""}
                  onChange={(e) => updateInvoiceField("notes", e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                  rows={4}
                  placeholder="Add invoice notes..."
                />
              ) : (
                <p className="text-white/80 text-sm">
                  {currentInvoice.notes || "No notes added."}
                </p>
              )}
            </div>

            {/* Totals */}
            <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <DollarSign size={20} />
                Invoice Summary
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-white/80">
                  <span>Subtotal:</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-green-300">Discount:</span>
                    <div className="flex items-center gap-2">
                      {isEditing ? (
                        <Input
                          type="number"
                          step="0.01"
                          value={currentInvoice.discountAmount || 0}
                          onChange={(e) =>
                            updateInvoiceField(
                              "discountAmount",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          className="w-24 bg-white/10 border-white/20 text-white text-right"
                        />
                      ) : (
                        <span className="text-green-300">
                          -₹{discountAmount.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                <div className="flex justify-between text-white/80">
                  <span>Tax ({currentInvoice.taxRate}%):</span>
                  <span>₹{taxAmount.toFixed(2)}</span>
                </div>
                <div className="border-t border-white/20 pt-2">
                  <div className="flex justify-between text-white font-bold text-lg">
                    <span>Total Amount:</span>
                    <span>₹{finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-white/20">
            {isEditing ? (
              <>
                <Button
                  onClick={handleSave}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                >
                  <Save size={16} className="mr-2" />
                  Save Changes
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 bg-white/5"
                >
                  <X size={16} className="mr-2" />
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={generatePDF}
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
                  onClick={handleWhatsApp}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                >
                  <MessageCircle size={16} className="mr-2" />
                  Send via WhatsApp
                </Button>
              </>
            )}
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

        {/* Hidden Professional Invoice for PDF Generation */}
        <div
          ref={printableInvoiceRef}
          style={{ position: "absolute", left: "-9999px" }}
        >
          <ProfessionalInvoice invoice={currentInvoice} showForPrint={true} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
