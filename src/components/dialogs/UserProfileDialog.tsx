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
  User,
  Edit,
  Save,
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
} from "lucide-react";
import { toast } from "sonner";

interface UserProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "view" | "edit";
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  joinDate: string;
  address: string;
  bio: string;
  avatar?: string;
}

export const UserProfileDialog: React.FC<UserProfileDialogProps> = ({
  isOpen,
  onClose,
  mode,
}) => {
  const [editMode, setEditMode] = useState(mode === "edit");

  // Sample user data - in real app this would come from API/state
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "John Doe",
    email: "john.doe@autoparts.com",
    phone: "+1 (555) 123-4567",
    role: "Administrator",
    department: "IT & Operations",
    joinDate: "January 15, 2022",
    address: "123 Business Ave, Suite 100, Business City, BC 12345",
    bio: "Experienced administrator with over 5 years in automotive parts management and inventory systems.",
  });

  const [editedProfile, setEditedProfile] = useState<UserProfile>(userProfile);

  const handleSave = () => {
    // Simulate API call
    setUserProfile(editedProfile);
    setEditMode(false);
    toast.success("Profile updated successfully!");
  };

  const handleCancel = () => {
    setEditedProfile(userProfile);
    setEditMode(false);
  };

  const handleClose = () => {
    if (editMode && mode === "view") {
      setEditMode(false);
      setEditedProfile(userProfile);
    }
    onClose();
  };

  const formatFieldValue = (value: string) => value || "Not provided";

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-white flex items-center gap-3">
              <User size={24} />
              {editMode ? "Edit Profile" : "User Profile"}
            </DialogTitle>
            <div className="flex items-center gap-2">
              {!editMode && (
                <Button
                  size="sm"
                  onClick={() => setEditMode(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Edit size={16} className="mr-1" />
                  Edit
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={handleClose}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <X size={16} />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Header */}
          <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <User size={32} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white">
                {userProfile.name}
              </h3>
              <p className="text-white/70">{userProfile.role}</p>
              <p className="text-white/60 text-sm">{userProfile.department}</p>
              <div className="flex items-center gap-2 mt-1">
                <Calendar size={14} className="text-white/50" />
                <span className="text-white/60 text-sm">
                  Joined {userProfile.joinDate}
                </span>
              </div>
            </div>
          </div>

          {/* Profile Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="space-y-2">
              <Label className="text-white/90 flex items-center gap-2">
                <User size={16} />
                Full Name
              </Label>
              {editMode ? (
                <Input
                  value={editedProfile.name}
                  onChange={(e) =>
                    setEditedProfile({ ...editedProfile, name: e.target.value })
                  }
                  className="bg-white/10 border-white/20 text-white"
                />
              ) : (
                <p className="text-white/80 p-2 bg-white/5 rounded">
                  {formatFieldValue(userProfile.name)}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label className="text-white/90 flex items-center gap-2">
                <Mail size={16} />
                Email Address
              </Label>
              {editMode ? (
                <Input
                  type="email"
                  value={editedProfile.email}
                  onChange={(e) =>
                    setEditedProfile({
                      ...editedProfile,
                      email: e.target.value,
                    })
                  }
                  className="bg-white/10 border-white/20 text-white"
                />
              ) : (
                <p className="text-white/80 p-2 bg-white/5 rounded">
                  {formatFieldValue(userProfile.email)}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label className="text-white/90 flex items-center gap-2">
                <Phone size={16} />
                Phone Number
              </Label>
              {editMode ? (
                <Input
                  value={editedProfile.phone}
                  onChange={(e) =>
                    setEditedProfile({
                      ...editedProfile,
                      phone: e.target.value,
                    })
                  }
                  className="bg-white/10 border-white/20 text-white"
                />
              ) : (
                <p className="text-white/80 p-2 bg-white/5 rounded">
                  {formatFieldValue(userProfile.phone)}
                </p>
              )}
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label className="text-white/90 flex items-center gap-2">
                <Shield size={16} />
                Role
              </Label>
              <p className="text-white/80 p-2 bg-white/5 rounded flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                {userProfile.role}
              </p>
            </div>

            {/* Department */}
            <div className="space-y-2">
              <Label className="text-white/90">Department</Label>
              {editMode ? (
                <Input
                  value={editedProfile.department}
                  onChange={(e) =>
                    setEditedProfile({
                      ...editedProfile,
                      department: e.target.value,
                    })
                  }
                  className="bg-white/10 border-white/20 text-white"
                />
              ) : (
                <p className="text-white/80 p-2 bg-white/5 rounded">
                  {formatFieldValue(userProfile.department)}
                </p>
              )}
            </div>

            {/* Join Date */}
            <div className="space-y-2">
              <Label className="text-white/90">Join Date</Label>
              <p className="text-white/80 p-2 bg-white/5 rounded">
                {userProfile.joinDate}
              </p>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label className="text-white/90 flex items-center gap-2">
              <MapPin size={16} />
              Address
            </Label>
            {editMode ? (
              <Input
                value={editedProfile.address}
                onChange={(e) =>
                  setEditedProfile({
                    ...editedProfile,
                    address: e.target.value,
                  })
                }
                className="bg-white/10 border-white/20 text-white"
              />
            ) : (
              <p className="text-white/80 p-2 bg-white/5 rounded">
                {formatFieldValue(userProfile.address)}
              </p>
            )}
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label className="text-white/90">Bio</Label>
            {editMode ? (
              <Textarea
                value={editedProfile.bio}
                onChange={(e) =>
                  setEditedProfile({ ...editedProfile, bio: e.target.value })
                }
                className="bg-white/10 border-white/20 text-white min-h-[100px]"
                placeholder="Tell us about yourself..."
              />
            ) : (
              <p className="text-white/80 p-3 bg-white/5 rounded leading-relaxed">
                {formatFieldValue(userProfile.bio)}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          {editMode && (
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/20">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="border-white/20 text-white hover:bg-white/10 bg-transparent backdrop-blur-sm"
              >
                <X size={16} className="mr-1" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white border-0"
              >
                <Save size={16} className="mr-1" />
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
