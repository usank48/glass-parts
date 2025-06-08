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
import {
  Lock,
  Eye,
  EyeOff,
  Check,
  X,
  Shield,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

interface ChangePasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface PasswordRequirement {
  label: string;
  regex: RegExp;
  met: boolean;
}

export const ChangePasswordDialog: React.FC<ChangePasswordDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const [form, setForm] = useState<PasswordForm>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  // Password requirements
  const requirements: PasswordRequirement[] = [
    {
      label: "At least 8 characters long",
      regex: /.{8,}/,
      met: form.newPassword.length >= 8,
    },
    {
      label: "Contains uppercase letter",
      regex: /[A-Z]/,
      met: /[A-Z]/.test(form.newPassword),
    },
    {
      label: "Contains lowercase letter",
      regex: /[a-z]/,
      met: /[a-z]/.test(form.newPassword),
    },
    {
      label: "Contains number",
      regex: /\d/,
      met: /\d/.test(form.newPassword),
    },
    {
      label: "Contains special character",
      regex: /[!@#$%^&*(),.?":{}|<>]/,
      met: /[!@#$%^&*(),.?":{}|<>]/.test(form.newPassword),
    },
  ];

  const allRequirementsMet = requirements.every((req) => req.met);
  const passwordsMatch =
    form.newPassword === form.confirmPassword && form.confirmPassword !== "";
  const canSubmit =
    allRequirementsMet && passwordsMatch && form.currentPassword !== "";

  const handleInputChange = (field: keyof PasswordForm, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canSubmit) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In real app, validate current password and update
      if (form.currentPassword === "wrongpassword") {
        toast.error("Current password is incorrect");
        return;
      }

      toast.success("Password changed successfully!");
      handleClose();
    } catch (error) {
      toast.error("Failed to change password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setShowPasswords({
      current: false,
      new: false,
      confirm: false,
    });
    onClose();
  };

  const getPasswordStrength = () => {
    const metCount = requirements.filter((req) => req.met).length;
    if (metCount === 0)
      return { label: "Very Weak", color: "bg-red-500", width: "20%" };
    if (metCount <= 2)
      return { label: "Weak", color: "bg-red-400", width: "40%" };
    if (metCount <= 3)
      return { label: "Fair", color: "bg-yellow-500", width: "60%" };
    if (metCount <= 4)
      return { label: "Good", color: "bg-green-400", width: "80%" };
    return { label: "Strong", color: "bg-green-500", width: "100%" };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-white/10 backdrop-blur-md border border-white/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-3">
            <Lock size={24} />
            Change Password
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Security Notice */}
          <div className="flex items-start gap-3 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
            <Shield size={20} className="text-blue-300 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-blue-200 font-medium">Security Tip</p>
              <p className="text-blue-300/80">
                Use a strong, unique password that you don't use elsewhere.
              </p>
            </div>
          </div>

          {/* Current Password */}
          <div className="space-y-2">
            <Label className="text-white/90">Current Password</Label>
            <div className="relative">
              <Input
                type={showPasswords.current ? "text" : "password"}
                value={form.currentPassword}
                onChange={(e) =>
                  handleInputChange("currentPassword", e.target.value)
                }
                className="bg-white/10 border-white/20 text-white pr-10"
                placeholder="Enter your current password"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("current")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
              >
                {showPasswords.current ? (
                  <EyeOff size={16} />
                ) : (
                  <Eye size={16} />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <Label className="text-white/90">New Password</Label>
            <div className="relative">
              <Input
                type={showPasswords.new ? "text" : "password"}
                value={form.newPassword}
                onChange={(e) =>
                  handleInputChange("newPassword", e.target.value)
                }
                className="bg-white/10 border-white/20 text-white pr-10"
                placeholder="Enter your new password"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
              >
                {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {form.newPassword && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/70">Password Strength</span>
                  <span
                    className={`font-medium ${
                      passwordStrength.label === "Strong"
                        ? "text-green-400"
                        : passwordStrength.label === "Good"
                          ? "text-green-300"
                          : passwordStrength.label === "Fair"
                            ? "text-yellow-400"
                            : "text-red-400"
                    }`}
                  >
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                    style={{ width: passwordStrength.width }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Password Requirements */}
          {form.newPassword && (
            <div className="space-y-2">
              <Label className="text-white/90 text-sm">
                Password Requirements
              </Label>
              <div className="space-y-1">
                {requirements.map((req, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    {req.met ? (
                      <Check size={12} className="text-green-400" />
                    ) : (
                      <X size={12} className="text-red-400" />
                    )}
                    <span
                      className={req.met ? "text-green-300" : "text-white/60"}
                    >
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label className="text-white/90">Confirm New Password</Label>
            <div className="relative">
              <Input
                type={showPasswords.confirm ? "text" : "password"}
                value={form.confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                className="bg-white/10 border-white/20 text-white pr-10"
                placeholder="Confirm your new password"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirm")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
              >
                {showPasswords.confirm ? (
                  <EyeOff size={16} />
                ) : (
                  <Eye size={16} />
                )}
              </button>
            </div>

            {/* Password Match Indicator */}
            {form.confirmPassword && (
              <div className="flex items-center gap-2 text-xs">
                {passwordsMatch ? (
                  <>
                    <Check size={12} className="text-green-400" />
                    <span className="text-green-300">Passwords match</span>
                  </>
                ) : (
                  <>
                    <X size={12} className="text-red-400" />
                    <span className="text-red-300">Passwords don't match</span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Warning */}
          {!allRequirementsMet && form.newPassword && (
            <div className="flex items-start gap-2 p-2 bg-yellow-500/20 border border-yellow-500/30 rounded">
              <AlertTriangle
                size={16}
                className="text-yellow-400 flex-shrink-0 mt-0.5"
              />
              <p className="text-yellow-200 text-xs">
                Please meet all password requirements before continuing.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/20">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="border-white/20 text-white hover:bg-white/10"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!canSubmit || isLoading}
              className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Changing...
                </>
              ) : (
                <>
                  <Lock size={16} className="mr-1" />
                  Change Password
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
