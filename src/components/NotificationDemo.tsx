import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { notificationService } from "@/utils/notificationService";
import {
  Package,
  ShoppingCart,
  DollarSign,
  Users,
  AlertTriangle,
  CheckCircle,
  Info,
  XCircle,
} from "lucide-react";

export const NotificationDemo: React.FC = () => {
  const triggerLowStockAlert = () => {
    notificationService.lowStock("Brake Pads Premium", 3, "BP-PREM-001");
  };

  const triggerNewOrder = () => {
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;
    notificationService.newOrder(orderNumber, "AutoFix Garage", "$299.99");
  };

  const triggerPaymentReceived = () => {
    const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
    notificationService.paymentReceived(
      invoiceNumber,
      "$1,245.00",
      "Speed Motors",
    );
  };

  const triggerPaymentOverdue = () => {
    const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
    notificationService.paymentOverdue(
      invoiceNumber,
      "$892.50",
      7,
      "Quick Repairs LLC",
    );
  };

  const triggerStaffActivity = () => {
    notificationService.staffClockIn("Sarah Johnson");
  };

  const triggerProductAdded = () => {
    notificationService.productAdded("Oil Filter Heavy Duty", "OF-HD-002");
  };

  const triggerSupplierOrder = () => {
    const orderNumber = `PO-${Date.now().toString().slice(-6)}`;
    notificationService.supplierOrderPlaced(
      "AutoParts Supply Co.",
      orderNumber,
      "$5,430.00",
    );
  };

  const triggerSystemUpdate = () => {
    notificationService.systemUpdate("1.3.0", [
      "Enhanced reporting",
      "Mobile optimization",
      "Security improvements",
    ]);
  };

  const triggerCustomNotifications = () => {
    // Custom notifications using the service methods
    notificationService.success(
      "Operation Successful",
      "Data export completed successfully!",
    );

    setTimeout(() => {
      notificationService.warning(
        "Warning",
        "System maintenance scheduled for tonight.",
      );
    }, 1000);

    setTimeout(() => {
      notificationService.error(
        "Connection Error",
        "Failed to sync with cloud backup.",
      );
    }, 2000);

    setTimeout(() => {
      notificationService.info("Tip", "Use keyboard shortcuts to work faster!");
    }, 3000);
  };

  const triggerBusinessFlow = () => {
    // Simulate a complete business flow with multiple notifications
    notificationService.info("Processing", "Starting bulk inventory update...");

    setTimeout(() => {
      notificationService.productAdded("Spark Plugs Set", "SP-SET-001");
    }, 1000);

    setTimeout(() => {
      notificationService.productAdded("Air Filter Premium", "AF-PREM-001");
    }, 2000);

    setTimeout(() => {
      notificationService.lowStock("Transmission Fluid", 2, "TF-STD-001");
    }, 3000);

    setTimeout(() => {
      notificationService.success(
        "Bulk Update Complete",
        "Successfully updated 25 products in inventory.",
      );
    }, 4000);
  };

  const triggerExcelImportDemo = () => {
    // Simulate Excel import process with notifications
    notificationService.info(
      "Excel Import Started",
      "Processing uploaded file...",
    );

    setTimeout(() => {
      notificationService.success(
        "Excel Import Completed",
        "Successfully imported 15 products (8 updated, 7 new)",
        "View Inventory",
        "/inventory",
      );
    }, 2000);

    setTimeout(() => {
      notificationService.info(
        "Stock Updated",
        "Brake Pads Premium: +25 units (15 → 40)",
        "View Product",
      );
    }, 2500);

    setTimeout(() => {
      notificationService.info(
        "Stock Updated",
        "Oil Filter Heavy Duty: +50 units (5 → 55)",
        "View Product",
      );
    }, 3000);

    setTimeout(() => {
      notificationService.success(
        "New Product Added",
        "Shock Absorber Set (SA-SET-002) - 20 units",
        "View Product",
      );
    }, 3500);

    setTimeout(() => {
      notificationService.success(
        "Multiple Products Added",
        "6 more products were added via import",
        "View Inventory",
        "/inventory",
      );
    }, 4000);
  };

  return (
    <div className="p-6 space-y-6">
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Package className="w-5 h-5" />
            Notification System Demo
          </CardTitle>
          <CardDescription className="text-white/70">
            Test the notification system with various business scenarios
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Business Notifications */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <Button
              variant="outline"
              className="border-yellow-400/30 text-yellow-300 hover:bg-yellow-400/10 justify-start"
              onClick={triggerLowStockAlert}
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Low Stock Alert
            </Button>

            <Button
              variant="outline"
              className="border-green-400/30 text-green-300 hover:bg-green-400/10 justify-start"
              onClick={triggerNewOrder}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              New Order
            </Button>

            <Button
              variant="outline"
              className="border-blue-400/30 text-blue-300 hover:bg-blue-400/10 justify-start"
              onClick={triggerPaymentReceived}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Payment Received
            </Button>

            <Button
              variant="outline"
              className="border-red-400/30 text-red-300 hover:bg-red-400/10 justify-start"
              onClick={triggerPaymentOverdue}
            >
              <XCircle className="w-4 h-4 mr-2" />
              Payment Overdue
            </Button>

            <Button
              variant="outline"
              className="border-purple-400/30 text-purple-300 hover:bg-purple-400/10 justify-start"
              onClick={triggerStaffActivity}
            >
              <Users className="w-4 h-4 mr-2" />
              Staff Activity
            </Button>

            <Button
              variant="outline"
              className="border-green-400/30 text-green-300 hover:bg-green-400/10 justify-start"
              onClick={triggerProductAdded}
            >
              <Package className="w-4 h-4 mr-2" />
              Product Added
            </Button>
          </div>

          {/* System Notifications */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="border-cyan-400/30 text-cyan-300 hover:bg-cyan-400/10 justify-start"
              onClick={triggerSupplierOrder}
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Supplier Order
            </Button>

            <Button
              variant="outline"
              className="border-indigo-400/30 text-indigo-300 hover:bg-indigo-400/10 justify-start"
              onClick={triggerSystemUpdate}
            >
              <Info className="w-4 h-4 mr-2" />
              System Update
            </Button>
          </div>

          {/* Bulk Actions */}
          <div className="border-t border-white/10 pt-4 space-y-3">
            <h4 className="text-white font-medium">Bulk Actions</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                variant="default"
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                onClick={triggerCustomNotifications}
              >
                Multiple Types Demo
              </Button>

              <Button
                variant="default"
                className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                onClick={triggerBusinessFlow}
              >
                Business Flow Demo
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <Button
                variant="default"
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                onClick={triggerExcelImportDemo}
              >
                Excel Import Demo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Instructions */}
      <Card className="bg-white/5 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white text-lg">
            How to Use Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="text-white/70 space-y-3">
          <p>
            <strong className="text-white">Import the service:</strong>{" "}
            <code className="bg-white/10 px-2 py-1 rounded text-sm">
              import {`{ notificationService }`} from
              "@/utils/notificationService";
            </code>
          </p>
          <p>
            <strong className="text-white">Basic usage:</strong>{" "}
            <code className="bg-white/10 px-2 py-1 rounded text-sm">
              notificationService.success("Title", "Message");
            </code>
          </p>
          <p>
            <strong className="text-white">Business events:</strong>{" "}
            <code className="bg-white/10 px-2 py-1 rounded text-sm">
              notificationService.newOrder("ORD-001", "Customer", "$100");
            </code>
          </p>
          <p className="text-sm">
            The notification system automatically manages IDs, timestamps, and
            state. Notifications appear in the top bar and can be marked as
            read, deleted, or cleared.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
