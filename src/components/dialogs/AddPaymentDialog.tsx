import React, { useState } from "react";
import { Calendar, IndianRupee, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GlassCard } from "@/components/GlassCard";

interface PaymentRecord {
  month: string;
  amount: number;
  date: string;
  deductions?: number;
  bonus?: number;
  notes?: string;
}

interface AddPaymentDialogProps {
  employeeName: string;
  onClose: () => void;
  onSubmit: (payment: PaymentRecord) => void;
}

export const AddPaymentDialog: React.FC<AddPaymentDialogProps> = ({
  employeeName,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    amount: "",
    date: new Date().toISOString().split("T")[0],
    bonus: "",
    deductions: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payment: PaymentRecord = {
      month: new Date(formData.date).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
      amount: parseFloat(formData.amount) || 0,
      date: new Date(formData.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      bonus: formData.bonus ? parseFloat(formData.bonus) : undefined,
      deductions: formData.deductions
        ? parseFloat(formData.deductions)
        : undefined,
      notes: formData.notes || undefined,
    };

    onSubmit(payment);
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const netAmount =
    (parseFloat(formData.amount) || 0) +
    (parseFloat(formData.bonus) || 0) -
    (parseFloat(formData.deductions) || 0);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      {/* Container with extremely minimal height to ensure buttons are fully visible */}
      <div className="w-full max-w-lg h-[260px] md:h-[400px] flex flex-col">
        <GlassCard className="flex-1 flex flex-col overflow-hidden">
          {/* Fixed Header */}
          <div className="flex-shrink-0 p-4 pb-3 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">
                  Add Payment Record
                </h2>
                <p className="text-white/70 text-xs">For {employeeName}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/10 h-8 w-8"
              >
                ×
              </Button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
              <div className="flex-1 p-4 space-y-2">
                {/* Payment Date */}
                <div className="space-y-1">
                  <Label className="text-white flex items-center gap-2 text-sm">
                    <Calendar size={14} />
                    Payment Date
                  </Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    className="bg-white/10 border-white/20 text-white"
                    required
                  />
                </div>

                {/* Base Amount */}
                <div className="space-y-1">
                  <Label className="text-white flex items-center gap-2 text-sm">
                    <IndianRupee size={14} />
                    Base Amount
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Enter base salary amount"
                    value={formData.amount}
                    onChange={(e) =>
                      handleInputChange("amount", e.target.value)
                    }
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 h-9"
                    required
                  />
                </div>

                {/* Bonus */}
                <div className="space-y-1">
                  <Label className="text-white flex items-center gap-2 text-sm">
                    <Plus size={14} />
                    Bonus (Optional)
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Enter bonus amount"
                    value={formData.bonus}
                    onChange={(e) => handleInputChange("bonus", e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 h-9"
                  />
                </div>

                {/* Deductions */}
                <div className="space-y-1">
                  <Label className="text-white flex items-center gap-2 text-sm">
                    <Minus size={14} />
                    Deductions (Optional)
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Enter deduction amount"
                    value={formData.deductions}
                    onChange={(e) =>
                      handleInputChange("deductions", e.target.value)
                    }
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 h-9"
                  />
                </div>

                {/* Net Amount Display */}
                <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70 text-sm">Net Amount:</span>
                    <span className="text-white font-bold">
                      ₹{netAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-1">
                  <Label className="text-white text-sm">Notes (Optional)</Label>
                  <Textarea
                    placeholder="Add any additional notes..."
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 resize-none text-sm h-16"
                  />
                </div>
              </div>

              {/* Fixed Footer with Action Buttons */}
              <div className="flex-shrink-0 p-4 pt-3 border-t border-white/10">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="flex-1 border-white/20 text-white hover:bg-white/10 h-9 text-sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-green-600/80 hover:bg-green-700 text-white border-0 h-9 text-sm"
                  >
                    Add Payment
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
