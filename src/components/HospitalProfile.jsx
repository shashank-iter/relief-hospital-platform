"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { withAuth } from "./withAuth";
import {
  Building2,
  MapPin,
  Phone,
  Calendar,
  CreditCard,
  Bed,
  Droplets,
  Ambulance,
  Edit,
  ArrowLeft,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

const bloodGroupLabels = {
  opos: "O+",
  oneg: "O-",
  apos: "A+",
  aneg: "A-",
  bpos: "B+",
  bneg: "B-",
  abpos: "AB+",
  abneg: "AB-",
};

function HospitalProfile({ hospitalData }) {
  const router = useRouter();

  const getTotalBeds = () => {
    return hospitalData?.bedData.reduce((total, bed) => total + bed?.count, 0);
  };

  const getAvailableBeds = () => {
    return hospitalData?.bedData.reduce(
      (total, bed) => total + bed?.available,
      0
    );
  };

  const getTotalBloodUnits = () => {
    return Object.entries(hospitalData?.bloodData)
      .filter(
        ([key]) =>
          !key.startsWith("_") &&
          key !== "owner" &&
          key !== "createdAt" &&
          key !== "updatedAt"
      )
      .reduce((total, [, count]) => total + count, 0);
  };

  return (
    <div className="container mx-auto py-6 pb-16 px-4 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col items-start space-y-4 justify-between mb-6">
        <div className="flex flex-col items-start space-y-4 space-x-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Hospital Profile
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your hospital information and services
            </p>
          </div>
        </div>
        <Button onClick={() => router.push("/profile/edit")}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      {/* Hospital Identity Card */}
      <Card className="mb-6 border-l-4 border-l-green-500 shadow-md">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center">
                <Building2 className="h-6 w-6 mr-2" />
                {hospitalData?.name}
              </CardTitle>
              <CardDescription className="flex items-center mt-1">
                <CreditCard className="h-4 w-4 mr-1" />
                License: {hospitalData?.licenseNumber}
              </CardDescription>
            </div>
            <Badge className="bg-green-500 hover:bg-green-600">
              {hospitalData?.type?.replace("_", " ")}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                <div>
                  <span className="text-gray-700 font-medium">Address:</span>
                  <address className="ml-2 not-italic">
                    {hospitalData?.address.locality},{" "}
                    {hospitalData?.address.city}
                    <br />
                    {hospitalData?.address.state} -{" "}
                    {hospitalData?.address.pincode}
                  </address>
                </div>
              </div>
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-gray-700 font-medium">Registered on:</span>
                <span className="ml-2">
                  {formatDate(hospitalData?.createdAt)}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <span className="text-gray-700 font-medium">Coordinates:</span>
                <span className="ml-2 font-mono text-xs">
                  {hospitalData?.location?.coordinates[1].toFixed(4)},{" "}
                  {hospitalData?.location?.coordinates[0].toFixed(4)}
                </span>
              </div>
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-gray-700 font-medium">Profile Last Updated:</span>
                <span className="ml-2">
                  {formatDate(hospitalData?.updatedAt)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Overview */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Beds</p>
                <p className="text-2xl font-bold text-blue-600">
                  {getTotalBeds()}
                </p>
                <p className="text-xs text-gray-500">
                  {getAvailableBeds()} available
                </p>
              </div>
              <Bed className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Blood Units</p>
                <p className="text-2xl font-bold text-red-600">
                  {getTotalBloodUnits()}
                </p>
                <p className="text-xs text-gray-500">
                  {hospitalData?.is_blood_available
                    ? "Blood bank active"
                    : "Blood bank inactive"}
                </p>
              </div>
              <Droplets className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ambulance Service</p>
                <p className="text-lg font-bold text-amber-600">
                  {hospitalData?.is_ambulance_available
                    ? "Available"
                    : "Unavailable"}
                </p>
                <p className="text-xs text-gray-500">Emergency transport</p>
              </div>
              <Ambulance className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information Tabs */}
      <Tabs defaultValue="contact" className="mb-6">
        <TabsList className="grid grid-cols-4 mb-4 mx-auto">
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="beds">Bed </TabsTrigger>
          <TabsTrigger value="blood">Blood</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>

        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
              <CardDescription>
                Phone numbers and communication details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h3 className="font-medium">Phone Numbers</h3>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  {hospitalData?.phoneNumbers.map((phone) => (
                    <div
                      key={phone?._id}
                      className="flex items-center justify-between border rounded-lg p-3"
                    >
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-500" />
                        <div>
                          <p className="font-medium">{phone?.number}</p>
                          <p className="text-xs text-gray-500 capitalize">
                            {phone?.label}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`tel:${phone?.number}`)}
                      >
                        Call
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="beds">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bed Availability</CardTitle>
              <CardDescription>
                Current bed status and capacity management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {hospitalData?.bedData.map((bed) => (
                  <div key={bed?._id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-lg flex items-center">
                        <Bed className="h-5 w-5 mr-2" />
                        {bed?.type} Beds
                      </h3>
                      <Badge
                        variant={bed?.available > 0 ? "default" : "secondary"}
                      >
                        {bed?.available > 0 ? "Available" : "Full"}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">
                          {bed?.count}
                        </p>
                        <p className="text-xs text-gray-500">Total</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">
                          {bed?.available}
                        </p>
                        <p className="text-xs text-gray-500">Available</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-red-600">
                          {bed?.count - bed?.available}
                        </p>
                        <p className="text-xs text-gray-500">Occupied</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-600 h-3 rounded-full transition-all duration-300"
                        style={{
                          width: `${(bed?.available / bed?.count) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Last updated: {formatDate(bed?.updatedAt)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blood">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Droplets className="h-5 w-5 mr-2" />
                Blood Bank Inventory
              </CardTitle>
              <CardDescription>Available blood units by type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-6">
                {Object.entries(hospitalData?.bloodData).map(
                  ([type, count]) => {
                    if (
                      type?.startsWith("_") ||
                      type === "owner" ||
                      type === "createdAt" ||
                      type === "updatedAt"
                    )
                      return null;
                    return (
                      <div
                        key={type}
                        className="border rounded-lg p-4 text-center"
                      >
                        <div className="flex items-center justify-center mb-2">
                          <Droplets className="h-5 w-5 mr-1 text-red-500" />
                          <span className="font-bold text-lg">
                            {bloodGroupLabels[type]}
                          </span>
                        </div>
                        <p className="text-3xl font-bold text-red-600">
                          {count}
                        </p>
                        <p className="text-xs text-gray-500">units available</p>
                        <Badge
                          variant={
                            count > 5
                              ? "default"
                              : count > 0
                              ? "secondary"
                              : "destructive"
                          }
                          className="mt-2"
                        >
                          {count > 5
                            ? "Good Stock"
                            : count > 0
                            ? "Low Stock"
                            : "Out of Stock"}
                        </Badge>
                      </div>
                    );
                  }
                )}
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    ℹ
                  </div>
                  <div>
                    <p className="font-medium text-blue-900">
                      Blood Bank Status
                    </p>
                    <p className="text-sm text-blue-700">
                      Blood bank is currently{" "}
                      <span className="font-medium">
                        {hospitalData?.is_blood_available
                          ? "active and accepting donations"
                          : "inactive"}
                      </span>
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      Last updated:{" "}
                      {formatDate(hospitalData?.bloodData.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Hospital Services</CardTitle>
              <CardDescription>
                Available services and capabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium flex items-center">
                        <Droplets className="h-4 w-4 mr-2" />
                        Blood Bank Service
                      </h3>
                      {hospitalData?.is_blood_available ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {hospitalData?.is_blood_available
                        ? "Blood bank is operational with multiple blood types available"
                        : "Blood bank service is currently not available"}
                    </p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium flex items-center">
                        <Ambulance className="h-4 w-4 mr-2" />
                        Ambulance Service
                      </h3>
                      {hospitalData?.is_ambulance_available ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {hospitalData?.is_ambulance_available
                        ? "Emergency ambulance service is available 24/7"
                        : "Ambulance service is currently not available"}
                    </p>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2 flex items-center">
                    <Building2 className="h-4 w-4 mr-2" />
                    Hospital Type & Specialization
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    This is a{" "}
                    <span className="font-medium">
                      {hospitalData?.type?.replace("_", " ")}
                    </span>{" "}
                    hospital providing comprehensive medical care.
                  </p>
                  <Badge className="bg-green-100 text-green-800">
                    {hospitalData?.type?.replace("_", " ")}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default withAuth(HospitalProfile);
