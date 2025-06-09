"use client";
import HospitalProfile from "@/components/HospitalProfile";
import { useState, useEffect } from "react";
import { withAuth } from "@/components/withAuth";
import Loader from "@/components/Loader";
import { clientGet } from "@/utils/clientApi";
import { toast } from "sonner";

function HospitalProfilePage() {
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

  return (
    <main className="min-h-screen bg-gray-50">
      {hospitalData ? (
        <HospitalProfile hospitalData={hospitalData} />
      ) : (
        <div className="min-h-full flex items-center justify-center">
          <Loader />
        </div>
      )}
    </main>
  );
}
export default withAuth(HospitalProfilePage);
