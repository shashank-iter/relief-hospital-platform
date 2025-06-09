"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown,
  ChevronUp,
  Phone,
  MapPin,
  Clock,
  Ambulance,
  AlertTriangle,
  Navigation,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";

const urgencyColors = {
  low: "bg-green-100 text-green-800 border-green-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  high: "bg-orange-100 text-orange-800 border-orange-200",
  critical: "bg-red-100 text-red-800 border-red-200",
};

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200 uppercase",
  accepted: "bg-blue-100 text-blue-800 border-blue-200 uppercase",
  finalized: "bg-purple-100 text-purple-800 border-purple-200 uppercase",
  resolved: "bg-green-100 text-green-800 border-green-200 uppercase",
  cancelled: "bg-red-100 text-red-800 border-red-200 uppercase",
};

export default function HospitalRequestCard({ request }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  const handleAcceptRequest = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // toast({
      //   title: "Request Accepted",
      //   description: `You have accepted the emergency request for ${request.patientName}.`,
      // });
    } catch (error) {
      // toast({
      //   title: "Error",
      //   description: "Failed to accept request. Please try again.",
      //   variant: "destructive",
      // });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResolveRequest = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // toast({
      //   title: "Request Resolved",
      //   description: `Emergency request for ${request.patientName} has been marked as resolved.`,
      // });
    } catch (error) {
      // toast({
      //   title: "Error",
      //   description: "Failed to resolve request. Please try again.",
      //   variant: "destructive",
      // });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigate = () => {
    const [lng, lat] = request.location.coordinates;
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(mapsUrl, "_blank");
  };

  const renderActionButtons = () => {
    switch (request.status) {
      case "pending":
        return (
          <Button
            onClick={handleAcceptRequest}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            {isLoading ? "Accepting..." : "Accept Request"}
          </Button>
        );

      case "accepted":
        return (
          <div className="flex items-center space-x-3">
            <Badge className="bg-amber-100 text-amber-800 border-amber-200">
              Waiting for Patient Finalization
            </Badge>
            <Button onClick={handleNavigate} variant="outline">
              <Navigation className="h-4 w-4 mr-2" />
              Navigate
            </Button>
          </div>
        );

      case "finalized":
        return (
          <div className="flex items-center space-x-3">
            <Button onClick={handleNavigate} variant="outline">
              <Navigation className="h-4 w-4 mr-2" />
              Navigate
            </Button>
            <Button
              onClick={handleResolveRequest}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {isLoading ? "Resolving..." : "Mark Resolved"}
            </Button>
          </div>
        );

      case "cancelled":
      case "resolved":
      default:
        return null;
    }
  };

  return (
    <>
      <Card
        className={`border-l-4 ${
          request.urgencyLevel === "critical"
            ? "border-l-red-500"
            : "border-l-blue-500"
        }`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h3 className="text-lg font-semibold">{request.patientName}</h3>
              <Badge className={statusColors[request.status]}>
                {request.status}
              </Badge>
              {/* <Badge className={urgencyColors[request.urgencyLevel]}>
                {request.urgencyLevel}
              </Badge> */}
              {request.forSelf && (
                <Badge variant="outline" className="text-xs">
                  Self
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="h-4 w-4 mr-2" />
              <span>{request.patientPhoneNumber}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-2" />
              <span>{formatDate(request.createdAt)}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-2" />
              <span>
                {/* {request.location.coordinates[1].toFixed(4)},{" "}
                {request.location.coordinates[0].toFixed(4)} */}
              </span>
            </div>
          </div>

          {/* Expanded Details */}
          {isExpanded && (
            <div className="space-y-4 mb-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Emergency Description
                </h4>
                <p className="text-sm text-gray-700">{request.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Request Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Request ID:</span>
                      <span className="font-mono">{request._id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Patient Type:</span>
                      <span>
                        {request.forSelf
                          ? "Self-reported"
                          : "Reported by others"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ambulance Required:</span>
                      <span className="flex items-center">
                        <Ambulance className="h-3 w-3 mr-1" />
                        {request.is_ambulance_required ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Location Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Latitude:</span>
                      <span className="font-mono">
                        {/* {request.location.coordinates[1].toFixed(6)} */}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Longitude:</span>
                      <span className="font-mono">
                        {/* {request.location.coordinates[0].toFixed(6)} */}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Distance:</span>
                      <span>~2.3 km away</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end">{renderActionButtons()}</div>
        </CardContent>
      </Card>
    </>
  );
}
