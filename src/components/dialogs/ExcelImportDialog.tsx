import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Upload,
  Download,
  FileSpreadsheet,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import {
  parseExcelFile,
  generateSampleExcelFile,
  ExcelValidationResult,
  InventoryData,
} from "@/lib/excelUtils";
import { Progress } from "@/components/ui/progress";

interface ExcelImportDialogProps {
  open: boolean;
  onClose: () => void;
  onImport: (data: InventoryData[]) => void;
}

export const ExcelImportDialog: React.FC<ExcelImportDialogProps> = ({
  open,
  onClose,
  onImport,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationResult, setValidationResult] =
    useState<ExcelValidationResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<"upload" | "validate" | "confirm">("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setValidationResult(null);
      setStep("upload");
    }
  };

  const handleValidate = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    try {
      const result = await parseExcelFile(selectedFile);
      setValidationResult(result);
      setStep("validate");
    } catch (error) {
      console.error("Error validating file:", error);
      setValidationResult({
        isValid: false,
        errors: [
          "Failed to process the Excel file. Please check the file format.",
        ],
        data: [],
        totalRows: 0,
        validRows: 0,
      });
      setStep("validate");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = () => {
    if (validationResult?.isValid && validationResult.data.length > 0) {
      onImport(validationResult.data);
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setValidationResult(null);
    setStep("upload");
    setIsProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClose();
  };

  const handleDownloadSample = () => {
    generateSampleExcelFile();
  };

  const renderUploadStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <FileSpreadsheet className="mx-auto text-white/50 mb-4" size={64} />
        <h3 className="text-white text-lg font-semibold mb-2">
          Import Inventory from Excel
        </h3>
        <p className="text-white/70 mb-6">
          Upload an Excel file to bulk import inventory items. Make sure your
          file follows the correct format.
        </p>
      </div>

      <div className="space-y-4">
        {/* Download Sample Button */}
        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">Need a template?</h4>
              <p className="text-white/70 text-sm">
                Download our sample Excel file with the correct format
              </p>
            </div>
            <Button
              onClick={handleDownloadSample}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Download size={16} className="mr-2" />
              Download Sample
            </Button>
          </div>
        </div>

        {/* File Upload Area */}
        <div
          className="border-2 border-dashed border-white/30 rounded-lg p-8 text-center hover:border-white/50 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="mx-auto text-white/50 mb-4" size={48} />
          <div className="space-y-2">
            <p className="text-white font-medium">
              {selectedFile
                ? selectedFile.name
                : "Choose Excel file or drag and drop"}
            </p>
            <p className="text-white/60 text-sm">
              Supports .xlsx and .xls files (Max size: 10MB)
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {selectedFile && (
          <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="text-green-400" size={20} />
              <div>
                <p className="text-white font-medium">{selectedFile.name}</p>
                <p className="text-white/60 text-sm">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button
              onClick={handleValidate}
              disabled={isProcessing}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isProcessing ? "Validating..." : "Validate & Preview"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  const renderValidationStep = () => {
    if (!validationResult) return null;

    return (
      <div className="space-y-6">
        <div className="text-center">
          {validationResult.isValid ? (
            <CheckCircle className="mx-auto text-green-400 mb-4" size={64} />
          ) : (
            <XCircle className="mx-auto text-red-400 mb-4" size={64} />
          )}
          <h3 className="text-white text-lg font-semibold mb-2">
            {validationResult.isValid
              ? "Validation Successful!"
              : "Validation Failed"}
          </h3>
        </div>

        {/* Validation Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-white/5 border border-white/10 rounded-lg text-center">
            <div className="text-2xl font-bold text-white">
              {validationResult.totalRows}
            </div>
            <div className="text-white/70 text-sm">Total Rows</div>
          </div>
          <div className="p-4 bg-white/5 border border-white/10 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-400">
              {validationResult.validRows}
            </div>
            <div className="text-white/70 text-sm">Valid Rows</div>
          </div>
          <div className="p-4 bg-white/5 border border-white/10 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-400">
              {validationResult.totalRows - validationResult.validRows}
            </div>
            <div className="text-white/70 text-sm">Invalid Rows</div>
          </div>
        </div>

        {/* Progress Bar */}
        {validationResult.totalRows > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/70">Success Rate</span>
              <span className="text-white">
                {(
                  (validationResult.validRows / validationResult.totalRows) *
                  100
                ).toFixed(1)}
                %
              </span>
            </div>
            <Progress
              value={
                (validationResult.validRows / validationResult.totalRows) * 100
              }
              className="h-2"
            />
          </div>
        )}

        {/* Errors */}
        {validationResult.errors.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="text-red-400" size={20} />
              <h4 className="text-white font-medium">Issues Found:</h4>
            </div>
            <div className="max-h-40 overflow-y-auto space-y-1">
              {validationResult.errors.map((error, index) => (
                <div
                  key={index}
                  className="p-2 bg-red-500/10 border border-red-500/20 rounded text-red-300 text-sm"
                >
                  {error}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Preview of valid data */}
        {validationResult.validRows > 0 && (
          <div className="space-y-3">
            <h4 className="text-white font-medium">
              Preview of Valid Records:
            </h4>
            <div className="max-h-60 overflow-y-auto">
              <div className="space-y-2">
                {validationResult.data.slice(0, 5).map((item, index) => (
                  <div
                    key={index}
                    className="p-3 bg-white/5 border border-white/10 rounded-lg"
                  >
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-white/70">Part:</span>
                        <span className="text-white ml-2">{item.partName}</span>
                      </div>
                      <div>
                        <span className="text-white/70">Brand:</span>
                        <span className="text-white ml-2">{item.brand}</span>
                      </div>
                      <div>
                        <span className="text-white/70">Part Number:</span>
                        <span className="text-white ml-2">
                          {item.partNumber}
                        </span>
                      </div>
                      <div>
                        <span className="text-white/70">Quantity:</span>
                        <span className="text-white ml-2">{item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {validationResult.data.length > 5 && (
                  <div className="text-center text-white/60 text-sm py-2">
                    ... and {validationResult.data.length - 5} more records
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={() => setStep("upload")}
            variant="outline"
            className="flex-1 border-white/20 text-white hover:bg-white/10"
          >
            Choose Different File
          </Button>
          {validationResult.isValid && validationResult.validRows > 0 && (
            <Button
              onClick={handleImport}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              Import {validationResult.validRows} Records
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-white/10 backdrop-blur-md border border-white/20 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">
            Import Inventory from Excel
          </DialogTitle>
        </DialogHeader>

        {isProcessing && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <span className="ml-3 text-white">Processing file...</span>
          </div>
        )}

        {!isProcessing && step === "upload" && renderUploadStep()}
        {!isProcessing && step === "validate" && renderValidationStep()}
      </DialogContent>
    </Dialog>
  );
};
