import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Shield,
  Plus,
  DollarSign,
  Calendar,
} from "lucide-react";
import { GlassCard } from "./GlassCard";
import { StaffDetail } from "./StaffDetail";
import { AddStaffDialog } from "./dialogs/AddStaffDialog";
import { AddPaymentDialog } from "./dialogs/AddPaymentDialog";
import { AddAttendanceDialog } from "./dialogs/AddAttendanceDialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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

interface NewStaffMember {
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  address: string;
  joinDate: string;
  salary: string;
  employeeId: string;
  skills: string[];
  workingHours: string;
  status: string;
}

export const Staff = () => {
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [showAddStaffDialog, setShowAddStaffDialog] = useState(false);
  const [showAddPaymentDialog, setShowAddPaymentDialog] = useState(false);
  const [showAddAttendanceDialog, setShowAddAttendanceDialog] = useState(false);
  const [selectedStaffForAction, setSelectedStaffForAction] =
    useState<StaffMember | null>(null);

  console.log("🔄 Staff component rendered, selectedStaff:", selectedStaff);

  const [staff, setStaff] = useState<StaffMember[]>([
    {
      id: 1,
      name: "John Doe",
      email: "john@autoparts.com",
      phone: "+1 (555) 123-4567",
      role: "Administrator",
      department: "Management",
      status: "Active",
      avatar: "/lovable-uploads/80a199da-357d-4258-8a67-1286308b2c97.png",
      address: "123 Main St, San Francisco, CA 94105",
      joinDate: "January 15, 2020",
      salary: "₹85,000",
      skills: [
        "Leadership",
        "Project Management",
        "Strategic Planning",
        "Team Building",
      ],
      reports: ["Sarah Wilson", "Mike Chen", "Lisa Rodriguez"],
      projects: ["Q4 Sales Strategy", "Team Expansion", "System Modernization"],
      // Enhanced HR data
      employeeId: "EMP001",
      totalSalary: 85000,
      currentMonthPay: 7200,
      attendancePercentage: 98,
      leaveBalance: {
        annual: 18,
        sick: 8,
        personal: 5,
      },
      recentAttendance: [
        {
          date: "Dec 6, 2024",
          status: "present",
          checkIn: "8:30 AM",
          checkOut: "5:45 PM",
          hoursWorked: 9.25,
        },
        {
          date: "Dec 5, 2024",
          status: "present",
          checkIn: "8:15 AM",
          checkOut: "6:00 PM",
          hoursWorked: 9.75,
        },
        {
          date: "Dec 4, 2024",
          status: "present",
          checkIn: "8:45 AM",
          checkOut: "5:30 PM",
          hoursWorked: 8.75,
        },
        {
          date: "Dec 3, 2024",
          status: "late",
          checkIn: "9:15 AM",
          checkOut: "6:15 PM",
          hoursWorked: 9,
        },
        {
          date: "Dec 2, 2024",
          status: "present",
          checkIn: "8:20 AM",
          checkOut: "5:50 PM",
          hoursWorked: 9.5,
        },
      ],
      paymentHistory: [
        {
          month: "November 2024",
          amount: 7200,
          date: "Nov 30, 2024",
          bonus: 500,
        },
        { month: "October 2024", amount: 7200, date: "Oct 31, 2024" },
        {
          month: "September 2024",
          amount: 7200,
          date: "Sep 30, 2024",
          bonus: 800,
        },
      ],
      performanceMetrics: [
        { metric: "Team Goals", value: 8, target: 10, period: "Q4 2024" },
        {
          metric: "Project Delivery",
          value: 95,
          target: 100,
          period: "This Month",
        },
        {
          metric: "Leadership Score",
          value: 4.5,
          target: 5,
          period: "Last Review",
        },
      ],
      workingHours: {
        standard: "8:30 AM - 5:30 PM",
        overtime: 12,
        flexible: true,
      },
      lastReview: {
        date: "Sep 15, 2024",
        rating: 4,
        reviewer: "CEO",
      },
    },
    {
      id: 2,
      name: "Sarah Wilson",
      email: "sarah@autoparts.com",
      phone: "+1 (555) 234-5678",
      role: "Inventory Manager",
      department: "Operations",
      status: "Active",
      address: "456 Oak Ave, San Francisco, CA 94102",
      joinDate: "March 22, 2021",
      salary: "₹68,000",
      skills: [
        "Inventory Management",
        "Data Analysis",
        "Supply Chain",
        "Process Optimization",
      ],
      reports: [],
      projects: [
        "Inventory Automation",
        "Warehouse Optimization",
        "Supplier Integration",
      ],
      // Enhanced HR data
      employeeId: "EMP002",
      totalSalary: 68000,
      currentMonthPay: 5800,
      attendancePercentage: 96,
      leaveBalance: {
        annual: 15,
        sick: 12,
        personal: 3,
      },
      recentAttendance: [
        {
          date: "Dec 6, 2024",
          status: "present",
          checkIn: "9:00 AM",
          checkOut: "6:00 PM",
          hoursWorked: 9,
        },
        {
          date: "Dec 5, 2024",
          status: "present",
          checkIn: "8:45 AM",
          checkOut: "5:45 PM",
          hoursWorked: 9,
        },
        {
          date: "Dec 4, 2024",
          status: "half-day",
          checkIn: "9:00 AM",
          checkOut: "1:00 PM",
          hoursWorked: 4,
        },
        {
          date: "Dec 3, 2024",
          status: "present",
          checkIn: "8:50 AM",
          checkOut: "6:10 PM",
          hoursWorked: 9.33,
        },
        {
          date: "Dec 2, 2024",
          status: "present",
          checkIn: "9:05 AM",
          checkOut: "6:05 PM",
          hoursWorked: 9,
        },
      ],
      paymentHistory: [
        { month: "November 2024", amount: 5800, date: "Nov 30, 2024" },
        {
          month: "October 2024",
          amount: 5800,
          date: "Oct 31, 2024",
          bonus: 300,
        },
        { month: "September 2024", amount: 5800, date: "Sep 30, 2024" },
      ],
      performanceMetrics: [
        {
          metric: "Inventory Accuracy",
          value: 98,
          target: 95,
          period: "This Month",
        },
        {
          metric: "Process Efficiency",
          value: 92,
          target: 90,
          period: "Q4 2024",
        },
        { metric: "Cost Reduction", value: 15, target: 10, period: "YTD 2024" },
      ],
      workingHours: {
        standard: "9:00 AM - 6:00 PM",
        overtime: 8,
        flexible: false,
      },
      lastReview: {
        date: "Aug 10, 2024",
        rating: 5,
        reviewer: "John Doe",
      },
    },
    {
      id: 3,
      name: "Mike Chen",
      email: "mike@autoparts.com",
      phone: "+1 (555) 345-6789",
      role: "Sales Associate",
      department: "Sales",
      status: "Active",
      address: "789 Pine St, San Francisco, CA 94108",
      joinDate: "June 10, 2022",
      salary: "₹55,000",
      skills: [
        "Customer Relations",
        "Sales Strategy",
        "Product Knowledge",
        "Negotiation",
      ],
      reports: [],
      projects: [
        "Customer Outreach Program",
        "Sales Training Initiative",
        "Market Research",
      ],
      // Enhanced HR data
      employeeId: "EMP003",
      totalSalary: 55000,
      currentMonthPay: 4950,
      attendancePercentage: 94,
      leaveBalance: {
        annual: 20,
        sick: 10,
        personal: 8,
      },
      recentAttendance: [
        {
          date: "Dec 6, 2024",
          status: "present",
          checkIn: "8:30 AM",
          checkOut: "5:30 PM",
          hoursWorked: 9,
        },
        {
          date: "Dec 5, 2024",
          status: "absent",
          checkIn: "",
          checkOut: "",
          hoursWorked: 0,
        },
        {
          date: "Dec 4, 2024",
          status: "present",
          checkIn: "8:45 AM",
          checkOut: "5:45 PM",
          hoursWorked: 9,
        },
        {
          date: "Dec 3, 2024",
          status: "present",
          checkIn: "8:25 AM",
          checkOut: "5:35 PM",
          hoursWorked: 9.17,
        },
        {
          date: "Dec 2, 2024",
          status: "late",
          checkIn: "9:30 AM",
          checkOut: "6:30 PM",
          hoursWorked: 9,
        },
      ],
      paymentHistory: [
        {
          month: "November 2024",
          amount: 4950,
          date: "Nov 30, 2024",
          bonus: 600,
        },
        {
          month: "October 2024",
          amount: 4950,
          date: "Oct 31, 2024",
          bonus: 1200,
        },
        {
          month: "September 2024",
          amount: 4950,
          date: "Sep 30, 2024",
          bonus: 800,
        },
      ],
      performanceMetrics: [
        {
          metric: "Sales Target",
          value: 85,
          target: 100,
          period: "This Month",
        },
        {
          metric: "Customer Satisfaction",
          value: 4.8,
          target: 4.5,
          period: "Q4 2024",
        },
        {
          metric: "Lead Conversion",
          value: 35,
          target: 30,
          period: "This Month",
        },
      ],
      workingHours: {
        standard: "8:30 AM - 5:30 PM",
        overtime: 5,
        flexible: true,
      },
      lastReview: {
        date: "Jul 20, 2024",
        rating: 4,
        reviewer: "John Doe",
      },
    },
    {
      id: 4,
      name: "Lisa Rodriguez",
      email: "lisa@autoparts.com",
      phone: "+1 (555) 456-7890",
      role: "Accountant",
      department: "Finance",
      status: "On Leave",
      address: "321 Elm St, San Francisco, CA 94110",
      joinDate: "September 5, 2021",
      salary: "₹62,000",
      skills: [
        "Financial Analysis",
        "Tax Preparation",
        "Budgeting",
        "QuickBooks",
        "Excel",
      ],
      reports: [],
      projects: [
        "Annual Budget Planning",
        "Tax Compliance Update",
        "Financial Reporting System",
      ],
      // Enhanced HR data
      employeeId: "EMP004",
      totalSalary: 62000,
      currentMonthPay: 0, // On leave
      attendancePercentage: 88,
      leaveBalance: {
        annual: 5, // Used most for maternity leave
        sick: 15,
        personal: 0,
      },
      recentAttendance: [
        {
          date: "Dec 6, 2024",
          status: "absent",
          checkIn: "",
          checkOut: "",
          hoursWorked: 0,
        },
        {
          date: "Dec 5, 2024",
          status: "absent",
          checkIn: "",
          checkOut: "",
          hoursWorked: 0,
        },
        {
          date: "Dec 4, 2024",
          status: "absent",
          checkIn: "",
          checkOut: "",
          hoursWorked: 0,
        },
        {
          date: "Dec 3, 2024",
          status: "absent",
          checkIn: "",
          checkOut: "",
          hoursWorked: 0,
        },
        {
          date: "Dec 2, 2024",
          status: "absent",
          checkIn: "",
          checkOut: "",
          hoursWorked: 0,
        },
      ],
      paymentHistory: [
        { month: "November 2024", amount: 0, date: "Nov 30, 2024" }, // Unpaid leave
        { month: "October 2024", amount: 2580, date: "Oct 31, 2024" }, // Partial month before leave
        { month: "September 2024", amount: 5200, date: "Sep 30, 2024" },
      ],
      performanceMetrics: [
        {
          metric: "Report Accuracy",
          value: 99,
          target: 98,
          period: "Before Leave",
        },
        {
          metric: "Deadline Adherence",
          value: 95,
          target: 90,
          period: "Q3 2024",
        },
        {
          metric: "Process Improvement",
          value: 3,
          target: 2,
          period: "YTD 2024",
        },
      ],
      workingHours: {
        standard: "9:00 AM - 5:00 PM",
        overtime: 0, // On leave
        flexible: false,
      },
      lastReview: {
        date: "Jun 5, 2024",
        rating: 5,
        reviewer: "John Doe",
      },
    },
  ]);

  const handleStaffClick = (member: StaffMember) => {
    console.log("🎯 Staff clicked:", member.name, "ID:", member.id);
    console.log("📋 Setting selectedStaff to:", member);
    setSelectedStaff(member);
  };

  const handleBackToList = () => {
    setSelectedStaff(null);
  };

  const handleEditStaff = (staff: StaffMember) => {
    // TODO: Implement edit functionality
    console.log("Edit staff:", staff);
  };

  const handleDeleteStaff = (staffId: number) => {
    // TODO: Implement delete functionality
    console.log("Delete staff:", staffId);
  };

  const handleAddStaff = (newStaffData: NewStaffMember) => {
    const newId = Math.max(...staff.map((s) => s.id), 0) + 1;

    // Convert salary string to number for calculations
    const salaryNumber =
      parseInt(newStaffData.salary.replace(/[₹,]/g, "")) || 50000;

    const newStaffMember: StaffMember = {
      id: newId,
      name: newStaffData.name,
      email: newStaffData.email,
      phone: newStaffData.phone,
      role: newStaffData.role,
      department: newStaffData.department,
      status: newStaffData.status,
      address: newStaffData.address,
      joinDate: new Date(newStaffData.joinDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      salary: newStaffData.salary,
      skills: newStaffData.skills,
      reports: [],
      projects: [],
      // Enhanced HR data with defaults
      employeeId: newStaffData.employeeId,
      totalSalary: salaryNumber,
      currentMonthPay: Math.round(salaryNumber / 12),
      attendancePercentage: 100, // New employee starts with 100%
      leaveBalance: {
        annual: 25, // Standard annual leave
        sick: 12,
        personal: 5,
      },
      recentAttendance: [], // Empty for new employee
      paymentHistory: [],
      performanceMetrics: [],
      workingHours: {
        standard: newStaffData.workingHours,
        overtime: 0,
        flexible: true,
      },
      lastReview: {
        date: "Not yet reviewed",
        rating: 0,
        reviewer: "Pending",
      },
    };

    setStaff((prevStaff) => [...prevStaff, newStaffMember]);
    toast.success(
      `${newStaffData.name} has been successfully added to the team!`,
    );
  };

  const handleAddPayment = () => {
    if (staff.length === 0) {
      toast.error("No staff members available. Please add staff first.");
      return;
    }
    // For now, let's select the first active staff member as default
    const activeStaff = staff.find((s) => s.status === "Active");
    if (activeStaff) {
      setSelectedStaffForAction(activeStaff);
      setShowAddPaymentDialog(true);
    } else {
      toast.error("No active staff members found.");
    }
  };

  const handleAddAttendance = () => {
    if (staff.length === 0) {
      toast.error("No staff members available. Please add staff first.");
      return;
    }
    // For now, let's select the first active staff member as default
    const activeStaff = staff.find((s) => s.status === "Active");
    if (activeStaff) {
      setSelectedStaffForAction(activeStaff);
      setShowAddAttendanceDialog(true);
    } else {
      toast.error("No active staff members found.");
    }
  };

  const handlePaymentSubmit = (payment: PaymentRecord) => {
    if (!selectedStaffForAction) return;

    // Update the selected staff member's payment history
    setStaff((prevStaff) =>
      prevStaff.map((member) =>
        member.id === selectedStaffForAction.id
          ? {
              ...member,
              paymentHistory: [payment, ...(member.paymentHistory || [])],
              currentMonthPay: payment.amount,
            }
          : member,
      ),
    );

    toast.success(
      `Payment of ₹${payment.amount} added for ${selectedStaffForAction.name}!`,
    );
    setSelectedStaffForAction(null);
  };

  const handleAttendanceSubmit = (attendance: AttendanceRecord) => {
    if (!selectedStaffForAction) return;

    // Update the selected staff member's attendance records
    setStaff((prevStaff) =>
      prevStaff.map((member) =>
        member.id === selectedStaffForAction.id
          ? {
              ...member,
              recentAttendance: [
                attendance,
                ...(member.recentAttendance || []).slice(0, 4),
              ], // Keep only 5 recent records
            }
          : member,
      ),
    );

    toast.success(
      `Attendance record added for ${selectedStaffForAction.name}!`,
    );
    setSelectedStaffForAction(null);
  };

  // If a staff member is selected, show the detail view
  if (selectedStaff) {
    return (
      <StaffDetail
        staff={selectedStaff}
        onBack={handleBackToList}
        onEdit={handleEditStaff}
        onDelete={handleDeleteStaff}
      />
    );
  }

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
      case "Manager":
        return "from-purple-500 to-indigo-600";
      case "Team Lead":
        return "from-cyan-500 to-blue-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Action Buttons */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Staff Management
          </h1>
          <p className="text-white/70 mt-1 text-sm sm:text-base">
            Manage your team members and their roles
          </p>
          <p className="text-white/50 text-xs sm:text-sm mt-2">
            Total Staff: {staff.length} • Active:{" "}
            {staff.filter((s) => s.status === "Active").length} • On Leave:{" "}
            {staff.filter((s) => s.status === "On Leave").length}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Add Payment Button */}
          <Button
            onClick={handleAddPayment}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 w-full sm:w-auto"
          >
            <DollarSign size={20} className="mr-2" />
            Add Payment
          </Button>

          {/* Add Attendance Button */}
          <Button
            onClick={handleAddAttendance}
            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white border-0 w-full sm:w-auto"
          >
            <Calendar size={20} className="mr-2" />
            Attendance
          </Button>

          {/* Add New Staff Button */}
          <Button
            onClick={() => setShowAddStaffDialog(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 w-full sm:w-auto"
          >
            <Plus size={20} className="mr-2" />
            Add New Staff
          </Button>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {staff.map((member) => (
          <GlassCard
            key={member.id}
            className="p-6 hover:bg-white/15 transition-all duration-200 cursor-pointer transform hover:scale-105"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("🖱️ Card clicked for:", member.name);
              handleStaffClick(member);
            }}
          >
            <div className="text-center mb-4">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                <User className="text-white" size={24} />
              </div>
              <h3 className="text-white font-semibold text-lg">
                {member.name}
              </h3>
              <div
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 bg-gradient-to-r ${getRoleColor(member.role)} text-white`}
              >
                {member.role}
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Mail className="text-white/50" size={16} />
                <span className="text-white truncate">{member.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-white/50" size={16} />
                <span className="text-white">{member.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="text-white/50" size={16} />
                <span className="text-white">{member.department}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="flex justify-between items-center">
                <span className="text-white/70 text-sm">Status</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    member.status === "Active"
                      ? "bg-green-500/20 text-green-300"
                      : "bg-yellow-500/20 text-yellow-300"
                  }`}
                >
                  {member.status}
                </span>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Dialog Components */}
      <AddStaffDialog
        isOpen={showAddStaffDialog}
        onClose={() => setShowAddStaffDialog(false)}
        onAddStaff={handleAddStaff}
      />

      {/* Add Payment Dialog */}
      {selectedStaffForAction && (
        <AddPaymentDialog
          employeeName={selectedStaffForAction.name}
          onClose={() => {
            setShowAddPaymentDialog(false);
            setSelectedStaffForAction(null);
          }}
          onSubmit={handlePaymentSubmit}
        />
      )}

      {/* Add Attendance Dialog */}
      {selectedStaffForAction && (
        <AddAttendanceDialog
          employeeName={selectedStaffForAction.name}
          onClose={() => {
            setShowAddAttendanceDialog(false);
            setSelectedStaffForAction(null);
          }}
          onSubmit={handleAttendanceSubmit}
        />
      )}
    </div>
  );
};
