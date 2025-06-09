"use client";
import HospitalRequestsPage from "@/components/HospitalRequestPage";
import { useState, useEffect } from "react";
import { withAuth } from "@/components/withAuth";
import Loader from "@/components/Loader";
import { clientPost } from "@/utils/clientApi";
import { toast } from "sonner";

function AcceptedRequests() {
  const [requests, setRequests] = useState(null);
  const [loading, setLoading] = useState(false);

  const getResolvedRequests = async () => {
    try {
      const response = await clientPost(
        "/emergency/hospital/get_emergency_requests_by_status",
        {
          status: "resolved",
        }
      );
      setRequests(response.data);
    } catch (err) {
      console.log(err);
      toast("Failed to fetch finalized requests");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getResolvedRequests();
  }, []);
  return (
    <main className="min-h-screen bg-gray-50">
      {requests && (
        <HospitalRequestsPage
          requests={requests}
          title="Resolved Requests"
          status="resolved"
          refreshRequest={getResolvedRequests}
        />
      )}
    </main>
  );
}
export default withAuth(AcceptedRequests);
