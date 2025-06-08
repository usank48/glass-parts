import React, { useState } from "react";
import { Dashboard } from "@/components/Dashboard";
import { Inventory } from "@/components/Inventory";
import { Suppliers } from "@/components/Suppliers";
import { Invoicing } from "@/components/Invoicing";
import { Staff } from "@/components/Staff";
import { Accounting } from "@/components/Accounting";
import { Sales } from "@/components/Sales";
import { Purchase } from "@/components/Purchase";
import { Sidebar } from "@/components/Sidebar";
import { BottomBar } from "@/components/BottomBar";
import { TopBar } from "@/components/TopBar";
import { FloatingActionButton } from "@/components/FloatingActionButton";

const Index = () => {
  const [activeModule, setActiveModule] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderActiveModule = () => {
    switch (activeModule) {
      case "dashboard":
        return <Dashboard />;
      case "inventory":
        return <Inventory />;
      case "suppliers":
        return <Suppliers />;
      case "invoicing":
        return <Invoicing />;
      case "staff":
        return <Staff />;
      case "accounting":
        return <Accounting />;
      case "sales":
        return <Sales />;
      case "purchase":
        return <Purchase />;
      default:
        return <Dashboard />;
    }
  };

  const handleAddProduct = () => {
    setActiveModule("inventory");
    console.log("Add new product");
  };

  const handleAddSale = () => {
    setActiveModule("sales");
    console.log("Add new sale");
  };

  const handleAddPurchase = () => {
    setActiveModule("purchase");
    console.log("Add new purchase");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-blue-400/10"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>

      <div className="relative z-10 flex h-screen">
        <Sidebar
          activeModule={activeModule}
          setActiveModule={setActiveModule}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />
        <div className="flex-1 flex flex-col">
          <TopBar onMenuClick={() => setIsSidebarOpen(true)} />
          <main className="flex-1 overflow-auto p-6 pt-20 pb-24">
            {renderActiveModule()}
          </main>
        </div>
      </div>

      <BottomBar
        activeModule={activeModule}
        setActiveModule={setActiveModule}
      />
      <FloatingActionButton
        activeModule={activeModule}
        onAddProduct={handleAddProduct}
        onAddSale={handleAddSale}
        onAddPurchase={handleAddPurchase}
      />
    </div>
  );
};

export default Index;
