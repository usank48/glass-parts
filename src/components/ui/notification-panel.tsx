import React from "react";
import {
  X,
  Check,
  Bell,
  Clock,
  AlertCircle,
  Info,
  CheckCircle,
} from "lucide-react";
import { Button } from "./button";
import { Badge } from "./badge";
import { Separator } from "./separator";
import { ScrollArea } from "./scroll-area";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

interface NotificationPanelProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDeleteNotification: (id: string) => void;
  onClearAll: () => void;
  onNotificationClick?: (notification: Notification) => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
  onClearAll,
  onNotificationClick,
}) => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "warning":
        return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getTypeColor = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "border-l-green-400 bg-green-400/10";
      case "warning":
        return "border-l-yellow-400 bg-yellow-400/10";
      case "error":
        return "border-l-red-400 bg-red-400/10";
      default:
        return "border-l-blue-400 bg-blue-400/10";
    }
  };

  return (
    <div className="w-96 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-white" />
            <h3 className="text-white font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="bg-red-500 text-white">
                {unreadCount}
              </Badge>
            )}
          </div>
          {notifications.length > 0 && (
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onMarkAllAsRead}
                  className="text-white/70 hover:text-white hover:bg-white/10 text-xs"
                >
                  <Check className="w-3 h-3 mr-1" />
                  Mark all read
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearAll}
                className="text-white/70 hover:text-white hover:bg-white/10 text-xs"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="p-8 text-center">
          <Bell className="w-12 h-12 text-white/30 mx-auto mb-3" />
          <p className="text-white/60 text-sm">No notifications yet</p>
          <p className="text-white/40 text-xs mt-1">
            You'll see updates about your business here
          </p>
        </div>
      ) : (
        <ScrollArea className="max-h-96">
          <div className="p-2">
            {notifications.map((notification, index) => (
              <div key={notification.id}>
                <div
                  className={`p-3 rounded-lg border-l-4 transition-all duration-200 cursor-pointer hover:bg-white/5 ${getTypeColor(
                    notification.type,
                  )} ${!notification.read ? "bg-white/10" : ""}`}
                  onClick={() => {
                    if (!notification.read) {
                      onMarkAsRead(notification.id);
                    }
                    onNotificationClick?.(notification);
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4
                            className={`text-sm font-medium ${
                              notification.read ? "text-white/70" : "text-white"
                            }`}
                          >
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                          )}
                        </div>
                        <p
                          className={`text-xs mt-1 ${
                            notification.read
                              ? "text-white/50"
                              : "text-white/70"
                          }`}
                        >
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1 text-white/40">
                            <Clock className="w-3 h-3" />
                            <span className="text-xs">
                              {formatTimestamp(notification.timestamp)}
                            </span>
                          </div>
                          {notification.actionLabel && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-300 hover:text-blue-200 hover:bg-blue-500/20 text-xs h-6 px-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                onNotificationClick?.(notification);
                              }}
                            >
                              {notification.actionLabel}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onMarkAsRead(notification.id);
                          }}
                          className="text-white/50 hover:text-white hover:bg-white/10 w-6 h-6 p-0"
                        >
                          <Check className="w-3 h-3" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteNotification(notification.id);
                        }}
                        className="text-white/50 hover:text-red-400 hover:bg-red-500/20 w-6 h-6 p-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                {index < notifications.length - 1 && (
                  <Separator className="my-2 bg-white/10" />
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      )}

      {/* Footer */}
      <div className="p-3 border-t border-white/10 bg-white/5">
        <Button
          variant="ghost"
          className="w-full text-white/70 hover:text-white hover:bg-white/10 text-xs"
          onClick={() => {
            console.log("Opening notification settings...");
          }}
        >
          Notification Settings
        </Button>
      </div>
    </div>
  );
};
