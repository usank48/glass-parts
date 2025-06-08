import React, { useState } from "react";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Shield,
  MapPin,
  Calendar,
  Star,
  Edit,
  Trash2,
  DollarSign,
  Clock,
  TrendingUp,
  Award,
  Coffee,
  Target,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
} from "lucide-react";
import { GlassCard } from "./GlassCard";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "@/components/ui/progress";
import { AddPaymentDialog } from "./dialogs/AddPaymentDialog";
import { AddAttendanceDialog } from "./dialogs/AddAttendanceDialog";

interface AttendanceRecord {
  date: string;
  status: "present" | "absent" | "late" | "half-day";
  checkIn?: string;
  checkOut?: string;
  hoursWorked?: number;
}

interface PaymentRecord {
  month: string;
  amount: number;
  date: string;
  deductions?: number;
  bonus?: number;
}

interface PerformanceMetric {
  metric: string;
  value: number;
  target: number;
  period: string;
}

interface StaffMember {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: string;
  avatar?: string;
  address?: string;
  joinDate?: string;
  salary?: string;
  skills?: string[];
  reports?: string[];
  projects?: string[];
  // Enhanced HR fields
  employeeId?: string;
  totalSalary?: number;
  currentMonthPay?: number;
  attendancePercentage?: number;
  leaveBalance?: {
    annual: number;
    sick: number;
    personal: number;
  };
  recentAttendance?: AttendanceRecord[];
  paymentHistory?: PaymentRecord[];
  performanceMetrics?: PerformanceMetric[];
  workingHours?: {
    standard: string;
    overtime: number;
    flexible: boolean;
  };
  lastReview?: {
    date: string;
    rating: number;
    reviewer: string;
  };
}

interface StaffDetailProps {
  staff: StaffMember;
  onBack: () => void;
  onEdit?: (staff: StaffMember) => void;
  onDelete?: (staffId: number) => void;
}

