import * as XLSX from "xlsx";

export interface InventoryData {
  partNumber: string;
  oemPartNumber?: string;
  partName: string;
  brand: string;
  vehicleCompatibility: string;
  costPrice: number;
  sellingPrice: number;
  quantity: number;
  category: string;
  subCategory?: string;
}

export interface ExcelValidationResult {
  isValid: boolean;
  errors: string[];
  data: InventoryData[];
  totalRows: number;
  validRows: number;
}

export interface ImportResult {
  success: boolean;
  totalProcessed: number;
  newProducts: number;
  updatedProducts: number;
  errors: string[];
  updatedItems: Array<{
    partNumber: string;
    partName: string;
    oldStock: number;
    newStock: number;
  }>;
  newItems: Array<{
    partNumber: string;
    partName: string;
    stock: number;
  }>;
}

// Expected Excel columns
export const EXCEL_COLUMNS = {
  PART_NUMBER: "Part Number",
  OEM_PART_NUMBER: "OEM Part Number",
  PART_NAME: "Part Name",
  BRAND: "Brand",
  VEHICLE_COMPATIBILITY: "Vehicle Compatibility",
  COST_PRICE: "Cost Price",
  SELLING_PRICE: "Selling Price",
  QUANTITY: "Quantity",
  CATEGORY: "Category",
  SUB_CATEGORY: "Sub Category",
};

