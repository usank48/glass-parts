import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Package, Plus, Car, ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface AddProductDialogProps {
  onClose: () => void;
  onProductAdded?: (product: any) => void;
}

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: string;
  engine: string;
  fuel: string;
}

export const AddProductDialog: React.FC<AddProductDialogProps> = ({
  onClose,
}) => {
  const [formData, setFormData] = useState({
    partNumber: "",
    oemPartNumber: "",
    partName: "",
    brand: "",
    vehicleCompatibility: [] as Vehicle[],
    costPrice: "",
    sellingPrice: "",
    quantity: "",
    category: "",
    subCategory: "",
  });

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddSubCategory, setShowAddSubCategory] = useState(false);
  const [showVehicleDialog, setShowVehicleDialog] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newSubCategory, setNewSubCategory] = useState("");

  const [categories] = useState([
    "Engine Parts",
    "Brake System",
    "Suspension",
    "Electrical",
    "Body Parts",
  ]);

  const [subCategories] = useState({
    "Engine Parts": ["Pistons", "Valves", "Gaskets", "Filters"],
    "Brake System": ["Brake Pads", "Brake Discs", "Brake Fluid", "Calipers"],
    Suspension: ["Shock Absorbers", "Springs", "Struts", "Bushings"],
    Electrical: ["Batteries", "Alternators", "Starters", "Wiring"],
    "Body Parts": ["Bumpers", "Doors", "Mirrors", "Lights"],
  });

  const [availableVehicles] = useState<Vehicle[]>([
    {
      id: "1",
      make: "Honda",
      model: "Civic",
      year: "2020",
      engine: "1.5L Turbo",
      fuel: "Petrol",
    },
    {
      id: "2",
      make: "Toyota",
      model: "Camry",
      year: "2019",
      engine: "2.5L",
      fuel: "Petrol",
    },
    {
      id: "3",
      make: "BMW",
      model: "X5",
      year: "2021",
      engine: "3.0L",
      fuel: "Diesel",
    },
  ]);

  const [newVehicle, setNewVehicle] = useState({
    make: "",
    model: "",
    year: "",
    engine: "",
    fuel: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Adding product:", formData);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      setFormData({ ...formData, category: newCategory });
      setNewCategory("");
      setShowAddCategory(false);
    }
  };

  const handleAddSubCategory = () => {
    if (newSubCategory.trim()) {
      setFormData({ ...formData, subCategory: newSubCategory });
      setNewSubCategory("");
      setShowAddSubCategory(false);
    }
  };

  const handleAddVehicle = () => {
    if (newVehicle.make && newVehicle.model && newVehicle.year) {
      const vehicle: Vehicle = {
        id: Date.now().toString(),
        ...newVehicle,
      };
      setFormData({
        ...formData,
        vehicleCompatibility: [...formData.vehicleCompatibility, vehicle],
      });
      setNewVehicle({ make: "", model: "", year: "", engine: "", fuel: "" });
      setShowVehicleDialog(false);
    }
  };

  const handleSelectVehicle = (vehicle: Vehicle) => {
    if (!formData.vehicleCompatibility.find((v) => v.id === vehicle.id)) {
      setFormData({
        ...formData,
        vehicleCompatibility: [...formData.vehicleCompatibility, vehicle],
      });
    }
    setShowVehicleDialog(false);
  };

  const removeVehicle = (vehicleId: string) => {
    setFormData({
      ...formData,
      vehicleCompatibility: formData.vehicleCompatibility.filter(
        (v) => v.id !== vehicleId,
      ),
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              Part Number
            </label>
            <input
              type="text"
              name="partNumber"
              value={formData.partNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
              placeholder="Enter part number"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              OEM Part Number
            </label>
            <input
              type="text"
              name="oemPartNumber"
              value={formData.oemPartNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
              placeholder="Enter OEM part number"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              Part Name
            </label>
            <input
              type="text"
              name="partName"
              value={formData.partName}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
              placeholder="Enter part name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              Brand
            </label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
              placeholder="Enter brand"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              Category
            </label>
            <div className="flex gap-2">
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger className="flex-1 bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-white/90 backdrop-blur-md border border-white/20">
                  {categories.map((category) => (
                    <SelectItem
                      key={category}
                      value={category}
                      className="text-black"
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                onClick={() => setShowAddCategory(true)}
                className="px-3 bg-white/10 border border-white/20 text-white hover:bg-white/20"
                variant="outline"
              >
                <Plus size={16} />
              </Button>
            </div>
            {showAddCategory && (
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="New category name"
                  className="flex-1 px-2 py-1 bg-white/10 border border-white/20 rounded text-white placeholder-white/60 text-sm"
                />
                <Button
                  type="button"
                  onClick={handleAddCategory}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  Add
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowAddCategory(false)}
                  size="sm"
                  variant="outline"
                  className="border-white/20 text-white"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              Sub Category
            </label>
            <div className="flex gap-2">
              <Select
                value={formData.subCategory}
                onValueChange={(value) =>
                  setFormData({ ...formData, subCategory: value })
                }
                disabled={!formData.category}
              >
                <SelectTrigger className="flex-1 bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Select sub category" />
                </SelectTrigger>
                <SelectContent className="bg-white/90 backdrop-blur-md border border-white/20">
                  {formData.category &&
                    subCategories[
                      formData.category as keyof typeof subCategories
                    ]?.map((subCat) => (
                      <SelectItem
                        key={subCat}
                        value={subCat}
                        className="text-black"
                      >
                        {subCat}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                onClick={() => setShowAddSubCategory(true)}
                className="px-3 bg-white/10 border border-white/20 text-white hover:bg-white/20"
                variant="outline"
                disabled={!formData.category}
              >
                <Plus size={16} />
              </Button>
            </div>
            {showAddSubCategory && (
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  value={newSubCategory}
                  onChange={(e) => setNewSubCategory(e.target.value)}
                  placeholder="New sub category name"
                  className="flex-1 px-2 py-1 bg-white/10 border border-white/20 rounded text-white placeholder-white/60 text-sm"
                />
                <Button
                  type="button"
                  onClick={handleAddSubCategory}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  Add
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowAddSubCategory(false)}
                  size="sm"
                  variant="outline"
                  className="border-white/20 text-white"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-1">
            Vehicle Compatibility
          </label>
          <div className="space-y-2">
            <Button
              type="button"
              onClick={() => setShowVehicleDialog(true)}
              className="w-full bg-white/10 border border-white/20 text-white hover:bg-white/20 justify-start"
              variant="outline"
            >
              <Car className="w-4 h-4 mr-2" />
              Add Compatible Vehicle
              <Plus className="w-4 h-4 ml-auto" />
            </Button>

            {formData.vehicleCompatibility.length > 0 && (
              <div className="space-y-1">
                {formData.vehicleCompatibility.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="flex items-center justify-between bg-white/5 border border-white/10 rounded px-3 py-2"
                  >
                    <span className="text-white text-sm">
                      {vehicle.make} {vehicle.model} {vehicle.year} -{" "}
                      {vehicle.engine} ({vehicle.fuel})
                    </span>
                    <Button
                      type="button"
                      onClick={() => removeVehicle(vehicle.id)}
                      size="sm"
                      variant="outline"
                      className="border-red-500/50 text-red-300 hover:bg-red-500/20 px-2 py-1 h-auto"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              Cost Price (₹)
            </label>
            <input
              type="number"
              name="costPrice"
              value={formData.costPrice}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
              placeholder="0"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              Selling Price (₹)
            </label>
            <input
              type="number"
              name="sellingPrice"
              value={formData.sellingPrice}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
              placeholder="0"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
              placeholder="0"
              required
            />
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            type="submit"
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
          >
            <Package className="w-4 h-4 mr-2" />
            Add Product
          </Button>
          <Button
            type="button"
            onClick={onClose}
            variant="outline"
            className="px-6 bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            Cancel
          </Button>
        </div>
      </form>

      {/* Vehicle Selection Dialog */}
      <Dialog open={showVehicleDialog} onOpenChange={setShowVehicleDialog}>
        <DialogContent className="bg-white/10 backdrop-blur-md border border-white/20 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Select Vehicle</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
              <h3 className="text-sm font-medium text-white/80">
                Available Vehicles:
              </h3>
              {availableVehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  onClick={() => handleSelectVehicle(vehicle)}
                  className="p-3 bg-white/5 border border-white/10 rounded cursor-pointer hover:bg-white/10 transition-colors"
                >
                  <div className="text-white font-medium">
                    {vehicle.make} {vehicle.model} {vehicle.year}
                  </div>
                  <div className="text-white/70 text-sm">
                    {vehicle.engine} - {vehicle.fuel}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-white/20 pt-4">
              <h3 className="text-sm font-medium text-white/80 mb-3">
                Add New Vehicle:
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="Make (e.g., Honda)"
                  value={newVehicle.make}
                  onChange={(e) =>
                    setNewVehicle({ ...newVehicle, make: e.target.value })
                  }
                  className="bg-white/10 border-white/20 text-white placeholder-white/60"
                />
                <Input
                  placeholder="Model (e.g., Civic)"
                  value={newVehicle.model}
                  onChange={(e) =>
                    setNewVehicle({ ...newVehicle, model: e.target.value })
                  }
                  className="bg-white/10 border-white/20 text-white placeholder-white/60"
                />
                <Input
                  placeholder="Year (e.g., 2020)"
                  value={newVehicle.year}
                  onChange={(e) =>
                    setNewVehicle({ ...newVehicle, year: e.target.value })
                  }
                  className="bg-white/10 border-white/20 text-white placeholder-white/60"
                />
                <Input
                  placeholder="Engine (e.g., 1.5L Turbo)"
                  value={newVehicle.engine}
                  onChange={(e) =>
                    setNewVehicle({ ...newVehicle, engine: e.target.value })
                  }
                  className="bg-white/10 border-white/20 text-white placeholder-white/60"
                />
                <Select
                  value={newVehicle.fuel}
                  onValueChange={(value) =>
                    setNewVehicle({ ...newVehicle, fuel: value })
                  }
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/90 backdrop-blur-md border border-white/20">
                    <SelectItem value="Petrol" className="text-black">
                      Petrol
                    </SelectItem>
                    <SelectItem value="Diesel" className="text-black">
                      Diesel
                    </SelectItem>
                    <SelectItem value="CNG" className="text-black">
                      CNG
                    </SelectItem>
                    <SelectItem value="Electric" className="text-black">
                      Electric
                    </SelectItem>
                    <SelectItem value="Hybrid" className="text-black">
                      Hybrid
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  onClick={handleAddVehicle}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={
                    !newVehicle.make || !newVehicle.model || !newVehicle.year
                  }
                >
                  Add Vehicle
                </Button>
                <Button
                  onClick={() => setShowVehicleDialog(false)}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
