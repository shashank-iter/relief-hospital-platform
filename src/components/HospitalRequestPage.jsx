"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import HospitalRequestCard from "./HospitalRequestCard";

export default function HospitalRequestsPage({ requests, title, status, refreshRequest }) {
  const router = useRouter();
  return (
    <div className="container mx-auto py-6 pb-24 px-4 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col items-start justify-between mb-6">
        <div className="flex flex-col items-start space-y-4 space-x-4">
          <Button variant="outline" onClick={() => router.push("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            <p className="text-gray-600 mt-1">
              {requests.length} request{requests.length !== 1 ? "s" : ""} found
            </p>
          </div>
        </div>
      </div>
      {/* Requests List */}
      <div className="space-y-4">
        {requests.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                📋
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No requests found
            </h3>
            <p className="text-gray-600">
              There are no {status} requests at the moment.
            </p>
          </div>
        ) : (
          requests.map((request) => (
            <HospitalRequestCard key={request._id} request={request} refreshRequest={refreshRequest} />
          ))
        )}
      </div>
    </div>
  );
}
