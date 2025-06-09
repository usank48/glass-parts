import { useState, useCallback, useEffect } from "react";
import { Notification } from "@/components/ui/notification-panel";
import { notificationService } from "@/utils/notificationService";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Subscribe to global notification service
  useEffect(() => {
    const unsubscribe = notificationService.subscribe((notification) => {
      addNotification(notification);
    });

    return unsubscribe;
  }, []);

  // Initialize with some sample notifications
  useEffect(() => {
    const sampleNotifications: Notification[] = [
      {
        id: "1",
        title: "Low Stock Alert",
        message: "Brake Pads (SKU: BP-001) is running low. Only 5 units left.",
        type: "warning",
        timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
        read: false,
        actionLabel: "Restock",
        actionUrl: "/inventory",
      },
      {
        id: "2",
        title: "New Order Received",
        message: "Order #ORD-2024-001 received from AutoFix Garage for $299.99",
        type: "success",
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        read: false,
        actionLabel: "View Order",
        actionUrl: "/sales",
      },
      {
        id: "3",
        title: "Payment Overdue",
        message: "Invoice INV-2024-045 is 5 days overdue. Amount: $1,245.00",
        type: "error",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: true,
        actionLabel: "Send Reminder",
        actionUrl: "/accounting",
      },
      {
        id: "4",
        title: "System Update",
        message:
          "AutoParts Pro has been updated to version 1.2.0 with new features.",
        type: "info",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        read: true,
        actionLabel: "View Changes",
      },
      {
        id: "5",
        title: "Staff Clock-in",
        message: "John Smith has clocked in for the morning shift.",
        type: "info",
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        read: false,
      },
    ];

    setNotifications(sampleNotifications);
  }, []);

  const addNotification = useCallback(
    (notification: Omit<Notification, "id" | "timestamp">) => {
      const newNotification: Notification = {
        ...notification,
        id: Date.now().toString(),
        timestamp: new Date(),
      };

      setNotifications((prev) => [newNotification, ...prev]);

      // Auto-remove notification after 10 seconds if it's a success type
      if (notification.type === "success") {
        setTimeout(() => {
          setNotifications((prev) =>
            prev.filter((n) => n.id !== newNotification.id),
          );
        }, 10000);
      }
    },
    [],
  );

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true })),
    );
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id),
    );
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const getUnreadCount = useCallback(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  // Sample notification generators for different business events
  const notifyLowStock = useCallback(
    (productName: string, currentStock: number) => {
      addNotification({
        title: "Low Stock Alert",
        message: `${productName} is running low. Only ${currentStock} units left.`,
        type: "warning",
        read: false,
        actionLabel: "Restock",
        actionUrl: "/inventory",
      });
    },
    [addNotification],
  );

  const notifyNewOrder = useCallback(
    (orderNumber: string, amount: string, customer: string) => {
      addNotification({
        title: "New Order Received",
        message: `Order ${orderNumber} received from ${customer} for ${amount}`,
        type: "success",
        read: false,
        actionLabel: "View Order",
        actionUrl: "/sales",
      });
    },
    [addNotification],
  );

  const notifyPaymentOverdue = useCallback(
    (invoiceNumber: string, amount: string, daysPastDue: number) => {
      addNotification({
        title: "Payment Overdue",
        message: `Invoice ${invoiceNumber} is ${daysPastDue} days overdue. Amount: ${amount}`,
        type: "error",
        read: false,
        actionLabel: "Send Reminder",
        actionUrl: "/accounting",
      });
    },
    [addNotification],
  );

  const notifyStaffActivity = useCallback(
    (staffName: string, activity: string) => {
      addNotification({
        title: "Staff Activity",
        message: `${staffName} ${activity}`,
        type: "info",
        read: false,
      });
    },
    [addNotification],
  );

  const notifySystemUpdate = useCallback(
    (message: string) => {
      addNotification({
        title: "System Update",
        message,
        type: "info",
        read: false,
        actionLabel: "View Details",
      });
    },
    [addNotification],
  );

  return {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    getUnreadCount,
    // Helper functions for common business notifications
    notifyLowStock,
    notifyNewOrder,
    notifyPaymentOverdue,
    notifyStaffActivity,
    notifySystemUpdate,
  };
};
