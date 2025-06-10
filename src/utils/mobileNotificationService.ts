import { notificationService } from "./notificationService";

class MobileNotificationService {
  private isNative = false;

  constructor() {
    this.checkPlatform();
  }

  private async checkPlatform() {
    try {
      const isCapacitor = window && (window as any).Capacitor;
      if (isCapacitor) {
        const { Capacitor } = await import("@capacitor/core");
        this.isNative = Capacitor.isNativePlatform();
      }
    } catch (error) {
      console.log("Capacitor not available, using web fallbacks");
      this.isNative = false;
    }
  }

  // Show toast notification (mobile-friendly)
  async showToast(message: string, duration: "short" | "long" = "short") {
    if (this.isNative) {
      try {
        const { Toast } = await import("@capacitor/toast");
        await Toast.show({
          text: message,
          duration: duration,
          position: "bottom",
        });
        return;
      } catch (error) {
        console.log("Toast not available:", error);
      }
    }

    // Web fallback
    notificationService.info("Notification", message);
  }

  // Trigger haptic feedback
  async hapticFeedback(type: "light" | "medium" | "heavy" = "light") {
    if (this.isNative) {
      try {
        const { Haptics, ImpactStyle } = await import("@capacitor/haptics");
        const impactStyle =
          type === "light"
            ? ImpactStyle.Light
            : type === "medium"
              ? ImpactStyle.Medium
              : ImpactStyle.Heavy;
        await Haptics.impact({ style: impactStyle });
      } catch (error) {
        console.log("Haptics not available:", error);
      }
    }
  }

  // Success notification with haptic feedback
  async success(title: string, message: string, actionLabel?: string) {
    await this.hapticFeedback("light");

    if (this.isNative) {
      await this.showToast(`${title}: ${message}`, "short");
    }

    // Also trigger web notification for consistency
    notificationService.success(title, message, actionLabel);
  }

  // Error notification with strong haptic feedback
  async error(title: string, message: string, actionLabel?: string) {
    await this.hapticFeedback("heavy");

    if (this.isNative) {
      await this.showToast(`❌ ${title}: ${message}`, "long");
    }

    notificationService.error(title, message, actionLabel);
  }

  // Warning notification with medium haptic feedback
  async warning(title: string, message: string, actionLabel?: string) {
    await this.hapticFeedback("medium");

    if (this.isNative) {
      await this.showToast(`⚠️ ${title}: ${message}`, "long");
    }

    notificationService.warning(title, message, actionLabel);
  }

  // Info notification with light haptic feedback
  async info(title: string, message: string, actionLabel?: string) {
    await this.hapticFeedback("light");

    if (this.isNative) {
      await this.showToast(`ℹ️ ${title}: ${message}`, "short");
    }

    notificationService.info(title, message, actionLabel);
  }

  // Business-specific mobile notifications
  async lowStockAlert(productName: string, currentStock: number, sku?: string) {
    await this.warning(
      "Low Stock Alert",
      `${productName}${sku ? ` (${sku})` : ""} - Only ${currentStock} units left`,
      "Restock",
    );
  }

  async newOrderReceived(
    orderNumber: string,
    customer: string,
    amount: string,
  ) {
    await this.success(
      "New Order",
      `${orderNumber} from ${customer} - ${amount}`,
      "View Order",
    );
  }

  async paymentReceived(amount: string, customer: string) {
    await this.success(
      "Payment Received",
      `${amount} from ${customer}`,
      "View Details",
    );
  }

  async importCompleted(
    totalItems: number,
    newItems: number,
    updatedItems: number,
  ) {
    await this.success(
      "Import Complete",
      `${totalItems} items processed (${newItems} new, ${updatedItems} updated)`,
      "View Inventory",
    );
  }

  async syncCompleted() {
    await this.info(
      "Sync Complete",
      "Inventory data synchronized successfully",
    );
  }

  // Check if running on mobile
  get isRunningOnMobile() {
    return (
      this.isNative ||
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      )
    );
  }
}

// Export singleton instance
export const mobileNotificationService = new MobileNotificationService();
