"use client"
import { useState, useEffect } from 'react'
import HospitalRequestsPage from '@/components/HospitalRequestPage'

// Mock data for requests list
const getRequests = () => {
  return [
    {
            location: {
                "type": "Point",
                "coordinates": [
                    20.246131103392166,
                    85.8024761097669
                ]
            },
            _id: "684683acc7320d4eb838e4e2",
            "createdBy": {
                "_id": "680fcc0cad15e2b2bbc00553"
            },
            forSelf: true,
            patientName: "Shashank Shekhar Pandey",
            patientPhoneNumber: "8888888888",
            photo: "https://res.cloudinary.com/djisclxky/image/upload/v1749453160/qbhe3gqjnrsehjaozlmz.webp",
            acceptedBy: [],
            finalizedHospital: null,
            status: "pending",
            is_ambulance_required: true,
            createdAt: "2025-06-09T06:48:12.320Z",
            updatedAt: "2025-06-09T07:12:41.304Z",
            __v: 0
        },
    {
      _id: "6844aea7660042c582c83f05",
      patientName: "Jane Smith",
      status: "pending",
      createdAt: "2025-06-07T20:15:30.123Z",
      forSelf: false,
      patientPhoneNumber: "+1234567891",
    },
    {
      _id: "6844aea7660042c582c83f06",
      patientName: "Mike Johnson",
      status: "finalized",
      createdAt: "2025-06-07T19:45:12.456Z",
      forSelf: true,
      patientPhoneNumber: "+1234567892",
    },
    {
      _id: "6844aea7660042c582c83f07",
      patientName: "Sarah Wilson",
      status: "resolved",
      createdAt: "2025-06-07T18:30:45.789Z",
      forSelf: false,
      patientPhoneNumber: "+1234567893",
    },
    {
      _id: "6844aea7660042c582c83f08",
      patientName: "David Brown",
      status: "cancelled",
      createdAt: "2025-06-07T17:20:15.321Z",
      forSelf: true,
      patientPhoneNumber: "+1234567894",
    },
    {
      _id: "6844aea7660042c582c83f09",
      patientName: "Emily Davis",
      status: "pending",
      createdAt: "2025-06-07T16:10:30.654Z",
      forSelf: false,
      patientPhoneNumber: "+1234567895",
    },
  ]
}

export default function Requests() {
  const [requests, setRequests] = useState([])

  useEffect(() => {
    const fetchRequests = () => {
      const data = getRequests()
      setRequests(data)
    }
    
    fetchRequests()
  }, [])

  return (
    <HospitalRequestsPage requests={requests} />
  )
}