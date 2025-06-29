import React, { useState } from "react";
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// Select components removed - using buttons instead
import { Textarea } from "@/components/ui/textarea";
import { GlassCard } from "@/components/GlassCard";

interface AttendanceRecord {
  date: string;
  status: "present" | "absent" | "late" | "half-day";
  checkIn?: string;
  checkOut?: string;
  hoursWorked?: number;
  notes?: string;
}

interface AttendanceDialogProps {
  employeeName: string;
  onClose: () => void;
  onSubmit: (attendance: AttendanceRecord) => void;
}

export const AttendanceDialog: React.FC<AttendanceDialogProps> = ({
  employeeName,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    status: "present" as const,
    checkIn: "",
    checkOut: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const hoursWorked = calculateHoursWorked(
      formData.checkIn,
      formData.checkOut,
    );

    const attendance: AttendanceRecord = {
      date: new Date(formData.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      status: formData.status,
      checkIn: formData.checkIn || undefined,
      checkOut: formData.checkOut || undefined,
      hoursWorked: hoursWorked,
      notes: formData.notes || undefined,
    };

    onSubmit(attendance);
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const calculateHoursWorked = (checkIn: string, checkOut: string): number => {
    if (!checkIn || !checkOut) return 0;

    const checkInTime = new Date(`1970-01-01T${checkIn}:00`);
    const checkOutTime = new Date(`1970-01-01T${checkOut}:00`);

    if (checkOutTime <= checkInTime) return 0;

    const diffInMs = checkOutTime.getTime() - checkInTime.getTime();
    return Math.round((diffInMs / (1000 * 60 * 60)) * 100) / 100;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle className="text-green-400" size={14} />;
      case "absent":
        return <XCircle className="text-red-400" size={14} />;
      case "late":
        return <AlertCircle className="text-yellow-400" size={14} />;
      case "half-day":
        return <Clock className="text-blue-400" size={14} />;
      default:
        return <Clock className="text-gray-400" size={14} />;
    }
  };

  const hoursWorked = calculateHoursWorked(formData.checkIn, formData.checkOut);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-lg">
        <GlassCard className="max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div>
              <h2 className="text-lg font-bold text-white">
                Add Attendance Record
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

          {/* Form Content - Scrollable */}
          <div className="overflow-y-auto max-h-[70vh]">
            <form onSubmit={handleSubmit}>
              <div className="p-4 space-y-3">
                {/* Date Field - Always visible at top */}
                <div className="space-y-1">
                  <Label className="text-white flex items-center gap-2 text-sm">
                    <Calendar size={14} />
                    Date
                  </Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    className="bg-white/10 border-white/20 text-white h-9"
                    required
                  />
                </div>

                {/* Status Buttons */}
                <div className="space-y-2">
                  <Label className="text-white text-sm">
                    Attendance Status
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      onClick={() => handleInputChange("status", "present")}
                      className={`h-12 flex flex-col items-center justify-center gap-1 text-xs transition-all ${
                        formData.status === "present"
                          ? "!bg-green-600/80 hover:!bg-green-700 text-white border-green-400"
                          : "!bg-white/10 hover:!bg-white/20 text-white border-white/20"
                      }`}
                      variant="outline"
                    >
                      <CheckCircle className="text-green-400" size={16} />
                      Present
                    </Button>

                    <Button
                      type="button"
                      onClick={() => handleInputChange("status", "late")}
                      className={`h-12 flex flex-col items-center justify-center gap-1 text-xs transition-all ${
                        formData.status === "late"
                          ? "!bg-yellow-600/80 hover:!bg-yellow-700 text-white border-yellow-400"
                          : "!bg-white/10 hover:!bg-white/20 text-white border-white/20"
                      }`}
                      variant="outline"
                    >
                      <AlertCircle className="text-yellow-400" size={16} />
                      Late
                    </Button>

                    <Button
                      type="button"
                      onClick={() => handleInputChange("status", "half-day")}
                      className={`h-12 flex flex-col items-center justify-center gap-1 text-xs transition-all ${
                        formData.status === "half-day"
                          ? "!bg-blue-600/80 hover:!bg-blue-700 text-white border-blue-400"
                          : "!bg-white/10 hover:!bg-white/20 text-white border-white/20"
                      }`}
                      variant="outline"
                    >
                      <Clock className="text-blue-400" size={16} />
                      Half Day
                    </Button>

                    <Button
                      type="button"
                      onClick={() => handleInputChange("status", "absent")}
                      className={`h-12 flex flex-col items-center justify-center gap-1 text-xs transition-all ${
                        formData.status === "absent"
                          ? "!bg-red-600/80 hover:!bg-red-700 text-white border-red-400"
                          : "!bg-white/10 hover:!bg-white/20 text-white border-white/20"
                      }`}
                      variant="outline"
                    >
                      <XCircle className="text-red-400" size={16} />
                      Absent
                    </Button>
                  </div>
                </div>

                {/* Time Fields - Only show if not absent */}
                {formData.status !== "absent" && (
                  <>
                    {/* Check In Time */}
                    <div className="space-y-1">
                      <Label className="text-white flex items-center gap-2 text-sm">
                        <Clock size={14} />
                        Check In Time
                      </Label>
                      <Input
                        type="time"
                        value={formData.checkIn}
                        onChange={(e) =>
                          handleInputChange("checkIn", e.target.value)
                        }
                        className="bg-white/10 border-white/20 text-white h-9"
                        required={formData.status !== "absent"}
                      />
                    </div>

                    {/* Check Out Time */}
                    <div className="space-y-1">
                      <Label className="text-white flex items-center gap-2 text-sm">
                        <Clock size={14} />
                        Check Out Time
                      </Label>
                      <Input
                        type="time"
                        value={formData.checkOut}
                        onChange={(e) =>
                          handleInputChange("checkOut", e.target.value)
                        }
                        className="bg-white/10 border-white/20 text-white h-9"
                      />
                    </div>

                    {/* Hours Worked Display */}
                    {hoursWorked > 0 && (
                      <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex justify-between items-center">
                          <span className="text-white/70 text-sm">
                            Hours Worked:
                          </span>
                          <span className="text-white font-bold">
                            {hoursWorked} hours
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Notes */}
                <div className="space-y-1">
                  <Label className="text-white text-sm">Notes (Optional)</Label>
                  <Textarea
                    placeholder="Add any additional notes about attendance..."
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 resize-none text-sm h-16"
                  />
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="p-4 pt-3 border-t border-white/10">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="flex-1 !bg-transparent border-white/20 text-white hover:bg-white/10 h-9 text-sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-blue-600/80 hover:bg-blue-700 text-white border-0 h-9 text-sm"
                  >
                    Add Attendance
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
