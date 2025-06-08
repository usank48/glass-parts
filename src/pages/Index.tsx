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
        return <Dashboard onNavigateToModule={setActiveModule} />;
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
        return <Dashboard onNavigateToModule={setActiveModule} />;
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
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar
            activeModule={activeModule}
            setActiveModule={setActiveModule}
            isOpen={true}
            setIsOpen={() => {}}
          />
        </div>

        {/* Mobile Sidebar */}
        <div className="md:hidden">
          <Sidebar
            activeModule={activeModule}
            setActiveModule={setActiveModule}
            isOpen={isSidebarOpen}
            setIsOpen={setIsSidebarOpen}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar onMenuClick={() => setIsSidebarOpen(true)} />
          <main className="flex-1 overflow-auto p-4 sm:p-6 pt-20 pb-20">
            <div className="max-w-full">{renderActiveModule()}</div>
          </main>
        </div>
      </div>

      {/* Bottom Bar */}
      <BottomBar
        activeModule={activeModule}
        setActiveModule={setActiveModule}
      />

      {/* Floating Action Button */}
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