export const StaffDetail: React.FC<StaffDetailProps> = ({
  staff,
  onBack,
  onEdit,
  onDelete,
}) => {
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showAttendanceDialog, setShowAttendanceDialog] = useState(false);
  const [staffData, setStaffData] = useState(staff);

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Administrator":
        return "from-red-500 to-pink-600";
      case "Inventory Manager":
        return "from-blue-500 to-purple-600";
      case "Sales Associate":
        return "from-green-500 to-teal-600";
      case "Accountant":
        return "from-orange-500 to-yellow-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "On Leave":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "Inactive":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const getAttendanceStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle className="text-green-400" size={16} />;
      case "absent":
        return <XCircle className="text-red-400" size={16} />;
      case "late":
        return <AlertCircle className="text-yellow-400" size={16} />;
      case "half-day":
        return <Clock className="text-blue-400" size={16} />;
      default:
        return <Clock className="text-gray-400" size={16} />;
    }
  };

  const getAttendanceStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-500/20 text-green-300";
      case "absent":
        return "bg-red-500/20 text-red-300";
      case "late":
        return "bg-yellow-500/20 text-yellow-300";
      case "half-day":
        return "bg-blue-500/20 text-blue-300";
      default:
        return "bg-gray-500/20 text-gray-300";
    }
  };

  const handleAddPayment = (payment: any) => {
    // In a real app, this would make an API call
    const updatedPaymentHistory = [
      payment,
      ...(staffData.paymentHistory || []),
    ];
    setStaffData((prev) => ({
      ...prev,
      paymentHistory: updatedPaymentHistory,
      currentMonthPay:
        payment.amount + (payment.bonus || 0) - (payment.deductions || 0),
    }));
    console.log("Payment added:", payment);
  };

  const handleAddAttendance = (attendance: any) => {
    // In a real app, this would make an API call
    const updatedAttendance = [
      attendance,
      ...(staffData.recentAttendance || []),
    ];
    setStaffData((prev) => ({
      ...prev,
      recentAttendance: updatedAttendance,
    }));
    console.log("Attendance added:", attendance);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="text-white hover:bg-white/10"
        >
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-white">
            Staff Details: {staffData.name}
          </h1>
          <p className="text-white/70 mt-1">
            Comprehensive employee information and analytics
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Profile Section */}
        <div className="xl:col-span-2 space-y-6">
          {/* Basic Information Card */}
          <GlassCard className="p-8">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center md:items-start">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center mb-4">
                  {staffData.avatar ? (
                    <img
                      src={staffData.avatar}
                      alt={staffData.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="text-white" size={48} />
                  )}
                </div>

                <div
                  className={`inline-block px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r ${getRoleColor(staffData.role)} text-white`}
                >
                  {staffData.role}
                </div>
              </div>

              {/* Info Section */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {staffData.name}
                    </h2>
                    <p className="text-white/70 text-lg">
                      {staffData.department}
                    </p>
                    {staffData.employeeId && (
                      <p className="text-white/50 text-sm mt-1">
                        ID: {staffData.employeeId}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 mt-4 md:mt-0">
                    <Badge
                      variant="outline"
                      className={`${getStatusColor(staffData.status)} border`}
                    >
                      {staffData.status}
                    </Badge>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="text-white/50" size={18} />
                    <span className="text-white">{staffData.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="text-white/50" size={18} />
                    <span className="text-white">{staffData.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="text-white/50" size={18} />
                    <span className="text-white">
                      {staffData.department} Department
                    </span>
                  </div>
                  {staffData.address && (
                    <div className="flex items-center gap-3">
                      <MapPin className="text-white/50" size={18} />
                      <span className="text-white">{staffData.address}</span>
                    </div>
                  )}
                  {staffData.joinDate && (
                    <div className="flex items-center gap-3">
                      <Calendar className="text-white/50" size={18} />
                      <span className="text-white">
                        Joined {staffData.joinDate}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-8 pt-6 border-t border-white/20">
              {onEdit && (
                <Button
                  onClick={() => onEdit(staffData)}
                  className="bg-blue-600/70 hover:bg-blue-600/90 text-white border border-white/20 backdrop-blur-sm"
                >
                  <Edit size={16} className="mr-2" />
                  Edit Profile
                </Button>
              )}
              {onDelete && (
                <Button
                  onClick={() => onDelete(staffData.id)}
                  className="bg-red-600/70 hover:bg-red-600/90 text-white border border-white/20 backdrop-blur-sm"
                >
                  <Trash2 size={16} className="mr-2" />
                  Delete
                </Button>
              )}
            </div>
          </GlassCard>

          {/* Financial Summary */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center gap-3">
                <DollarSign className="text-green-400" size={24} />
                SALARY
              </h3>
              <Button
                onClick={() => setShowPaymentDialog(true)}
                className="bg-green-600/70 hover:bg-green-600/90 text-white border border-white/20 backdrop-blur-sm"
                size="sm"
              >
                <Plus size={16} className="mr-2" />
                Add Payment
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="text-2xl font-bold text-white">
                  ₹
                  {Math.round(
                    (staffData.totalSalary || 0) / 12,
                  ).toLocaleString()}
                </div>
                <p className="text-white/70 text-sm">MONTHLY SALARY</p>
              </div>

              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="text-2xl font-bold text-green-400">
                  ₹{staffData.currentMonthPay?.toLocaleString() || "0"}
                </div>
                <p className="text-white/70 text-sm">PAID THIS MONTH</p>
              </div>
            </div>

            {/* Recent Payment History */}
            {staffData.paymentHistory &&
              staffData.paymentHistory.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-white mb-4">
                    Recent Payments
                  </h4>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {staffData.paymentHistory
                      .slice(0, 5)
                      .map((payment, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/10"
                        >
                          <div>
                            <span className="text-white font-medium">
                              {payment.month}
                            </span>
                            <p className="text-white/70 text-sm">
                              {payment.date}
                            </p>
                            {payment.notes && (
                              <p className="text-white/50 text-xs mt-1">
                                {payment.notes}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <span className="text-green-400 font-semibold">
                              ₹{payment.amount.toLocaleString()}
                            </span>
                            {payment.bonus && (
                              <p className="text-blue-400 text-sm">
                                +₹{payment.bonus} bonus
                              </p>
                            )}
                            {payment.deductions && (
                              <p className="text-red-400 text-sm">
                                -₹{payment.deductions} deductions
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
          </GlassCard>

          {/* Attendance & Time Tracking */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center gap-3">
                <Clock className="text-blue-400" size={24} />
                Attendance & Time Tracking
              </h3>
              <Button
                onClick={() => setShowAttendanceDialog(true)}
                className="bg-blue-600/70 hover:bg-blue-600/90 text-white border border-white/20 backdrop-blur-sm"
                size="sm"
              >
                <Plus size={16} className="mr-2" />
                Add Attendance
              </Button>
            </div>

            {/* Attendance Overview */}
            <div className="grid grid-cols-1 gap-6 mb-6">
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/70">Attendance Rate</span>
                  <span className="text-white font-semibold">
                    {staffData.attendancePercentage || 95}%
                  </span>
                </div>
                <Progress
                  value={staffData.attendancePercentage || 95}
                  className="h-2"
                />
              </div>
            </div>

            {/* Attendance Calendar */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">
                Attendance Calendar
              </h4>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-4">
                  <h5 className="text-white font-medium">December 2024</h5>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-white/70">Present</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <span className="text-white/70">Late</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span className="text-white/70">Absent</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-white/70">Half Day</span>
                    </div>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                  {/* Day Headers */}
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div
                        key={day}
                        className="text-center text-white/70 text-sm font-medium p-2"
                      >
                        {day}
                      </div>
                    ),
                  )}

                  {/* Calendar Days */}
                  {Array.from({ length: 31 }, (_, i) => {
                    const day = i + 1;
                    const attendanceRecord = staffData.recentAttendance?.find(
                      (record) => {
                        const recordDay = parseInt(
                          record.date.split(" ")[1].replace(",", ""),
                        );
                        return recordDay === day;
                      },
                    );

                    const getStatusColor = (status?: string) => {
                      switch (status) {
                        case "present":
                          return "bg-green-500";
                        case "late":
                          return "bg-yellow-500";
                        case "absent":
                          return "bg-red-500";
                        case "half-day":
                          return "bg-blue-500";
                        default:
                          return "bg-white/10";
                      }
                    };

                    return (
                      <div key={day} className="relative">
                        <div
                          className={`w-10 h-10 rounded-lg ${getStatusColor(attendanceRecord?.status)} flex items-center justify-center text-white text-sm font-medium hover:bg-white/20 transition-colors cursor-pointer`}
                          title={
                            attendanceRecord
                              ? `${attendanceRecord.status} - In: ${attendanceRecord.checkIn || "N/A"}, Out: ${attendanceRecord.checkOut || "N/A"}`
                              : "No record"
                          }
                        >
                          {day}
                        </div>
                        {attendanceRecord && (
                          <div className="absolute -bottom-1 -right-1">
                            {getAttendanceStatusIcon(attendanceRecord.status)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Quick Stats */}
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 rounded-lg bg-white/5">
                    <div className="text-white font-semibold text-lg">
                      {staffData.recentAttendance?.filter(
                        (r) => r.status === "present",
                      ).length || 0}
                    </div>
                    <div className="text-white/70 text-sm">Present Days</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-white/5">
                    <div className="text-white font-semibold text-lg">
                      {staffData.recentAttendance?.filter(
                        (r) => r.status === "late",
                      ).length || 0}
                    </div>
                    <div className="text-white/70 text-sm">Late Days</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-white/5">
                    <div className="text-white font-semibold text-lg">
                      {staffData.recentAttendance?.filter(
                        (r) => r.status === "absent",
                      ).length || 0}
                    </div>
                    <div className="text-white/70 text-sm">Absent Days</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-white/5">
                    <div className="text-white font-semibold text-lg">
                      {staffData.recentAttendance?.filter(
                        (r) => r.status === "half-day",
                      ).length || 0}
                    </div>
                    <div className="text-white/70 text-sm">Half Days</div>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Performance Metrics */}
          {staffData.performanceMetrics &&
            staffData.performanceMetrics.length > 0 && (
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="text-purple-400" size={20} />
                  Performance
                </h3>
                <div className="space-y-4">
                  {staffData.performanceMetrics.map((metric, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg bg-white/5 border border-white/10"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white/70 text-sm">
                          {metric.metric}
                        </span>
                        <span className="text-white font-semibold">
                          {metric.value}/{metric.target}
                        </span>
                      </div>
                      <Progress
                        value={(metric.value / metric.target) * 100}
                        className="h-2"
                      />
                      <p className="text-white/50 text-xs mt-1">
                        {metric.period}
                      </p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}

          {/* Leave Balance */}
          {staffData.leaveBalance && (
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Coffee className="text-orange-400" size={20} />
                Leave Balance
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between p-3 rounded-lg bg-white/5">
                  <span className="text-white/70">Annual Leave</span>
                  <span className="text-white font-semibold">
                    {staffData.leaveBalance.annual} days
                  </span>
                </div>
                <div className="flex justify-between p-3 rounded-lg bg-white/5">
                  <span className="text-white/70">Sick Leave</span>
                  <span className="text-white font-semibold">
                    {staffData.leaveBalance.sick} days
                  </span>
                </div>
                <div className="flex justify-between p-3 rounded-lg bg-white/5">
                  <span className="text-white/70">Personal Leave</span>
                  <span className="text-white font-semibold">
                    {staffData.leaveBalance.personal} days
                  </span>
                </div>
              </div>
            </GlassCard>
          )}

          {/* Last Performance Review */}
          {staffData.lastReview && (
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Award className="text-yellow-400" size={20} />
                Last Review
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/70">Date:</span>
                  <span className="text-white">
                    {staffData.lastReview.date}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Rating:</span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={
                          i < staffData.lastReview!.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-400"
                        }
                      />
                    ))}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Reviewer:</span>
                  <span className="text-white">
                    {staffData.lastReview.reviewer}
                  </span>
                </div>
              </div>
            </GlassCard>
          )}

          {/* Skills */}
          {staffData.skills && staffData.skills.length > 0 && (
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Target className="text-green-400" size={20} />
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {staffData.skills.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-white/10 text-white border-white/20"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </GlassCard>
          )}

          {/* Current Projects */}
          {staffData.projects && staffData.projects.length > 0 && (
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Shield className="text-blue-400" size={20} />
                Current Projects
              </h3>
              <div className="space-y-2">
                {staffData.projects.map((project, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg bg-white/5 border border-white/10"
                  >
                    <span className="text-white">{project}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}
        </div>
      </div>

      {/* Payment Dialog */}
      {showPaymentDialog && (
        <AddPaymentDialog
          employeeName={staffData.name}
          onClose={() => setShowPaymentDialog(false)}
          onSubmit={handleAddPayment}
        />
      )}

      {/* Attendance Dialog */}
      {showAttendanceDialog && (
        <AddAttendanceDialog
          employeeName={staffData.name}
          onClose={() => setShowAttendanceDialog(false)}
          onSubmit={handleAddAttendance}
        />
      )}
    </div>
  );
};
