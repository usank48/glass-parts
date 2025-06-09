import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ShoppingCart,
  Package,
  TrendingUp,
  Users,
  DollarSign,
  BarChart3,
} from "lucide-react";

export default function MyComponent() {
  const stats = [
    {
      title: "Total Sales",
      value: "$12,345",
      icon: DollarSign,
      trend: "+12%",
      color: "text-green-600",
    },
    {
      title: "Products",
      value: "234",
      icon: Package,
      trend: "+5%",
      color: "text-blue-600",
    },
    {
      title: "Customers",
      value: "1,234",
      icon: Users,
      trend: "+8%",
      color: "text-purple-600",
    },
    {
      title: "Orders",
      value: "89",
      icon: ShoppingCart,
      trend: "+15%",
      color: "text-orange-600",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      activity: "New order placed",
      customer: "John Doe",
      amount: "$299.99",
      time: "2 minutes ago",
    },
    {
      id: 2,
      activity: "Product restocked",
      customer: "Wireless Headphones",
      amount: "50 units",
      time: "15 minutes ago",
    },
    {
      id: 3,
      activity: "Payment received",
      customer: "Jane Smith",
      amount: "$149.50",
      time: "1 hour ago",
    },
  ];

  return (
    <div className="p-6 space-y-6 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-white/70 mt-1">
            Welcome to your business management dashboard
          </p>
        </div>
        <Button className="mt-4 sm:mt-0">
          <BarChart3 className="w-4 h-4 mr-2" />
          View Reports
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card
              key={index}
              className="bg-white/10 backdrop-blur-sm border-white/20"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm">{stat.title}</p>
                    <p className="text-2xl font-bold text-white">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-2 rounded-lg bg-white/10 ${stat.color}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-2 flex items-center">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-500 text-sm">{stat.trend}</span>
                  <span className="text-white/50 text-sm ml-1">
                    from last month
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activities */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Recent Activities</CardTitle>
          <CardDescription className="text-white/70">
            Latest updates from your business
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={activity.id}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant="secondary"
                        className="bg-white/20 text-white"
                      >
                        {activity.activity}
                      </Badge>
                    </div>
                    <p className="text-white/90 mt-1">{activity.customer}</p>
                    <p className="text-white/60 text-sm">{activity.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">
                      {activity.amount}
                    </p>
                  </div>
                </div>
                {index < recentActivities.length - 1 && (
                  <Separator className="mt-4 bg-white/20" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
          <CardDescription className="text-white/70">
            Common tasks for your business
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Package className="w-4 h-4 mr-2" />
              Add Product
            </Button>
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              New Sale
            </Button>
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Users className="w-4 h-4 mr-2" />
              Add Customer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
