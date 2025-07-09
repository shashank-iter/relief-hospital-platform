"use client";
import HospitalEditForm from "@/components/HospitalProfileEdit";
import { useState, useEffect } from "react";
import { withAuth } from "@/components/withAuth";
import Loader from "@/components/Loader";
import { clientGet } from "@/utils/clientApi";
import { toast } from "sonner";


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
