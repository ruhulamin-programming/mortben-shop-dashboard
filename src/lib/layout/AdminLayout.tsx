import React from "react";
import Header from "@/components/admin/Header";
import Sidebar from "@/components/admin/Sidebar";
import Footer from "@/components/admin/Footer";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex bg-gray-50">
      <Sidebar />
      <div className="w-full max-h-screen flex flex-col lg:ms-64">
        <Header />
        <div>
          <main className="flex-1 bg-gray-50 lg:px-12 p-3 lg:py-6 min-h-screen">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
