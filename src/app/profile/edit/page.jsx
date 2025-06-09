"use client";
import HospitalEditForm from "@/components/HospitalProfileEdit";
import { useState, useEffect } from "react";
import { withAuth } from "@/components/withAuth";
import Loader from "@/components/Loader";
import { clientGet } from "@/utils/clientApi";
import { toast } from "sonner";

// This would normally fetch the current hospital data
const getCurrentHospitalData = async () => {
  return {
    _id: "68455314b6a79db79752d050",
    name: "Sunset Medical Center",
    licenseNumber: "LIC-HOSP-9876543220",
    type: "MULTI_SPECIALITY",
    location: {
      coordinates: [20.2421, 85.8803],
    },
    phoneNumbers: [
      {
        label: "primary",
        number: "+1234567890",
        _id: "684673f2c87f3c6842233d1f",
      },
      {
        label: "primary",
        number: "+0987654321",
        _id: "684673f2c87f3c6842233d20",
      },
    ],
    address: {
      locality: "Jamohan Nagar, Jagamara",
      city: "Bhubaneswar",
      state: "Odisha",
      pincode: "751030",
    },
    bedData: [
      {
        _id: "684673f2c87f3c6842233d23",
        type: "General",
        count: 50,
        available: 30,
      },
      {
        _id: "684673f2c87f3c6842233d25",
        type: "ICCU",
        count: 10,
        available: 5,
      },
    ],
    bloodData: {
      opos: 10,
      oneg: 5,
      apos: 8,
      aneg: 4,
      bpos: 7,
      bneg: 3,
      abpos: 2,
      abneg: 1,
    },
    is_blood_available: true,
    is_ambulance_available: false,
  };
};

function EditHospitalProfile() {
  const [hospitalData, setHospitalData] = useState(null);
  const [loading, setLoading] = useState(false);

  const getHospitalProfile = async () => {
    try {
      const response = await clientGet("/users/hospital/profile");
      setHospitalData(response.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch profile data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getHospitalProfile();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-6 px-4 max-w-4xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Edit Hospital Profile
            </h1>
            <p className="text-gray-600 mt-2">
              Update hospital information and services
            </p>
          </div>
          <Loader />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-6 px-4 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Edit Hospital Profile
          </h1>
          <p className="text-gray-600 mt-2">
            Update hospital information and services
          </p>
        </div>
        {hospitalData && <HospitalEditForm initialData={hospitalData} />}
      </div>
    </main>
  );
}

export default withAuth(EditHospitalProfile);
