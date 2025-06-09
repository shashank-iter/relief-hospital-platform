import HospitalRequestsPage from "@/components/HospitalRequestPage"

const mockAcceptedRequests = [
  {
    _id: "req_003",
    patientName: "Mike Johnson",
    patientPhoneNumber: "+1234567892",
    status: "accepted",
    location: { coordinates: [-74.0085, 40.715] },
    createdAt: "2025-06-09T09:45:00.000Z",
    forSelf: true,
    is_ambulance_required: true,
    description: "Car accident with multiple injuries",
    urgencyLevel: "critical",
  },
]

export default function CancelledRequests() {
  return (
    <main className="min-h-screen bg-gray-50">
      <HospitalRequestsPage requests={mockAcceptedRequests} title="Accepted Requests" status="accepted" />
    </main>
  )
}
