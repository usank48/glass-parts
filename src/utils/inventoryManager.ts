import { InventoryItem, InventoryTransaction } from "@/hooks/useInventorySync";

export interface InventoryReportData {
  totalItems: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  topSellingItems: Array<{
    item: InventoryItem;
    quantitySold: number;
    revenue: number;
  }>;
  categoryBreakdown: Array<{
    category: string;
    itemCount: number;
    totalValue: number;
    averageStock: number;
  }>;
  movementSummary: {
    totalSales: number;
    totalPurchases: number;
    totalAdjustments: number;
    netMovement: number;
  };
}

export interface InventoryAccountingEntry {
  date: string;
  account: string;
  debit: number;
  credit: number;
  description: string;
  reference: string;
}

/**
 * Generate comprehensive inventory report
 */
export const generateInventoryReport = (
  inventory: InventoryItem[],
  transactions: InventoryTransaction[],
  startDate?: string,
  endDate?: string,
): InventoryReportData => {
  // Filter transactions by date range if provided
  let filteredTransactions = transactions;
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    filteredTransactions = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= start && transactionDate <= end;
    });
  }

  // Basic inventory metrics
  const totalItems = inventory.length;
  const totalValue = inventory.reduce(
    (sum, item) => sum + item.stock * item.costPrice,
    0,
  );
  const lowStockItems = inventory.filter(
    (item) => item.stock <= (item.minStockLevel || 10) && item.stock > 0,
  ).length;
  const outOfStockItems = inventory.filter((item) => item.stock === 0).length;

  // Top selling items analysis
  const salesTransactions = filteredTransactions.filter(
    (t) => t.type === "sale",
  );
  const itemSalesMap = new Map<number, { quantity: number; revenue: number }>();

  salesTransactions.forEach((transaction) => {
    const existing = itemSalesMap.get(transaction.itemId) || {
      quantity: 0,
      revenue: 0,
    };
    itemSalesMap.set(transaction.itemId, {
      quantity: existing.quantity + transaction.quantity,
      revenue: existing.revenue + transaction.totalValue,
    });
  });

  const topSellingItems = Array.from(itemSalesMap.entries())
    .map(([itemId, data]) => ({
      item: inventory.find((item) => item.id === itemId)!,
      quantitySold: data.quantity,
      revenue: data.revenue,
    }))
    .filter((item) => item.item) // Remove items not found in current inventory
    .sort((a, b) => b.quantitySold - a.quantitySold)
    .slice(0, 10);

  // Category breakdown
  const categoryMap = new Map<
    string,
    { items: InventoryItem[]; totalValue: number }
  >();
  inventory.forEach((item) => {
    const existing = categoryMap.get(item.category) || {
      items: [],
      totalValue: 0,
    };
    existing.items.push(item);
    existing.totalValue += item.stock * item.costPrice;
    categoryMap.set(item.category, existing);
  });

  const categoryBreakdown = Array.from(categoryMap.entries()).map(
    ([category, data]) => ({
      category,
      itemCount: data.items.length,
      totalValue: data.totalValue,
      averageStock:
        data.items.reduce((sum, item) => sum + item.stock, 0) /
        data.items.length,
    }),
  );

  // Movement summary
  const movementSummary = {
    totalSales: filteredTransactions
      .filter((t) => t.type === "sale")
      .reduce((sum, t) => sum + t.quantity, 0),
    totalPurchases: filteredTransactions
      .filter((t) => t.type === "purchase")
      .reduce((sum, t) => sum + t.quantity, 0),
    totalAdjustments: filteredTransactions
      .filter((t) => t.type === "adjustment")
      .reduce((sum, t) => sum + t.quantity, 0),
    netMovement: filteredTransactions.reduce((sum, t) => {
      switch (t.type) {
        case "sale":
          return sum - t.quantity;
        case "purchase":
          return sum + t.quantity;
        case "return":
          return sum + t.quantity;
        case "adjustment":
          return sum; // Adjustments don't count towards net movement
        default:
          return sum;
      }
    }, 0),
  };

  return {
    totalItems,
    totalValue,
    lowStockItems,
    outOfStockItems,
    topSellingItems,
    categoryBreakdown,
    movementSummary,
  };
};

/**
 * Generate accounting entries for inventory transactions
 */
