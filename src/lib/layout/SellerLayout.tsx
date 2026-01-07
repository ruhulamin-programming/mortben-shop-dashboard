import Footer from "@/components/seller/Footer";
import Header from "@/components/seller/Header";
import Sidebar from "@/components/seller/Sidebar";
import React from "react";

const SellerLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 p-6 bg-gray-50">{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default SellerLayout;
