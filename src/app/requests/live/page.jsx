"use client";
import HospitalRequestsPage from "@/components/HospitalRequestPage";
import { useState, useEffect, useRef } from "react";
import { withAuth } from "@/components/withAuth";
import Loader from "@/components/Loader";
import { clientGet } from "@/utils/clientApi";
import { toast } from "sonner";

function LiveRequests() {
  const [requests, setRequests] = useState(null);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef(null);

  const getLiveRequests = async (showToastOnError = true) => {
    try {
      setLoading(true);
      const response = await clientGet(
        "/emergency/hospital/get_nearby_emergency_requests"
      );
      setRequests(response.data);
    } catch (err) {
      console.log(err);
      if (showToastOnError) {
        toast("Failed to fetch live requests");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    getLiveRequests();

    // Set up polling interval
    intervalRef.current = setInterval(() => {
      getLiveRequests(false); // Don't show toast on polling errors
    }, 15000); // 15 seconds

    // Cleanup interval on component unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Optional: Clear interval when component is not visible (tab switching)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden, clear interval
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      } else {
        // Page is visible, restart interval
        if (!intervalRef.current) {
          intervalRef.current = setInterval(() => {
            getLiveRequests(false);
          }, 15000);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      {requests && (
        <HospitalRequestsPage
          requests={requests}
          title="Live Requests"
          status="pending"
          isLoading={loading}
          refreshRequest={getLiveRequests}
        />
      )}
    </main>
  );
}

export default withAuth(LiveRequests);
