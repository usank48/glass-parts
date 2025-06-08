import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Save,
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Building,
  DollarSign,
  Badge,
} from "lucide-react";
import { toast } from "sonner";

interface AddStaffDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStaff: (staff: NewStaffMember) => void;
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

export const AddStaffDialog: React.FC<AddStaffDialogProps> = ({
  isOpen,
  onClose,
  onAddStaff,
}) => {
  const [formData, setFormData] = useState<NewStaffMember>({
    name: "",
    email: "",
    phone: "",
    role: "",
    department: "",
    address: "",
    joinDate: new Date().toISOString().split("T")[0], // Today's date
    salary: "",
    employeeId: "",
    skills: [],
    workingHours: "9:00 AM - 5:00 PM",
    status: "Active",
  });

  const [skillInput, setSkillInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const departments = [
    "Management",
    "Operations",
    "Sales",
    "Finance",
    "IT",
    "HR",
    "Marketing",
    "Warehouse",
  ];

  const roles = [
    "Administrator",
    "Manager",
    "Team Lead",
    "Senior Associate",
    "Associate",
    "Intern",
    "Inventory Manager",
    "Sales Associate",
    "Accountant",
    "HR Specialist",
    "IT Support",
    "Warehouse Supervisor",
  ];

  const handleInputChange = (field: keyof NewStaffMember, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const generateEmployeeId = () => {
    const prefix = "EMP";
    const timestamp = Date.now().toString().slice(-6);
    return `${prefix}${timestamp}`;
  };

  const validateForm = (): boolean => {
    const required = ["name", "email", "phone", "role", "department"];
    const missing = required.filter(
      (field) => !formData[field as keyof NewStaffMember],
    );

    if (missing.length > 0) {
      toast.error(`Please fill in required fields: ${missing.join(", ")}`);
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Generate employee ID if not provided
      const staffData = {
        ...formData,
        employeeId: formData.employeeId || generateEmployeeId(),
        salary: formData.salary || "₹50,000", // Default salary
      };

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onAddStaff(staffData);
      toast.success(`${staffData.name} has been added to the team!`);
      handleClose();
    } catch (error) {
      toast.error("Failed to add staff member. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "",
      department: "",
      address: "",
      joinDate: new Date().toISOString().split("T")[0],
      salary: "",
      employeeId: "",
      skills: [],
      workingHours: "9:00 AM - 5:00 PM",
      status: "Active",
    });
    setSkillInput("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white/10 backdrop-blur-md border border-white/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-3">
            <User size={24} />
            Add New Staff Member
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <User size={18} />
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-white/90">Full Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/50 h-10"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white/90">Employee ID</Label>
                <Input
                  value={formData.employeeId}
                  onChange={(e) =>
                    handleInputChange("employeeId", e.target.value)
                  }
                  className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/50 h-10"
                  placeholder="Auto-generated if empty"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white/90 flex items-center gap-2">
                  <Mail size={16} />
                  Email Address *
                </Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/50 h-10"
                  placeholder="john@autoparts.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white/90 flex items-center gap-2">
                  <Phone size={16} />
                  Phone Number *
                </Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/50 h-10"
                  placeholder="+1 (555) 123-4567"
                  required
                />
              </div>
            </div>
          </div>

          {/* Role & Department */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Shield size={18} />
              Role & Department
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-white/90">Role *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleInputChange("role", value)}
                >
                  <SelectTrigger className="w-full bg-white/10 border-white/20 text-white h-10">
                    <SelectValue placeholder="Select role..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white/90 backdrop-blur-md border border-white/20">
                    {roles.map((role) => (
                      <SelectItem
                        key={role}
                        value={role}
                        className="text-black"
                      >
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-white/90 flex items-center gap-2">
                  <Building size={16} />
                  Department *
                </Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) =>
                    handleInputChange("department", value)
                  }
                >
                  <SelectTrigger className="w-full bg-white/10 border-white/20 text-white h-10">
                    <SelectValue placeholder="Select department..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white/90 backdrop-blur-md border border-white/20">
                    {departments.map((dept) => (
                      <SelectItem
                        key={dept}
                        value={dept}
                        className="text-black"
                      >
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-white/90 flex items-center gap-2">
                  <DollarSign size={16} />
                  Salary
                </Label>
                <Input
                  value={formData.salary}
                  onChange={(e) => handleInputChange("salary", e.target.value)}
                  className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/50 h-10"
                  placeholder="₹50,000"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white/90">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange("status", value)}
                >
                  <SelectTrigger className="w-full bg-white/10 border-white/20 text-white h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white/90 backdrop-blur-md border border-white/20">
                    <SelectItem value="Active" className="text-black">
                      Active
                    </SelectItem>
                    <SelectItem value="Inactive" className="text-black">
                      Inactive
                    </SelectItem>
                    <SelectItem value="On Leave" className="text-black">
                      On Leave
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <MapPin size={18} />
              Additional Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-white/90 flex items-center gap-2">
                  <Calendar size={16} />
                  Join Date
                </Label>
                <Input
                  type="date"
                  value={formData.joinDate}
                  onChange={(e) =>
                    handleInputChange("joinDate", e.target.value)
                  }
                  className="w-full bg-white/10 border-white/20 text-white h-10"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white/90">Working Hours</Label>
                <Input
                  value={formData.workingHours}
                  onChange={(e) =>
                    handleInputChange("workingHours", e.target.value)
                  }
                  className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/50 h-10"
                  placeholder="9:00 AM - 5:00 PM"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white/90">Address</Label>
              <Textarea
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[80px] resize-none"
                placeholder="Street address, City, State, ZIP"
              />
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Badge size={18} />
              Skills & Expertise
            </h3>

            <div className="space-y-3">
              <div className="flex gap-3">
                <Input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 h-10"
                  placeholder="Add a skill..."
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addSkill())
                  }
                />
                <Button
                  type="button"
                  onClick={addSkill}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white border-0 h-10 px-4"
                >
                  Add
                </Button>
              </div>

              {formData.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-sm"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="text-white/70 hover:text-white ml-1"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/20">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="border-white/20 text-white hover:bg-white/10 bg-transparent backdrop-blur-sm"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 text-white border-0"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Adding...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-1" />
                  Add Staff Member
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
