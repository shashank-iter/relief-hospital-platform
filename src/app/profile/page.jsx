import HospitalProfile from "@/components/HospitalProfile"

// This would normally fetch data from your API
const getHospitalData = async () => {
  return {
    statusCode: 200,
    message: "Hospital profile fetched successfully",
    data: {
      location: {
        type: "Point",
        coordinates: [20.2421, 85.8803],
      },
      _id: "68455314b6a79db79752d050",
      owner: "68455313b6a79db79752d04e",
      name: "Sunset Medical Center",
      licenseNumber: "LIC-HOSP-9876543220",
      type: "MULTI_SPECIALITY",
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
      bedData: [
        {
          _id: "684673f2c87f3c6842233d23",
          owner: "68455314b6a79db79752d050",
          type: "General",
          count: 50,
          available: 30,
          createdAt: "2025-06-09T05:41:06.222Z",
          updatedAt: "2025-06-09T05:41:06.222Z",
          __v: 0,
        },
        {
          _id: "684673f2c87f3c6842233d25",
          owner: "68455314b6a79db79752d050",
          type: "ICCU",
          count: 10,
          available: 5,
          createdAt: "2025-06-09T05:41:06.282Z",
          updatedAt: "2025-06-09T05:41:06.282Z",
          __v: 0,
        },
      ],
      is_blood_available: true,
      is_ambulance_available: false,
      createdAt: "2025-06-08T09:08:36.019Z",
      updatedAt: "2025-06-09T05:41:06.390Z",
      __v: 2,
      address: {
        _id: "684555ccb6a79db79752d05c",
        owner: "68455314b6a79db79752d050",
        locality: "Jamohan Nagar, Jagamara",
        city: "Bhubaneswar",
        state: "Odisha",
        pincode: "751030",
        createdAt: "2025-06-08T09:20:12.091Z",
        updatedAt: "2025-06-09T05:41:06.100Z",
        __v: 0,
      },
      bloodData: {
        _id: "684555ccb6a79db79752d05e",
        owner: "68455314b6a79db79752d050",
        opos: 10,
        oneg: 5,
        apos: 8,
        aneg: 4,
        bpos: 7,
        bneg: 3,
        abpos: 2,
        abneg: 1,
        createdAt: "2025-06-08T09:20:12.178Z",
        updatedAt: "2025-06-09T05:41:06.165Z",
        __v: 0,
      },
    },
  }
}

export default async function HospitalProfilePage() {
  const hospitalData = await getHospitalData()
  return (
    <main className="min-h-screen bg-gray-50">
      <HospitalProfile hospitalData={hospitalData.data} />
    </main>
  )
}