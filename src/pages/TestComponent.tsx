import React from "react";
import MyComponent from "@/components/MyComponent";
import { NotificationDemo } from "@/components/NotificationDemo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TestComponent = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-blue-400/10"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>

      <div className="relative z-10 container mx-auto py-8">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/10 border-white/20">
            <TabsTrigger
              value="dashboard"
              className="text-white data-[state=active]:bg-white/20"
            >
              Dashboard Demo
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="text-white data-[state=active]:bg-white/20"
            >
              Notification System
            </TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard" className="mt-6">
            <MyComponent />
          </TabsContent>
          <TabsContent value="notifications" className="mt-6">
            <NotificationDemo />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TestComponent;
