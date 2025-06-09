"use client";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  MapPin,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
// Fix the import path - check if it's "Loader" or "Loder"
import Loader from "./Loader"; // Changed from "./Loder" to "./Loader"
import { clientGet } from "@/utils/clientApi";

export default function HospitalHomePage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hospitalName] = useState("Sunrise Medical Center");
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const requestCategories = [
    {
      title: "Live Requests",
      description: "New emergency requests awaiting response",
      icon: AlertCircle,
      color: "bg-red-500",
      textColor: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      count: 3,
      route: "/requests/live",
    },
    {
      title: "Accepted Requests",
      description: "Requests you've accepted, awaiting patient confirmation",
      icon: Clock,
      color: "bg-blue-500",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      count: 5,
      route: "/requests/accepted",
    },
    {
      title: "Finalized Requests",
      description: "Confirmed requests requiring immediate attention",
      icon: CheckCircle,
      color: "bg-purple-500",
      textColor: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      count: 2,
      route: "/requests/finalized",
    },
    {
      title: "Resolved Requests",
      description: "Successfully completed emergency cases",
      icon: CheckCircle,
      color: "bg-green-500",
      textColor: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      count: 12,
      route: "/requests/resolved",
    },
    {
      title: "Cancelled Requests",
      description: "Requests that were cancelled or declined",
      icon: XCircle,
      color: "bg-gray-500",
      textColor: "text-gray-600",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
      count: 1,
      route: "/requests/cancelled",
    },
  ];

  const getDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await clientGet("/users/hospital/dashboard");
      console.log(response);
      setDashboardData(response.data);
      localStorage.setItem("name", response?.data?.profile?.name);
      localStorage.setItem("hospitalProfileId", response?.data?.profile?._id);
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  // Simple loading component fallback
  const LoadingComponent = () => (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen p-4 pb-24">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Greeting Banner */}
        {dashboardData ? (
          <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">
                    {getGreeting()}, {dashboardData?.profile?.name}!
                  </h1>
                  <p className="text-green-100 mt-1">
                    {currentTime.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-green-100 text-sm">
                    {currentTime.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <Building2 className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div>
            {/* Use the fallback component or conditional rendering */}
            {typeof Loader !== "undefined" ? <Loader /> : <LoadingComponent />}
          </div>
        )}

        {/* Quick Stats */}
        {dashboardData ? (
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <Card className="border-l-4 border-l-red-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Emergencies</p>
                    <p className="text-2xl font-bold text-red-600">
                      {dashboardData?.finalizedRequestsCount || "N/A"}
                    </p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Available Beds</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {dashboardData?.totalAvailableBeds}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Cases Resolved</p>
                    <p className="text-2xl font-bold text-green-600">
                      {dashboardData?.resolvedRequestsCount}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div>
            {/* Use the fallback component or conditional rendering */}
            {typeof Loader !== "undefined" ? <Loader /> : <LoadingComponent />}
          </div>
        )}

        {/* Request Categories */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Emergency Request Management
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6">
            {requestCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Card
                  key={category.title}
                  className={`cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 ${category.borderColor} border-l-4`}
                  onClick={() => router.push(category.route)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-full ${category.bgColor}`}>
                        <IconComponent
                          className={`h-6 w-6 ${category.textColor}`}
                        />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {category.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {category.description}
                    </p>
                    <Button variant="outline" className="w-full">
                      View Requests
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex flex-col gap-y-2 items-center justify-between">
              <div className="flex flex-col items-center justify-items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 text-center">
                    Hospital Location Services
                  </h3>
                  <p className="text-sm text-blue-700 text-center">
                    Manage your hospital's location visibility and emergency
                    response radius
                  </p>
                </div>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Manage Location
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
