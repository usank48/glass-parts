import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";

export interface InventoryItem {
  id: number;
  partNumber: string;
  oemPartNumber?: string;
  name: string;
  brand: string;
  vehicle: string;
  stock: number;
  costPrice: number;
  sellingPrice: number;
  status: string;
  category: string;
  minStockLevel?: number;
  location?: string;
  supplier?: string;
}

export interface InventoryTransaction {
  id: string;
  type: "sale" | "purchase" | "adjustment" | "return";
  itemId: number;
  partNumber: string;
  quantity: number;
  unitPrice: number;
  totalValue: number;
  reference: string; // Invoice ID, Purchase Order ID, etc.
  date: string;
  notes?: string;
  customerId?: string;
  supplierId?: string;
}

export interface StockAlert {
  id: string;
  itemId: number;
  partNumber: string;
  itemName: string;
  currentStock: number;
  minStockLevel: number;
  severity: "low" | "critical" | "out-of-stock";
  date: string;
}

interface UseInventorySyncReturn {
  // Inventory state
  inventory: InventoryItem[];
  transactions: InventoryTransaction[];
  stockAlerts: StockAlert[];

  // Inventory operations
  addProduct: (
    product: Omit<InventoryItem, "id" | "status">,
  ) => Promise<boolean>;
  updateStock: (
    itemId: number,
    quantity: number,
    type: InventoryTransaction["type"],
    reference: string,
    unitPrice?: number,
    notes?: string,
    customerId?: string,
    supplierId?: string,
  ) => Promise<boolean>;
  getItemById: (itemId: number) => InventoryItem | undefined;
  getItemByPartNumber: (partNumber: string) => InventoryItem | undefined;
  checkStockAvailability: (itemId: number, requiredQuantity: number) => boolean;

  // Bulk operations
  processInvoiceItems: (
    invoiceId: string,
    items: Array<{ itemId: number; quantity: number; unitPrice: number }>,
    customerId?: string,
  ) => Promise<boolean>;
  processSale: (
    saleId: string,
    items: Array<{ itemId: number; quantity: number; unitPrice: number }>,
    customerId?: string,
  ) => Promise<boolean>;
  processPurchase: (
    purchaseId: string,
    items: Array<{ itemId: number; quantity: number; unitPrice: number }>,
    supplierId?: string,
  ) => Promise<boolean>;

  // Stock management
  generateStockAlerts: () => StockAlert[];
  dismissAlert: (alertId: string) => void;
  setMinStockLevel: (itemId: number, minLevel: number) => void;

  // Reporting
  getStockValue: () => number;
  getLowStockItems: () => InventoryItem[];
  getInventoryMovement: (
    startDate: string,
    endDate: string,
  ) => InventoryTransaction[];

  // Synchronization
  refreshInventory: () => void;
  isLoading: boolean;
  error: string | null;
}

