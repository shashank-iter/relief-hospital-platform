"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { clientPut } from "@/utils/clientApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const hospitalTypes = [
  "PHC",
  "CHC",
  "NURSING HOME",
  "CLINIC",
  "MULTI_SPECIALITY",
  "SUPER_SPECIALITY",
  "OTHERS",
];
const phoneLabels = ["primary", "secondary", "emergency", "reception", "other"];
const bedTypes = [
  "General",
  "ICCU",
  "ICU",
  "NICU",
  "Emergency",
  "Pediatric",
  "Maternity",
  "Surgery",
  "Others",
];

export default function HospitalEditForm({ initialData }) {
  const [formData, setFormData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  // const { toast } = useToast()

  const handleInputChange = (field, value, section, index) => {
    setFormData((prev) => {
      const newData = { ...prev };

      if (section && typeof index === "number") {
        // Handle nested array updates
        newData[section][index] = {
          ...newData[section][index],
          [field]: value,
        };
      } else if (section) {
        // Handle nested object updates
        newData[section] = {
          ...newData[section],
          [field]: value,
        };
      } else {
        // Handle top-level updates
        newData[field] = value;
      }

      return newData;
    });
  };

  const addPhoneNumber = () => {
    setFormData((prev) => ({
      ...prev,
      phoneNumbers: [
        ...prev.phoneNumbers,
        { label: "primary", number: "", _id: `temp_${Date.now()}` },
      ],
    }));
  };

  const removePhoneNumber = (index) => {
    setFormData((prev) => ({
      ...prev,
      phoneNumbers: prev.phoneNumbers.filter((_, i) => i !== index),
    }));
  };

  const addBedType = () => {
    setFormData((prev) => ({
      ...prev,
      bedData: [
        ...prev.bedData,
        { _id: `temp_${Date.now()}`, type: "General", count: 0, available: 0 },
      ],
    }));
  };

  const removeBedType = (index) => {
    setFormData((prev) => ({
      ...prev,
      bedData: prev.bedData.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const apiData = {
        type: formData.type,
        address: {
          locality: formData.address.locality,
          city: formData.address.city,
          state: formData.address.state,
          pincode: formData.address.pincode,
        },
        location: {
          type: "Point",
          coordinates: formData.location.coordinates,
        },
        bedData: formData.bedData.map((bed) => ({
          type: bed.type,
          count: bed.count,
          available: bed.available,
        })),
        is_blood_available: Object.values(formData.bloodData).some(
          (count) => count > 0
        ),
        bloodData: {
          opos: formData.bloodData.opos || 0,
          oneg: formData.bloodData.oneg || 0,
          apos: formData.bloodData.apos || 0,
          aneg: formData.bloodData.aneg || 0,
          bpos: formData.bloodData.bpos || 0,
          bneg: formData.bloodData.bneg || 0,
          abpos: formData.bloodData.abpos || 0,
          abneg: formData.bloodData.abneg || 0,
        },
        phoneNumbers: formData.phoneNumbers.map((phone) => ({
          number: phone.number,
          type: phone.label, // Map label to type as per API spec
        })),
        is_ambulance_available: formData.is_ambulance_available,
      };
      const response = await clientPut(
        "/users/hospital/update-profile",
        apiData
      );
      toast.success("Profile updated successfully", {
        description: response.message,
      });
      router.push("/profile");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong", {
        description: error?.response?.data?.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Profile
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="flex items-center"
        >
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Hospital identity and classification details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Hospital Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="license">License Number *</Label>
              <Input
                id="license"
                value={formData.licenseNumber}
                onChange={(e) =>
                  handleInputChange("licenseNumber", e.target.value)
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Hospital Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleInputChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select hospital type" />
                </SelectTrigger>
                <SelectContent>
                  {hospitalTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Hospital ID</Label>
              <Input value={formData._id} disabled className="bg-gray-100" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location & Address */}
      <Card>
        <CardHeader>
          <CardTitle>Location & Address</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude *</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                value={formData.location.coordinates[0]}
                onChange={(e) => {
                  const newCoords = [...formData.location.coordinates];
                  newCoords[0] = Number.parseFloat(e.target.value);
                  handleInputChange("coordinates", newCoords, "location");
                }}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude *</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                value={formData.location.coordinates[1]}
                onChange={(e) => {
                  const newCoords = [...formData.location.coordinates];
                  newCoords[1] = Number.parseFloat(e.target.value);
                  handleInputChange("coordinates", newCoords, "location");
                }}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="locality">Locality/Area *</Label>
              <Input
                id="locality"
                value={formData.address.locality}
                onChange={(e) =>
                  handleInputChange("locality", e.target.value, "address")
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={formData.address.city}
                onChange={(e) =>
                  handleInputChange("city", e.target.value, "address")
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                value={formData.address.state}
                onChange={(e) =>
                  handleInputChange("state", e.target.value, "address")
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pincode">Pincode *</Label>
              <Input
                id="pincode"
                value={formData.address.pincode}
                onChange={(e) =>
                  handleInputChange("pincode", e.target.value, "address")
                }
                maxLength={6}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Phone numbers and communication details
              </CardDescription>
            </div>
            <Button type="button" onClick={addPhoneNumber} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Phone
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.phoneNumbers.map((phone, index) => (
            <div key={phone._id} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Phone {index + 1}</h4>
                {formData.phoneNumbers.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removePhoneNumber(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label>Phone Number *</Label>
                  <Input
                    value={phone.number}
                    onChange={(e) =>
                      handleInputChange(
                        "number",
                        e.target.value,
                        "phoneNumbers",
                        index
                      )
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Label *</Label>
                  <Select
                    value={phone.label}
                    onValueChange={(value) =>
                      handleInputChange("label", value, "phoneNumbers", index)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {phoneLabels.map((label) => (
                        <SelectItem key={label} value={label}>
                          {label.charAt(0).toUpperCase() + label.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Services & Facilities */}
      <Card>
        <CardHeader>
          <CardTitle>Services & Facilities</CardTitle>
          <CardDescription>
            Available services and facility management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="beds">
            <TabsList className="grid grid-cols-3 mb-4 mx-auto">
              <TabsTrigger value="beds">Bed </TabsTrigger>
              <TabsTrigger value="blood">Blood </TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
            </TabsList>

            {/* Bed Management Tab */}
            <TabsContent value="beds" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">
                  Bed Types & Availability
                </h3>
                <Button type="button" onClick={addBedType} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Bed Type
                </Button>
              </div>
              {formData.bedData.map((bed, index) => (
                <div key={bed._id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Bed Type {index + 1}</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeBedType(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Bed Type *</Label>
                      <Select
                        value={bed.type}
                        onValueChange={(value) => {
                          const newBedData = [...formData.bedData];
                          newBedData[index] = {
                            ...newBedData[index],
                            type: value,
                          };
                          setFormData((prev) => ({
                            ...prev,
                            bedData: newBedData,
                          }));
                        }}
                        className="bg-amber-200"
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {bedTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Total Count *</Label>
                      <Input
                        type="number"
                        value={bed.count}
                        onChange={(e) => {
                          const newBedData = [...formData.bedData];
                          newBedData[index] = {
                            ...newBedData[index],
                            count: Number.parseInt(e.target.value),
                          };
                          setFormData((prev) => ({
                            ...prev,
                            bedData: newBedData,
                          }));
                        }}
                        min="0"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Available *</Label>
                      <Input
                        type="number"
                        value={bed.available}
                        onChange={(e) => {
                          const newBedData = [...formData.bedData];
                          newBedData[index] = {
                            ...newBedData[index],
                            available: Number.parseInt(e.target.value),
                          };
                          setFormData((prev) => ({
                            ...prev,
                            bedData: newBedData,
                          }));
                        }}
                        min="0"
                        max={bed.count}
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            {/* Blood Bank Tab */}
            <TabsContent value="blood" className="space-y-4">
              <h3 className="text-lg font-medium">Blood Bank Inventory</h3>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                {Object.entries(formData.bloodData).map(([type, count]) => {
                  if (
                    type?.startsWith("_") ||
                    type === "owner" ||
                    type === "createdAt" ||
                    type === "updatedAt"
                  )
                    return null;
                  return (
                    <div key={type} className="space-y-2">
                      <Label>
                        {type
                          .toUpperCase()
                          .replace("POS", "+")
                          .replace("NEG", "-")}
                      </Label>
                      <Input
                        type="number"
                        value={count}
                        onChange={(e) => {
                          const newBloodData = { ...formData.bloodData };
                          newBloodData[type] =
                            Number.parseInt(e.target.value) || 0;
                          setFormData((prev) => ({
                            ...prev,
                            bloodData: newBloodData,
                          }));
                        }}
                        min="0"
                      />
                    </div>
                  );
                })}
              </div>
            </TabsContent>

            {/* Services Tab */}
            <TabsContent value="services" className="space-y-4">
              <h3 className="text-lg font-medium">Available Services</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ambulance-service"
                    checked={formData.is_ambulance_available}
                    onCheckedChange={(checked) =>
                      handleInputChange("is_ambulance_available", checked)
                    }
                  />
                  <Label htmlFor="ambulance-service">
                    Ambulance Service Available
                  </Label>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? "Saving..." : "Save Hospital Profile"}
        </Button>
      </div>
    </form>
  );
}