// Generate sample Excel file
export const generateSampleExcelFile = (): void => {
  const sampleData = [
    {
      [EXCEL_COLUMNS.PART_NUMBER]: "BP-BMW-X5-2023",
      [EXCEL_COLUMNS.OEM_PART_NUMBER]: "BMW-34116854998",
      [EXCEL_COLUMNS.PART_NAME]: "Premium Brake Pad Set",
      [EXCEL_COLUMNS.BRAND]: "Bosch",
      [EXCEL_COLUMNS.VEHICLE_COMPATIBILITY]: "BMW X5 2023 - 3.0L Diesel",
      [EXCEL_COLUMNS.COST_PRICE]: 89.99,
      [EXCEL_COLUMNS.SELLING_PRICE]: 129.99,
      [EXCEL_COLUMNS.QUANTITY]: 50,
      [EXCEL_COLUMNS.CATEGORY]: "Brake System",
      [EXCEL_COLUMNS.SUB_CATEGORY]: "Brake Pads",
    },
    {
      [EXCEL_COLUMNS.PART_NUMBER]: "EF-TOY-CAM-2022",
      [EXCEL_COLUMNS.OEM_PART_NUMBER]: "TOY-17801-28030",
      [EXCEL_COLUMNS.PART_NAME]: "Engine Air Filter",
      [EXCEL_COLUMNS.BRAND]: "Denso",
      [EXCEL_COLUMNS.VEHICLE_COMPATIBILITY]: "Toyota Camry 2022 - 2.5L Petrol",
      [EXCEL_COLUMNS.COST_PRICE]: 25.5,
      [EXCEL_COLUMNS.SELLING_PRICE]: 39.99,
      [EXCEL_COLUMNS.QUANTITY]: 100,
      [EXCEL_COLUMNS.CATEGORY]: "Engine Parts",
      [EXCEL_COLUMNS.SUB_CATEGORY]: "Filters",
    },
    {
      [EXCEL_COLUMNS.PART_NUMBER]: "SA-HON-CIV-2021",
      [EXCEL_COLUMNS.OEM_PART_NUMBER]: "HON-51606-SNA-A02",
      [EXCEL_COLUMNS.PART_NAME]: "Front Shock Absorber",
      [EXCEL_COLUMNS.BRAND]: "Monroe",
      [EXCEL_COLUMNS.VEHICLE_COMPATIBILITY]: "Honda Civic 2021 - 1.5L Turbo",
      [EXCEL_COLUMNS.COST_PRICE]: 125.0,
      [EXCEL_COLUMNS.SELLING_PRICE]: 189.99,
      [EXCEL_COLUMNS.QUANTITY]: 25,
      [EXCEL_COLUMNS.CATEGORY]: "Suspension",
      [EXCEL_COLUMNS.SUB_CATEGORY]: "Shock Absorbers",
    },
  ];

  // Add instructions as the first row (will be treated as data but provides guidance)
  const instructionsData = [
    {
      [EXCEL_COLUMNS.PART_NUMBER]:
        "📝 INSTRUCTIONS: Products are matched by Part Number or Part Name. Existing products will have their stock updated.",
      [EXCEL_COLUMNS.OEM_PART_NUMBER]: "",
      [EXCEL_COLUMNS.PART_NAME]: "",
      [EXCEL_COLUMNS.BRAND]: "",
      [EXCEL_COLUMNS.VEHICLE_COMPATIBILITY]: "",
      [EXCEL_COLUMNS.COST_PRICE]: "",
      [EXCEL_COLUMNS.SELLING_PRICE]: "",
      [EXCEL_COLUMNS.QUANTITY]: "",
      [EXCEL_COLUMNS.CATEGORY]: "",
      [EXCEL_COLUMNS.SUB_CATEGORY]: "",
    },
    ...sampleData,
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleData);
  const workbook = XLSX.utils.book_new();

  // Set column widths for better readability
  const colWidths = [
    { wch: 18 }, // Part Number
    { wch: 18 }, // OEM Part Number
    { wch: 25 }, // Part Name
    { wch: 12 }, // Brand
    { wch: 30 }, // Vehicle Compatibility
    { wch: 12 }, // Cost Price
    { wch: 12 }, // Selling Price
    { wch: 10 }, // Quantity
    { wch: 15 }, // Category
    { wch: 15 }, // Sub Category
  ];

  worksheet["!cols"] = colWidths;

  XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory Template");

  // Generate file and trigger download
  const fileName = `Inventory_Template_${new Date().toISOString().split("T")[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

// Parse uploaded Excel file
export const parseExcelFile = (file: File): Promise<ExcelValidationResult> => {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });

        if (workbook.SheetNames.length === 0) {
          resolve({
            isValid: false,
            errors: ["No worksheets found in the Excel file."],
            data: [],
            totalRows: 0,
            validRows: 0,
          });
          return;
        }

        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (jsonData.length < 2) {
          resolve({
            isValid: false,
            errors: [
              "Excel file must contain at least a header row and one data row.",
            ],
            data: [],
            totalRows: 0,
            validRows: 0,
          });
          return;
        }

        const headers = jsonData[0] as string[];
        const requiredColumns = [
          EXCEL_COLUMNS.PART_NUMBER,
          EXCEL_COLUMNS.PART_NAME,
          EXCEL_COLUMNS.BRAND,
          EXCEL_COLUMNS.COST_PRICE,
          EXCEL_COLUMNS.SELLING_PRICE,
          EXCEL_COLUMNS.QUANTITY,
          EXCEL_COLUMNS.CATEGORY,
        ];

        // Validate headers
        const missingColumns = requiredColumns.filter(
          (col) => !headers.includes(col),
        );
        if (missingColumns.length > 0) {
          resolve({
            isValid: false,
            errors: [`Missing required columns: ${missingColumns.join(", ")}`],
            data: [],
            totalRows: jsonData.length - 1,
            validRows: 0,
          });
          return;
        }

        // Parse and validate data
        const errors: string[] = [];
        const validData: InventoryData[] = [];

        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i] as any[];
          const rowErrors: string[] = [];

          if (row.length === 0 || row.every((cell) => !cell)) {
            continue; // Skip empty rows
          }

          const rowData: Partial<InventoryData> = {};

          headers.forEach((header, index) => {
            const value = row[index];

            switch (header) {
              case EXCEL_COLUMNS.PART_NUMBER:
                if (!value || typeof value !== "string") {
                  rowErrors.push(
                    `Row ${i + 1}: Part Number is required and must be text`,
                  );
                } else {
                  rowData.partNumber = value.trim();
                }
                break;

              case EXCEL_COLUMNS.OEM_PART_NUMBER:
                rowData.oemPartNumber = value ? String(value).trim() : "";
                break;

              case EXCEL_COLUMNS.PART_NAME:
                if (!value || typeof value !== "string") {
                  rowErrors.push(
                    `Row ${i + 1}: Part Name is required and must be text`,
                  );
                } else {
                  rowData.partName = value.trim();
                }
                break;

              case EXCEL_COLUMNS.BRAND:
                if (!value || typeof value !== "string") {
                  rowErrors.push(
                    `Row ${i + 1}: Brand is required and must be text`,
                  );
                } else {
                  rowData.brand = value.trim();
                }
                break;

              case EXCEL_COLUMNS.VEHICLE_COMPATIBILITY:
                rowData.vehicleCompatibility = value
                  ? String(value).trim()
                  : "";
                break;

              case EXCEL_COLUMNS.COST_PRICE:
                const costPrice = Number(value);
                if (isNaN(costPrice) || costPrice < 0) {
                  rowErrors.push(
                    `Row ${i + 1}: Cost Price must be a valid positive number`,
                  );
                } else {
                  rowData.costPrice = costPrice;
                }
                break;

              case EXCEL_COLUMNS.SELLING_PRICE:
                const sellingPrice = Number(value);
                if (isNaN(sellingPrice) || sellingPrice < 0) {
                  rowErrors.push(
                    `Row ${i + 1}: Selling Price must be a valid positive number`,
                  );
                } else {
                  rowData.sellingPrice = sellingPrice;
                }
                break;

              case EXCEL_COLUMNS.QUANTITY:
                const quantity = Number(value);
                if (
                  isNaN(quantity) ||
                  quantity < 0 ||
                  !Number.isInteger(quantity)
                ) {
                  rowErrors.push(
                    `Row ${i + 1}: Quantity must be a valid positive integer`,
                  );
                } else {
                  rowData.quantity = quantity;
                }
                break;

              case EXCEL_COLUMNS.CATEGORY:
                if (!value || typeof value !== "string") {
                  rowErrors.push(
                    `Row ${i + 1}: Category is required and must be text`,
                  );
                } else {
                  rowData.category = value.trim();
                }
                break;

              case EXCEL_COLUMNS.SUB_CATEGORY:
                rowData.subCategory = value ? String(value).trim() : "";
                break;
            }
          });

          if (rowErrors.length > 0) {
            errors.push(...rowErrors);
          } else if (Object.keys(rowData).length > 0) {
            // Additional validation
            if (rowData.costPrice! > rowData.sellingPrice!) {
              errors.push(
                `Row ${i + 1}: Cost Price cannot be greater than Selling Price`,
              );
            } else {
              validData.push(rowData as InventoryData);
            }
          }
        }

        resolve({
          isValid: errors.length === 0,
          errors,
          data: validData,
          totalRows: jsonData.length - 1,
          validRows: validData.length,
        });
      } catch (error) {
        resolve({
          isValid: false,
          errors: [
            `Failed to parse Excel file: ${error instanceof Error ? error.message : "Unknown error"}`,
          ],
          data: [],
          totalRows: 0,
          validRows: 0,
        });
      }
    };

    reader.onerror = () => {
      resolve({
        isValid: false,
        errors: [
          "Failed to read the file. Please ensure it is a valid Excel file.",
        ],
        data: [],
        totalRows: 0,
        validRows: 0,
      });
    };

    reader.readAsArrayBuffer(file);
  });
};

// Export current inventory to Excel
export const exportInventoryToExcel = (products: any[]): void => {
  const exportData = products.map((product) => ({
    [EXCEL_COLUMNS.PART_NUMBER]: product.partNumber,
    [EXCEL_COLUMNS.OEM_PART_NUMBER]: product.oemPartNumber || "",
    [EXCEL_COLUMNS.PART_NAME]: product.name,
    [EXCEL_COLUMNS.BRAND]: product.brand,
    [EXCEL_COLUMNS.VEHICLE_COMPATIBILITY]: product.vehicle,
    [EXCEL_COLUMNS.COST_PRICE]: product.costPrice,
    [EXCEL_COLUMNS.SELLING_PRICE]: product.sellingPrice,
    [EXCEL_COLUMNS.QUANTITY]: product.stock,
    [EXCEL_COLUMNS.CATEGORY]: product.category,
    [EXCEL_COLUMNS.SUB_CATEGORY]: product.subCategory || "",
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();

  // Set column widths
  const colWidths = [
    { wch: 18 },
    { wch: 18 },
    { wch: 25 },
    { wch: 12 },
    { wch: 30 },
    { wch: 12 },
    { wch: 12 },
    { wch: 10 },
    { wch: 15 },
    { wch: 15 },
  ];
  worksheet["!cols"] = colWidths;

  XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory Export");

  const fileName = `Inventory_Export_${new Date().toISOString().split("T")[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};
