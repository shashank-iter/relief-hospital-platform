"use client";

import Image from "next/image";
import HospitalHomePage from "@/components/HospitalHomePage";
import { withAuth } from "@/components/withAuth";
function Home() {
  return (
    <>
      <HospitalHomePage />
    </>
  );
}
export default withAuth(Home);
