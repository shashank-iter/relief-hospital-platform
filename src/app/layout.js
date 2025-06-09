import "./globals.css";
import BottomNavigation from "@/components/BottomNavigation";
import TopNavigation from "@/components/TopNavigation";
import { Toaster } from "sonner";


export const metadata = {
  title: "Relief Hospital",
  description: "Your one tap emerygency care. Hospital Integration Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={""}>
        <div className="max-w-md mx-auto h-screen">
          <Toaster position="top-center" />
          <TopNavigation />
          {children}
          <BottomNavigation />
        </div>
      </body>
    </html>
  );
}