export const generateInventoryAccountingEntries = (
  transaction: InventoryTransaction,
  item: InventoryItem,
): InventoryAccountingEntry[] => {
  const entries: InventoryAccountingEntry[] = [];
  const date = transaction.date;
  const reference = transaction.reference;

  switch (transaction.type) {
    case "sale":
      // Debit: Accounts Receivable or Cash (at selling price)
      // Credit: Sales Revenue (at selling price)
      entries.push({
        date,
        account: "Accounts Receivable",
        debit: transaction.totalValue,
        credit: 0,
        description: `Sale of ${item.name} - ${transaction.quantity} units`,
        reference,
      });
      entries.push({
        date,
        account: "Sales Revenue",
        debit: 0,
        credit: transaction.totalValue,
        description: `Revenue from sale of ${item.name}`,
        reference,
      });

      // Debit: Cost of Goods Sold (at cost price)
      // Credit: Inventory (at cost price)
      const costValue = transaction.quantity * item.costPrice;
      entries.push({
        date,
        account: "Cost of Goods Sold",
        debit: costValue,
        credit: 0,
        description: `COGS for ${item.name} - ${transaction.quantity} units`,
        reference,
      });
      entries.push({
        date,
        account: "Inventory",
        debit: 0,
        credit: costValue,
        description: `Inventory reduction - ${item.name}`,
        reference,
      });
      break;

    case "purchase":
      // Debit: Inventory (at cost price)
      // Credit: Accounts Payable or Cash (at cost price)
      entries.push({
        date,
        account: "Inventory",
        debit: transaction.totalValue,
        credit: 0,
        description: `Purchase of ${item.name} - ${transaction.quantity} units`,
        reference,
      });
      entries.push({
        date,
        account: "Accounts Payable",
        debit: 0,
        credit: transaction.totalValue,
        description: `Purchase from supplier - ${item.name}`,
        reference,
      });
      break;

    case "return":
      // For returns, reverse the original sale entries
      entries.push({
        date,
        account: "Sales Returns",
        debit: transaction.totalValue,
        credit: 0,
        description: `Return of ${item.name} - ${transaction.quantity} units`,
        reference,
      });
      entries.push({
        date,
        account: "Accounts Receivable",
        debit: 0,
        credit: transaction.totalValue,
        description: `Customer refund - ${item.name}`,
        reference,
      });

      // Return inventory at cost
      const returnCostValue = transaction.quantity * item.costPrice;
      entries.push({
        date,
        account: "Inventory",
        debit: returnCostValue,
        credit: 0,
        description: `Inventory return - ${item.name}`,
        reference,
      });
      entries.push({
        date,
        account: "Cost of Goods Sold",
        debit: 0,
        credit: returnCostValue,
        description: `COGS adjustment for return - ${item.name}`,
        reference,
      });
      break;

    case "adjustment":
      // For adjustments, we need to know if it's an increase or decrease
      const adjustmentValue = Math.abs(transaction.quantity * item.costPrice);
      if (transaction.notes?.includes("increase") || transaction.quantity > 0) {
        entries.push({
          date,
          account: "Inventory",
          debit: adjustmentValue,
          credit: 0,
          description: `Inventory adjustment increase - ${item.name}`,
          reference,
        });
        entries.push({
          date,
          account: "Inventory Adjustment",
          debit: 0,
          credit: adjustmentValue,
          description: `Adjustment for ${item.name} - stock increase`,
          reference,
        });
      } else {
        entries.push({
          date,
          account: "Inventory Adjustment",
          debit: adjustmentValue,
          credit: 0,
          description: `Adjustment for ${item.name} - stock decrease`,
          reference,
        });
        entries.push({
          date,
          account: "Inventory",
          debit: 0,
          credit: adjustmentValue,
          description: `Inventory adjustment decrease - ${item.name}`,
          reference,
        });
      }
      break;
  }

  return entries;
};

/**
 * Calculate reorder levels based on sales velocity
 */
