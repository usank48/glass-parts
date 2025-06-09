import { Notification } from "@/components/ui/notification-panel";

// Global notification event system
class NotificationService {
  private listeners: Set<
    (notification: Omit<Notification, "id" | "timestamp">) => void
  > = new Set();

  // Subscribe to notifications
  subscribe(
    callback: (notification: Omit<Notification, "id" | "timestamp">) => void,
  ) {
    this.listeners.add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
    };
  }

  // Emit a notification
  private emit(notification: Omit<Notification, "id" | "timestamp">) {
    this.listeners.forEach((callback) => callback(notification));
  }

  // Convenience methods for different types of notifications
  success(
    title: string,
    message: string,
    actionLabel?: string,
    actionUrl?: string,
  ) {
    this.emit({
      title,
      message,
      type: "success",
      read: false,
      actionLabel,
      actionUrl,
    });
  }

  error(
    title: string,
    message: string,
    actionLabel?: string,
    actionUrl?: string,
  ) {
    this.emit({
      title,
      message,
      type: "error",
      read: false,
      actionLabel,
      actionUrl,
    });
  }

  warning(
    title: string,
    message: string,
    actionLabel?: string,
    actionUrl?: string,
  ) {
    this.emit({
      title,
      message,
      type: "warning",
      read: false,
      actionLabel,
      actionUrl,
    });
  }

  info(
    title: string,
    message: string,
    actionLabel?: string,
    actionUrl?: string,
  ) {
    this.emit({
      title,
      message,
      type: "info",
      read: false,
      actionLabel,
      actionUrl,
    });
  }

  // Business-specific notification methods
  lowStock(productName: string, currentStock: number, sku?: string) {
    this.warning(
      "Low Stock Alert",
      `${productName}${sku ? ` (${sku})` : ""} is running low. Only ${currentStock} units left.`,
      "Restock",
      "/inventory",
    );
  }

  newOrder(orderNumber: string, customer: string, amount: string) {
    this.success(
      "New Order Received",
      `Order ${orderNumber} received from ${customer} for ${amount}`,
      "View Order",
      "/sales",
    );
  }

  paymentReceived(invoiceNumber: string, amount: string, customer: string) {
    this.success(
      "Payment Received",
      `Payment of ${amount} received for invoice ${invoiceNumber} from ${customer}`,
      "View Details",
      "/accounting",
    );
  }

  paymentOverdue(
    invoiceNumber: string,
    amount: string,
    daysPastDue: number,
    customer: string,
  ) {
    this.error(
      "Payment Overdue",
      `Invoice ${invoiceNumber} from ${customer} is ${daysPastDue} days overdue. Amount: ${amount}`,
      "Send Reminder",
      "/accounting",
    );
  }

  staffClockIn(staffName: string) {
    this.info("Staff Clock-in", `${staffName} has clocked in for their shift.`);
  }

  staffClockOut(staffName: string) {
    this.info("Staff Clock-out", `${staffName} has clocked out.`);
  }

  productAdded(productName: string, sku: string) {
    this.success(
      "Product Added",
      `${productName} (${sku}) has been added to inventory.`,
      "View Product",
      "/inventory",
    );
  }

  productSold(productName: string, quantity: number, customer: string) {
    this.info(
      "Product Sold",
      `${quantity}x ${productName} sold to ${customer}`,
      "View Sale",
      "/sales",
    );
  }

  supplierOrderPlaced(
    supplierName: string,
    orderNumber: string,
    amount: string,
  ) {
    this.info(
      "Purchase Order Placed",
      `Order ${orderNumber} placed with ${supplierName} for ${amount}`,
      "View Order",
      "/purchase",
    );
  }

  supplierDelivery(supplierName: string, orderNumber: string) {
    this.success(
      "Delivery Received",
      `Delivery received from ${supplierName} for order ${orderNumber}`,
      "Update Inventory",
      "/inventory",
    );
  }

  systemUpdate(version: string, features?: string[]) {
    const featureText =
      features && features.length > 0
        ? ` New features: ${features.join(", ")}`
        : "";

    this.info(
      "System Update",
      `AutoParts Pro has been updated to version ${version}.${featureText}`,
      "View Changes",
    );
  }

  backupCompleted() {
    this.success(
      "Backup Completed",
      "System backup has been completed successfully.",
    );
  }

  backupFailed(error: string) {
    this.error(
      "Backup Failed",
      `System backup failed: ${error}`,
      "Retry Backup",
    );
  }

  securityAlert(message: string) {
    this.error("Security Alert", message, "Review Security", "/settings");
  }

  priceChange(productName: string, oldPrice: string, newPrice: string) {
    this.info(
      "Price Updated",
      `${productName} price changed from ${oldPrice} to ${newPrice}`,
      "View Product",
      "/inventory",
    );
  }

  reportGenerated(reportType: string) {
    this.success(
      "Report Generated",
      `${reportType} report has been generated successfully.`,
      "View Report",
      "/accounting",
    );
  }
}

// Export singleton instance
export const notificationService = new NotificationService();

// Export types for use in other files
export type { Notification };
