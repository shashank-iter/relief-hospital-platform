"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, Clock, AlertCircle, CheckCircle, XCircle, MapPin, Users } from "lucide-react"

export default function HospitalHomePage() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [hospitalName] = useState("Sunrise Medical Center") // In a real app, this would come from hospital context
  const router = useRouter()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 17) return "Good Afternoon"
    return "Good Evening"
  }

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
      route: "/hospital/requests/cancelled",
    },
  ]

  return (
    <div className="min-h-screen p-4 pb-24">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Greeting Banner */}
        <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">
                  {getGreeting()}, {hospitalName}!
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

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Emergencies</p>
                  <p className="text-2xl font-bold text-red-600">10</p>
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
                  <p className="text-2xl font-bold text-blue-600">35</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Cases Resolved Today</p>
                  <p className="text-2xl font-bold text-green-600">8</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Request Categories */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Emergency Request Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6">
            {requestCategories.map((category) => {
              const IconComponent = category.icon
              return (
              <>
                  <Card
                  key={category.title}
                  className={`cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 ${category.borderColor} border-l-4`}
                  onClick={() => router.push(category.route)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-full ${category.bgColor}`}>
                        <IconComponent className={`h-6 w-6 ${category.textColor}`} />
                      </div>
                      <Badge className={`${category.color} text-white`}>{category.count}</Badge>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{category.description}</p>
                    <Button variant="outline" className="w-full">
                      View Requests
                    </Button>
                  </CardContent>
                </Card>
              </>
              )
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
                  <h3 className="font-semibold text-blue-900 text-center">Hospital Location Services</h3>
                  <p className="text-sm text-blue-700 text-center">
                    Manage your hospital's location visibility and emergency response radius
                  </p>
                </div>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Manage Location</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

