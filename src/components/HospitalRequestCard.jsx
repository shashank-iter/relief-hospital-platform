"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  Camera,
  X,
  User,
  Heart,
  Users,
  Home,
  Calendar,
  Droplet,
  CreditCard,
} from "lucide-react";
import { toast } from "sonner";
import { clientPost } from "@/utils/clientApi";

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

export default function HospitalRequestCard({ request, refreshRequest }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isPatientDetailsModalOpen, setIsPatientDetailsModalOpen] =
    useState(false);

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  const formatDateOnly = (dateString) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(dateString));
  };

  const handleAcceptRequest = async (er_id) => {
    setIsLoading(true);
    try {
      const response = await clientPost(
        `/emergency/hospital/accept_emergency_request/${request?._id}`
      );
      console.log(response);
      toast.success(`Request accepted for ${request?.patientName}`);
      refreshRequest();
    } catch (error) {
      toast.error("Something went wrong", {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResolveRequest = async () => {
    setIsLoading(true);
    try {
      const response = clientPost(
        `emergency/hospital/mark_resolved/${request?._id}`
      );
      console.log(response);
      toast.success(`Request resolved for ${request?.patientName}`);
      refreshRequest();
    } catch (error) {
     toast.error("Something went wrong", {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigate = () => {
    const [lat, lng] = request?.location.coordinates;
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(mapsUrl, "_blank");
  };

  const hasPhoto = request?.photo && request?.photo.trim() !== "";
  const hasPatientProfile =
    request?.patientProfile && Object.keys(request?.patientProfile).length > 0;

  const renderActionButtons = () => {
    switch (request?.status) {
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

  const renderPatientDetailsModal = () => {
    if (!hasPatientProfile) return null;

    const profile = request?.patientProfile;
    const medicalHistory = profile?.medicalHistory || {};

    return (
      <Dialog
        open={isPatientDetailsModalOpen}
        onOpenChange={setIsPatientDetailsModalOpen}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Patient Details - {profile?.name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 p-4">
            {/* Basic Information */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm">
                    <strong>Age:</strong> {profile?.age} years
                  </span>
                </div>
                <div className="flex items-center">
                  <Droplet className="h-4 w-4 mr-2 text-red-500" />
                  <span className="text-sm">
                    <strong>Blood Group:</strong> {profile?.bloodGroup}
                  </span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm">
                    <strong>Phone:</strong> {profile?.phoneNumber}
                  </span>
                </div>
                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm">
                    <strong>Aadhar:</strong> {profile?.aadharNumber}
                  </span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm">
                    <strong>DOB:</strong> {formatDateOnly(profile?.dob)}
                  </span>
                </div>
              </div>
            </div>

            {/* Address */}
            {profile?.address && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 flex items-center">
                  <Home className="h-5 w-5 mr-2" />
                  Address
                </h3>
                <div className="text-sm space-y-1">
                  <p>
                    <strong>Locality:</strong> {profile?.address?.locality}
                  </p>
                  <p>
                    <strong>City:</strong> {profile?.address?.city}
                  </p>
                  <p>
                    <strong>State:</strong> {profile?.address?.state}
                  </p>
                  <p>
                    <strong>Pincode:</strong> {profile?.address?.pincode}
                  </p>
                </div>
              </div>
            )}

            {/* Emergency Contacts */}
            {profile?.emergencyContacts &&
              profile?.emergencyContacts?.length > 0 && (
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-3 flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Emergency Contacts
                  </h3>
                  <div className="space-y-3">
                    {profile?.emergencyContacts?.map((contact, index) => (
                      <div
                        key={contact?._id || index}
                        className="bg-white p-3 rounded border"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <p>
                            <strong>Name:</strong> {contact?.name}
                          </p>
                          <p>
                            <strong>Relationship:</strong>{" "}
                            {contact?.relationship}
                          </p>
                          <p>
                            <strong>Phone:</strong> {contact?.phoneNumber}
                          </p>
                          <p>
                            <strong>Email:</strong> {contact?.email}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Medical History */}
            {medicalHistory && (
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 flex items-center">
                  <Heart className="h-5 w-5 mr-2" />
                  Medical History
                </h3>

                {/* Diseases */}
                {medicalHistory?.diseases &&
                  medicalHistory?.diseases?.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Current Diseases</h4>
                      <div className="space-y-2">
                        {medicalHistory?.diseases?.map((disease, index) => (
                          <div
                            key={disease?._id || index}
                            className="bg-white p-3 rounded border"
                          >
                            <div className="text-sm space-y-1">
                              <p>
                                <strong>Disease:</strong> {disease?.name}
                              </p>
                              <p>
                                <strong>Status:</strong> {disease?.status}
                              </p>
                              <p>
                                <strong>Medication:</strong>{" "}
                                {disease?.medication}
                              </p>
                              <p>
                                <strong>Duration:</strong>{" "}
                                {formatDateOnly(disease?.from)} to{" "}
                                {formatDateOnly(disease?.to)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Allergies */}
                {medicalHistory?.allergies &&
                  medicalHistory?.allergies?.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Allergies</h4>
                      <div className="space-y-2">
                        {medicalHistory?.allergies?.map((allergy, index) => (
                          <div
                            key={allergy?._id || index}
                            className="bg-white p-3 rounded border"
                          >
                            <div className="text-sm space-y-1">
                              <p>
                                <strong>Allergen:</strong> {allergy?.reason}
                              </p>
                              <p>
                                <strong>Symptoms:</strong> {allergy?.symptoms}
                              </p>
                              <p>
                                <strong>Medication:</strong>{" "}
                                {allergy?.medication}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Injuries */}
                {medicalHistory?.injuries &&
                  medicalHistory?.injuries?.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Past Injuries</h4>
                      <div className="space-y-2">
                        {medicalHistory?.injuries?.map((injury, index) => (
                          <div
                            key={injury?._id || index}
                            className="bg-white p-3 rounded border"
                          >
                            <div className="text-sm space-y-1">
                              <p>
                                <strong>Body Part:</strong> {injury?.body_part}
                              </p>
                              <p>
                                <strong>Injury Year:</strong>{" "}
                                {injury?.injury_year}
                              </p>
                              <p>
                                <strong>Surgery:</strong>{" "}
                                {injury?.surgery ? "Yes" : "No"}
                              </p>
                              <p>
                                <strong>Stitches:</strong>{" "}
                                {injury?.stitches ? "Yes" : "No"}
                              </p>
                              <p>
                                <strong>Recovered:</strong>{" "}
                                {injury?.recovered ? "Yes" : "No"}
                              </p>
                              {injury?.surgery && injury?.surgery_year && (
                                <p>
                                  <strong>Surgery Year:</strong>{" "}
                                  {injury?.surgery_year}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <>
      <Card
        className={`border-l-4 ${
          request?.urgencyLevel === "critical"
            ? "border-l-red-500"
            : "border-l-blue-500"
        }`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h3 className="text-lg font-semibold">{request?.patientName}</h3>
              <Badge className={statusColors[request?.status]}>
                {request?.status}
              </Badge>
              {request?.forSelf && (
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
              <span>{request?.patientPhoneNumber}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-2" />
              <span>{formatDate(request?.createdAt)}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-2" />
              <span>
                {request?.location?.coordinates &&
                  `${request?.location.coordinates[1].toFixed(
                    4
                  )}, ${request?.location.coordinates[0].toFixed(4)}`}
              </span>
            </div>
          </div>

          {/* Photo and Patient Details Section */}
          <div className="mb-4 flex flex-col gap-2">
            {hasPhoto ? (
              <Dialog
                open={isImageModalOpen}
                onOpenChange={setIsImageModalOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    View Photo
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                      <span>Emergency Photo - {request?.patientName}</span>
                    </DialogTitle>
                  </DialogHeader>
                  <div className="flex justify-center items-center p-4">
                    <img
                      src={request?.photo}
                      alt={`Emergency photo for ${request?.patientName}`}
                      className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
                      onError={(e) => {
                        e.target.style.display = "none";
                        toast.error("Failed to load image");
                      }}
                    />
                  </div>
                </DialogContent>
              </Dialog>
            ) : (
              <Badge variant="outline" className="text-gray-500">
                <Camera className="h-3 w-3 mr-1" />
                No Photo Available
              </Badge>
            )}

            {hasPatientProfile &&
              (request?.status === "finalized" ||
                request?.status === "resolved") && (
                <Dialog
                  open={isPatientDetailsModalOpen}
                  onOpenChange={setIsPatientDetailsModalOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center"
                    >
                      <User className="h-4 w-4 mr-2" />
                      View Patient Details
                    </Button>
                  </DialogTrigger>
                  {renderPatientDetailsModal()}
                </Dialog>
              )}
          </div>

          {/* Expanded Details */}
          {isExpanded && (
            <div className="space-y-4 mb-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Emergency Description
                </h4>
                <p className="text-sm text-gray-700">{request?.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Request Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Request ID:</span>
                      <span className="font-mono">{request?._id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Patient Type:</span>
                      <span>
                        {request?.forSelf
                          ? "Self-reported"
                          : "Reported by others"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ambulance Required:</span>
                      <span className="flex items-center">
                        <Ambulance className="h-3 w-3 mr-1" />
                        {request?.is_ambulance_required ? "Yes" : "No"}
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
                        {request?.location?.coordinates?.[1]?.toFixed(6)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Longitude:</span>
                      <span className="font-mono">
                        {request?.location?.coordinates?.[0]?.toFixed(6)}
                      </span>
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