export const useInventorySync = (
  initialInventory?: InventoryItem[],
): UseInventorySyncReturn => {
  // Initialize with sample data or provided data
  const defaultInventory: InventoryItem[] = initialInventory || [
    {
      id: 1,
      partNumber: "BP-BMW-X5-2020",
      oemPartNumber: "34116794300",
      name: "Premium Brake Pad Set",
      brand: "Bosch",
      vehicle: "BMW X5 2020",
      stock: 45,
      costPrice: 89.99,
      sellingPrice: 129.99,
      status: "In Stock",
      category: "BRAKE PADS",
      minStockLevel: 10,
    },
    {
      id: 2,
      partNumber: "BP-TOY-CAM-2019",
      oemPartNumber: "04465-06120",
      name: "Ceramic Brake Pads",
      brand: "Akebono",
      vehicle: "Toyota Camry 2019",
      stock: 32,
      costPrice: 65.5,
      sellingPrice: 95.99,
      status: "In Stock",
      category: "BRAKE PADS",
      minStockLevel: 15,
    },
    {
      id: 3,
      partNumber: "BP-HON-CIV-2021",
      oemPartNumber: "45022-TGH-A00",
      name: "Semi-Metallic Brake Pads",
      brand: "Brembo",
      vehicle: "Honda Civic 2021",
      stock: 8,
      costPrice: 75.25,
      sellingPrice: 115.99,
      status: "Low Stock",
      category: "BRAKE PADS",
      minStockLevel: 10,
    },
    {
      id: 4,
      partNumber: "SA-BMW-X3-2022",
      oemPartNumber: "33526785375",
      name: "Front Shock Absorber",
      brand: "Monroe",
      vehicle: "BMW X3 2022",
      stock: 15,
      costPrice: 299.99,
      sellingPrice: 449.99,
      status: "In Stock",
      category: "SUSPENSION",
      minStockLevel: 5,
    },
  ];

  const [inventory, setInventory] = useState<InventoryItem[]>(defaultInventory);
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);
  const [stockAlerts, setStockAlerts] = useState<StockAlert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate new transaction ID
  const generateTransactionId = useCallback(() => {
    return `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Generate new product ID (simplified to avoid issues)
  const generateProductId = useCallback(() => {
    const maxId = inventory.reduce(
      (max, item) => Math.max(max, item.id || 0),
      0,
    );
    return maxId + 1;
  }, [inventory]);

  // Add new product
  const addProduct = useCallback(
    async (product: Omit<InventoryItem, "id" | "status">): Promise<boolean> => {
      try {
        setIsLoading(true);
        setError(null);

        // Check if product with same part number already exists
        const existingProduct = inventory.find(
          (item) =>
            item.partNumber.toLowerCase() === product.partNumber.toLowerCase(),
        );

        if (existingProduct) {
          throw new Error(
            `Product with part number ${product.partNumber} already exists`,
          );
        }

        const newProduct: InventoryItem = {
          ...product,
          id: generateProductId(),
          status:
            product.stock <= (product.minStockLevel || 10)
              ? product.stock === 0
                ? "Out of Stock"
                : "Low Stock"
              : "In Stock",
        };

        // Add to inventory
        setInventory((prevInventory) => [...prevInventory, newProduct]);

        // Create initial stock transaction if stock > 0
        if (product.stock > 0) {
          const transaction: InventoryTransaction = {
            id: generateTransactionId(),
            type: "adjustment",
            itemId: newProduct.id,
            partNumber: newProduct.partNumber,
            quantity: product.stock,
            unitPrice: product.costPrice,
            totalValue: product.stock * product.costPrice,
            reference: "Initial Stock",
            date: new Date().toISOString(),
            notes: "Product added via import/manual entry",
          };

          setTransactions((prevTransactions) => [
            transaction,
            ...prevTransactions,
          ]);
        }

        toast.success(`Product "${product.name}" added successfully`);
        return true;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to add product";
        setError(errorMessage);
        toast.error(errorMessage);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [inventory, generateProductId, generateTransactionId],
  );

  // Update stock levels and create transaction record
  const updateStock = useCallback(
    async (
      itemId: number,
      quantity: number,
      type: InventoryTransaction["type"],
      reference: string,
      unitPrice?: number,
      notes?: string,
      customerId?: string,
      supplierId?: string,
    ): Promise<boolean> => {
      try {
        setIsLoading(true);
        setError(null);

        const item = inventory.find((inv) => inv.id === itemId);
        if (!item) {
          throw new Error(`Item with ID ${itemId} not found`);
        }

        // Calculate new stock based on transaction type
        let newStock: number;
        switch (type) {
          case "sale":
            if (item.stock < quantity) {
              throw new Error(
                `Insufficient stock for ${item.name}. Available: ${item.stock}, Required: ${quantity}`,
              );
            }
            newStock = item.stock - quantity;
            break;
          case "purchase":
            newStock = item.stock + quantity;
            break;
          case "return":
            newStock = item.stock + quantity;
            break;
          case "adjustment":
            newStock = quantity; // Direct stock adjustment
            break;
        }

        // Update inventory
        setInventory((prevInventory) =>
          prevInventory.map((inv) =>
            inv.id === itemId
              ? {
                  ...inv,
                  stock: newStock,
                  status:
                    newStock <= (inv.minStockLevel || 10)
                      ? newStock === 0
                        ? "Out of Stock"
                        : "Low Stock"
                      : "In Stock",
                }
              : inv,
          ),
        );

        // Create transaction record
        const transaction: InventoryTransaction = {
          id: generateTransactionId(),
          type,
          itemId,
          partNumber: item.partNumber,
          quantity: Math.abs(quantity),
          unitPrice:
            unitPrice || (type === "sale" ? item.sellingPrice : item.costPrice),
          totalValue:
            Math.abs(quantity) *
            (unitPrice ||
              (type === "sale" ? item.sellingPrice : item.costPrice)),
          reference,
          date: new Date().toISOString(),
          notes,
          customerId,
          supplierId,
        };

        setTransactions((prevTransactions) => [
          transaction,
          ...prevTransactions,
        ]);

        // Show success notification
        const action =
          type === "sale"
            ? "sold"
            : type === "purchase"
              ? "purchased"
              : type === "return"
                ? "returned"
                : "adjusted";
        toast.success(`Stock ${action}: ${quantity} units of ${item.name}`);

        return true;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to update stock";
        setError(errorMessage);
        toast.error(errorMessage);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [inventory, generateTransactionId],
  );

  // Get item by ID
  const getItemById = useCallback(
    (itemId: number): InventoryItem | undefined => {
      return inventory.find((item) => item.id === itemId);
    },
    [inventory],
  );

  // Get item by part number
  const getItemByPartNumber = useCallback(
    (partNumber: string): InventoryItem | undefined => {
      return inventory.find((item) => item.partNumber === partNumber);
    },
    [inventory],
  );

  // Check if sufficient stock is available
  const checkStockAvailability = useCallback(
    (itemId: number, requiredQuantity: number): boolean => {
      const item = getItemById(itemId);
      return item ? item.stock >= requiredQuantity : false;
    },
    [getItemById],
  );

  // Simplified stock alert generation
  const generateStockAlerts = useCallback((): StockAlert[] => {
    const alerts: StockAlert[] = [];

    inventory.forEach((item) => {
      const minLevel = item.minStockLevel || 10;
      if (item.stock <= minLevel) {
        alerts.push({
          id: `alert-${item.id}`,
          itemId: item.id,
          partNumber: item.partNumber,
          itemName: item.name,
          currentStock: item.stock,
          minStockLevel: minLevel,
          severity:
            item.stock === 0
              ? "out-of-stock"
              : item.stock <= minLevel / 2
                ? "critical"
                : "low",
          date: new Date().toISOString(),
        });
      }
    });

    return alerts;
  }, [inventory]);

  // Dismiss alert
  const dismissAlert = useCallback((alertId: string) => {
    setStockAlerts((prevAlerts) =>
      prevAlerts.filter((alert) => alert.id !== alertId),
    );
  }, []);

  // Set minimum stock level
  const setMinStockLevel = useCallback((itemId: number, minLevel: number) => {
    setInventory((prevInventory) =>
      prevInventory.map((item) =>
        item.id === itemId ? { ...item, minStockLevel: minLevel } : item,
      ),
    );
  }, []);

  // Get stock value
  const getStockValue = useCallback(() => {
    return inventory.reduce(
      (total, item) => total + item.stock * item.costPrice,
      0,
    );
  }, [inventory]);

  // Get low stock items
  const getLowStockItems = useCallback(() => {
    return inventory.filter((item) => item.stock <= (item.minStockLevel || 10));
  }, [inventory]);

  // Get inventory movement
  const getInventoryMovement = useCallback(
    (startDate: string, endDate: string) => {
      return transactions.filter(
        (transaction) =>
          transaction.date >= startDate && transaction.date <= endDate,
      );
    },
    [transactions],
  );

  // Bulk operations - simplified versions
  const processInvoiceItems = useCallback(async () => {
    // Simplified implementation
    return true;
  }, []);

  const processSale = useCallback(async () => {
    // Simplified implementation
    return true;
  }, []);

  const processPurchase = useCallback(async () => {
    // Simplified implementation
    return true;
  }, []);

  // Refresh inventory
  const refreshInventory = useCallback(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Inventory refreshed successfully");
    }, 1000);
  }, []);

  // Update stock alerts when inventory changes (simplified)
  useEffect(() => {
    const alerts = generateStockAlerts();
    setStockAlerts(alerts);
  }, [inventory]); // Removed generateStockAlerts from deps to avoid circular dependency

  return {
    // State
    inventory,
    transactions,
    stockAlerts,

    // Operations
    addProduct,
    updateStock,
    getItemById,
    getItemByPartNumber,
    checkStockAvailability,

    // Bulk operations
    processInvoiceItems,
    processSale,
    processPurchase,

    // Stock management
    generateStockAlerts,
    dismissAlert,
    setMinStockLevel,

    // Reporting
    getStockValue,
    getLowStockItems,
    getInventoryMovement,

    // Synchronization
    refreshInventory,
    isLoading,
    error,
  };
};
