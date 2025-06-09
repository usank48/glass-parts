import React from "react";
import MyComponent from "@/components/MyComponent";

const TestComponent = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-blue-400/10"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>

      <div className="relative z-10 container mx-auto py-8">
        <MyComponent />
      </div>
    </div>
  );
};

export default TestComponent;