export const calculateReorderLevels = (
  item: InventoryItem,
  transactions: InventoryTransaction[],
  leadTimeDays: number = 30,
): {
  reorderPoint: number;
  economicOrderQuantity: number;
  suggestedMinStock: number;
} => {
  // Get sales transactions for this item in the last 90 days
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const recentSales = transactions.filter(
    (t) =>
      t.type === "sale" &&
      t.itemId === item.id &&
      new Date(t.date) >= ninetyDaysAgo,
  );

  if (recentSales.length === 0) {
    // No recent sales data, use conservative estimates
    return {
      reorderPoint: item.minStockLevel || 10,
      economicOrderQuantity: 20,
      suggestedMinStock: item.minStockLevel || 10,
    };
  }

  // Calculate average daily sales
  const totalSalesQuantity = recentSales.reduce(
    (sum, t) => sum + t.quantity,
    0,
  );
  const dailyAverageSales = totalSalesQuantity / 90;

  // Calculate reorder point (sales during lead time + safety stock)
  const safetyStockDays = 7; // 1 week safety stock
  const reorderPoint = Math.ceil(
    dailyAverageSales * (leadTimeDays + safetyStockDays),
  );

  // Simple EOQ calculation (assume ordering cost = 100, holding cost = 20% of item cost)
  const annualDemand = dailyAverageSales * 365;
  const orderingCost = 100;
  const holdingCostRate = 0.2;
  const holdingCost = item.costPrice * holdingCostRate;

  const economicOrderQuantity = Math.ceil(
    Math.sqrt((2 * annualDemand * orderingCost) / holdingCost),
  );

  // Suggested minimum stock should be at least the reorder point
  const suggestedMinStock = Math.max(reorderPoint, item.minStockLevel || 10);

  return {
    reorderPoint,
    economicOrderQuantity: Math.max(economicOrderQuantity, 1),
    suggestedMinStock,
  };
};

/**
 * Validate inventory transaction before processing
 */
export const validateInventoryTransaction = (
  item: InventoryItem,
  quantity: number,
  type: InventoryTransaction["type"],
): { isValid: boolean; error?: string } => {
  if (quantity <= 0) {
    return { isValid: false, error: "Quantity must be greater than zero" };
  }

  if (type === "sale" && item.stock < quantity) {
    return {
      isValid: false,
      error: `Insufficient stock. Available: ${item.stock}, Required: ${quantity}`,
    };
  }

  if (!item.partNumber || !item.name) {
    return { isValid: false, error: "Item missing required information" };
  }

  return { isValid: true };
};

/**
 * Format inventory value for display
 */
export const formatInventoryValue = (
  value: number,
  compact: boolean = false,
): string => {
  if (compact) {
    if (value >= 10000000) {
      // 1 crore
      return `₹${(value / 10000000).toFixed(1)}Cr`;
    }
    if (value >= 100000) {
      // 1 lakh
      return `₹${(value / 100000).toFixed(1)}L`;
    }
    if (value >= 1000) {
      return `₹${(value / 1000).toFixed(1)}K`;
    }
  }

  return `₹${value.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};

/**
 * Get inventory status color for UI
 */
export const getInventoryStatusColor = (item: InventoryItem): string => {
  if (item.stock === 0) {
    return "bg-red-500/20 text-red-300 border-red-500/30";
  }
  if (item.stock <= (item.minStockLevel || 10)) {
    return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
  }
  return "bg-green-500/20 text-green-300 border-green-500/30";
};

/**
 * Generate inventory barcode (simple implementation)
 */
export const generateBarcode = (partNumber: string): string => {
  // Simple barcode generation - in real world, use proper barcode library
  return `*${partNumber.replace(/[^A-Z0-9]/g, "")}*`;
};

/**
 * Export inventory data for external systems
 */
export const exportInventoryData = (
  inventory: InventoryItem[],
  format: "csv" | "json" = "csv",
): string => {
  if (format === "json") {
    return JSON.stringify(inventory, null, 2);
  }

  // CSV format
  const headers = [
    "Part Number",
    "Name",
    "Brand",
    "Category",
    "Vehicle",
    "Stock",
    "Cost Price",
    "Selling Price",
    "Status",
    "Min Stock Level",
  ];

  const csvData = inventory.map((item) => [
    item.partNumber,
    item.name,
    item.brand,
    item.category,
    item.vehicle,
    item.stock.toString(),
    item.costPrice.toString(),
    item.sellingPrice.toString(),
    item.status,
    (item.minStockLevel || 10).toString(),
  ]);

  const csvContent = [headers, ...csvData]
    .map((row) => row.map((field) => `"${field}"`).join(","))
    .join("\n");

  return csvContent;
};
