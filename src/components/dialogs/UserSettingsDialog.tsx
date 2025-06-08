import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Settings,
  Bell,
  Palette,
  Globe,
  Lock,
  Save,
  X,
  Moon,
  Sun,
  Monitor,
} from "lucide-react";
import { toast } from "sonner";

interface UserSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UserSettings {
  theme: "light" | "dark" | "system";
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    desktop: boolean;
    lowStock: boolean;
    newOrders: boolean;
    systemUpdates: boolean;
  };
  privacy: {
    profileVisible: boolean;
    activityTracking: boolean;
    dataSharing: boolean;
  };
  display: {
    compactMode: boolean;
    animationsEnabled: boolean;
    autoSave: boolean;
  };
}

export const UserSettingsDialog: React.FC<UserSettingsDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const [settings, setSettings] = useState<UserSettings>({
    theme: "system",
    language: "en",
    timezone: "America/New_York",
    notifications: {
      email: true,
      push: true,
      desktop: false,
      lowStock: true,
      newOrders: true,
      systemUpdates: false,
    },
    privacy: {
      profileVisible: true,
      activityTracking: true,
      dataSharing: false,
    },
    display: {
      compactMode: false,
      animationsEnabled: true,
      autoSave: true,
    },
  });

  const [hasChanges, setHasChanges] = useState(false);

  const updateSetting = (
    category: keyof UserSettings,
    key: string,
    value: any,
  ) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
    setHasChanges(true);
  };

  const updateTopLevelSetting = (key: keyof UserSettings, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // Simulate API call to save settings
    toast.success("Settings saved successfully!");
    setHasChanges(false);
  };

  const handleReset = () => {
    // Reset to default settings
    setSettings({
      theme: "system",
      language: "en",
      timezone: "America/New_York",
      notifications: {
        email: true,
        push: true,
        desktop: false,
        lowStock: true,
        newOrders: true,
        systemUpdates: false,
      },
      privacy: {
        profileVisible: true,
        activityTracking: true,
        dataSharing: false,
      },
      display: {
        compactMode: false,
        animationsEnabled: true,
        autoSave: true,
      },
    });
    setHasChanges(true);
    toast.info("Settings reset to default values");
  };

  const themeIcons = {
    light: Sun,
    dark: Moon,
    system: Monitor,
  };

  const ThemeIcon = themeIcons[settings.theme];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white/10 backdrop-blur-md border border-white/20 text-white">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-white flex items-center gap-3">
              <Settings size={24} />
              User Settings
            </DialogTitle>
            <Button
              size="sm"
              variant="ghost"
              onClick={onClose}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <X size={16} />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Appearance Settings */}
          <div className="p-4 bg-white/5 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Palette size={20} />
              Appearance
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white/90">Theme</Label>
                <Select
                  value={settings.theme}
                  onValueChange={(value: any) =>
                    updateTopLevelSetting("theme", value)
                  }
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <div className="flex items-center gap-2">
                      <ThemeIcon size={16} />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-white/90 backdrop-blur-md border border-white/20">
                    <SelectItem value="light" className="text-black">
                      <div className="flex items-center gap-2">
                        <Sun size={16} />
                        Light
                      </div>
                    </SelectItem>
                    <SelectItem value="dark" className="text-black">
                      <div className="flex items-center gap-2">
                        <Moon size={16} />
                        Dark
                      </div>
                    </SelectItem>
                    <SelectItem value="system" className="text-black">
                      <div className="flex items-center gap-2">
                        <Monitor size={16} />
                        System
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-white/90">Language</Label>
                <Select
                  value={settings.language}
                  onValueChange={(value) =>
                    updateTopLevelSetting("language", value)
                  }
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white/90 backdrop-blur-md border border-white/20">
                    <SelectItem value="en" className="text-black">
                      English
                    </SelectItem>
                    <SelectItem value="es" className="text-black">
                      Español
                    </SelectItem>
                    <SelectItem value="fr" className="text-black">
                      Français
                    </SelectItem>
                    <SelectItem value="de" className="text-black">
                      Deutsch
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-white/90">Compact Mode</Label>
                <Switch
                  checked={settings.display.compactMode}
                  onCheckedChange={(checked) =>
                    updateSetting("display", "compactMode", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-white/90">Enable Animations</Label>
                <Switch
                  checked={settings.display.animationsEnabled}
                  onCheckedChange={(checked) =>
                    updateSetting("display", "animationsEnabled", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-white/90">Auto-save Changes</Label>
                <Switch
                  checked={settings.display.autoSave}
                  onCheckedChange={(checked) =>
                    updateSetting("display", "autoSave", checked)
                  }
                />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="p-4 bg-white/5 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Bell size={20} />
              Notifications
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white/90">Email Notifications</Label>
                  <p className="text-white/60 text-sm">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.email}
                  onCheckedChange={(checked) =>
                    updateSetting("notifications", "email", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white/90">Push Notifications</Label>
                  <p className="text-white/60 text-sm">
                    Browser push notifications
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.push}
                  onCheckedChange={(checked) =>
                    updateSetting("notifications", "push", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white/90">Desktop Notifications</Label>
                  <p className="text-white/60 text-sm">
                    System desktop notifications
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.desktop}
                  onCheckedChange={(checked) =>
                    updateSetting("notifications", "desktop", checked)
                  }
                />
              </div>

              <hr className="border-white/20" />

              <div className="flex items-center justify-between">
                <Label className="text-white/90">Low Stock Alerts</Label>
                <Switch
                  checked={settings.notifications.lowStock}
                  onCheckedChange={(checked) =>
                    updateSetting("notifications", "lowStock", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-white/90">New Order Notifications</Label>
                <Switch
                  checked={settings.notifications.newOrders}
                  onCheckedChange={(checked) =>
                    updateSetting("notifications", "newOrders", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-white/90">System Updates</Label>
                <Switch
                  checked={settings.notifications.systemUpdates}
                  onCheckedChange={(checked) =>
                    updateSetting("notifications", "systemUpdates", checked)
                  }
                />
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="p-4 bg-white/5 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Lock size={20} />
              Privacy & Security
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white/90">Profile Visibility</Label>
                  <p className="text-white/60 text-sm">
                    Make your profile visible to other users
                  </p>
                </div>
                <Switch
                  checked={settings.privacy.profileVisible}
                  onCheckedChange={(checked) =>
                    updateSetting("privacy", "profileVisible", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white/90">Activity Tracking</Label>
                  <p className="text-white/60 text-sm">
                    Track your activity for analytics
                  </p>
                </div>
                <Switch
                  checked={settings.privacy.activityTracking}
                  onCheckedChange={(checked) =>
                    updateSetting("privacy", "activityTracking", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white/90">Data Sharing</Label>
                  <p className="text-white/60 text-sm">
                    Share anonymous usage data
                  </p>
                </div>
                <Switch
                  checked={settings.privacy.dataSharing}
                  onCheckedChange={(checked) =>
                    updateSetting("privacy", "dataSharing", checked)
                  }
                />
              </div>
            </div>
          </div>

          {/* Regional Settings */}
          <div className="p-4 bg-white/5 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Globe size={20} />
              Regional Settings
            </h3>

            <div className="space-y-2">
              <Label className="text-white/90">Timezone</Label>
              <Select
                value={settings.timezone}
                onValueChange={(value) =>
                  updateTopLevelSetting("timezone", value)
                }
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white/90 backdrop-blur-md border border-white/20">
                  <SelectItem value="America/New_York" className="text-black">
                    Eastern Time (ET)
                  </SelectItem>
                  <SelectItem value="America/Chicago" className="text-black">
                    Central Time (CT)
                  </SelectItem>
                  <SelectItem value="America/Denver" className="text-black">
                    Mountain Time (MT)
                  </SelectItem>
                  <SelectItem
                    value="America/Los_Angeles"
                    className="text-black"
                  >
                    Pacific Time (PT)
                  </SelectItem>
                  <SelectItem value="UTC" className="text-black">
                    UTC
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-white/20">
            <Button
              variant="outline"
              onClick={handleReset}
              className="border-white/20 text-white hover:bg-white/10 bg-transparent backdrop-blur-sm"
            >
              Reset to Defaults
            </Button>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="border-white/20 text-white hover:bg-white/10 bg-transparent backdrop-blur-sm"
              >
                <X size={16} className="mr-1" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!hasChanges}
                className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:bg-green-600/50 border-0"
              >
                <Save size={16} className="mr-1" />
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
