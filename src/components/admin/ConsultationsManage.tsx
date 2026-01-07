"use client";
import {
  useDeleteConsultationsMutation,
  useGetConsultationsQuery,
  useUpdateConsultationMutation,
} from "@/lib/services/consultationApi";
import { Trash } from "lucide-react";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import CustomeLoader from "./Loader";

const ConsultationManage = () => {
  const [page, setPage] = useState(1);
  const { data: consultations, isLoading } = useGetConsultationsQuery({ page });
  const consultationsList = consultations?.result?.results ?? [];
  const totalPages = consultations?.result?.totalPages || 1;
  const [consultationDeleteFn, { error: deleteError }] =
    useDeleteConsultationsMutation();
  const [updateConsultationFn, { error: consultationError }] =
    useUpdateConsultationMutation();

  const handleDelete = async (id: string) => {
    try {
      const response = await consultationDeleteFn(id);
      if (response.data.success === true) {
        toast.success("consultations has been deleted successfull");
      } else {
        toast.error("Failed to delete consultation.");
      }
    } catch (error: any) {
      if (
        deleteError &&
        "data" in deleteError &&
        typeof deleteError.data === "object" &&
        deleteError.data !== null &&
        "message" in deleteError.data
      ) {
        toast.error((deleteError.data as { message?: string }).message);
      }
    }
  };

  const handleStatusChange = async (status: string, id: string) => {
    const updateData = {
      status: status,
    };
    try {
      const response = await updateConsultationFn({ updateData, id });
      if (response.data.success === true) {
        toast.success("consultations has been updated successfully");
      } else {
        toast.error("Failed to update consultation.");
      }
    } catch (error: any) {
      if (
        consultationError &&
        "data" in consultationError &&
        typeof consultationError.data === "object" &&
        consultationError.data !== null &&
        "message" in consultationError.data
      ) {
        toast.error((consultationError.data as { message?: string }).message);
      }
    }
  };

  const [loading, setLoading] = useState(false);

  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = async () => {
    setLoading(true);
    if (printRef.current) {
      const printContents = printRef.current.innerHTML;
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
    }
    setLoading(false);
  };

  return (
    <>
      <div ref={printRef} className="p-4 md:p-6 bg-white rounded-lg shadow-md">
        <ToastContainer />
        <div className="flex flex-row items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Consultation Management
          </h2>
          <Link
            href={"/admin/consultation/time-manage"}
            className="bg-[#6E498B] rounded-md py-2 px-4 text-white shadow hover:bg-[#4ea172]"
          >
            Time Manage
          </Link>
        </div>
        <div className="overflow-x-auto">
          {isLoading ? (
            <CustomeLoader message="Loading consultations, please wait..." />
          ) : consultationsList.length === 0 ? (
            <div className="rounded-xl border border-[#E8ECF4] bg-gradient-to-br from-white via-[#F7F9FC] to-[#EEF3FB] p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#4F46E5] shadow-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 9h16.5m-16.5 0a2.25 2.25 0 0 1 2.25-2.25h12.75a2.25 2.25 0 0 1 2.25 2.25m-16.5 0v7.5A2.25 2.25 0 0 0 6 18.75h12a2.25 2.25 0 0 0 2.25-2.25V9m-9 4.5h3.75M9 13.5h.008v.008H9z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-[#1E1F2D] font-semibold">
                    No consultations found
                  </p>
                  <p className="text-sm text-[#6B7280]">
                    New consultation requests will appear here automatically.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-2 py-3.5 text-start text-sm font-medium text-gray-500"
                  >
                    ID
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3.5 text-start text-sm font-medium text-gray-500"
                  >
                    User Name
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3.5 text-start text-sm font-medium text-gray-500"
                  >
                    Phone Number
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3.5 text-start text-sm font-medium text-gray-500"
                  >
                    Type
                  </th>

                  <th
                    scope="col"
                    className="px-2 py-3.5 text-start text-sm font-medium text-gray-500"
                  >
                    Date & Time
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3.5 text-center text-sm font-medium text-gray-500 w-[15%]"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {consultationsList.map((consultation: any) => (
                  <tr key={consultation.id}>
                    <td className="whitespace-nowrap py-3 text-sm text-[#3F3D56] font-[500]">
                      {consultation.id}
                    </td>
                    <td className="whitespace-nowrap py-2 text-sm text-gray-500 flex gap-2 items-center">
                      <div className="text-[#3F3D56] font-[500]">
                        {consultation.user?.fullName}
                      </div>
                    </td>
                    <td className="whitespace-nowrap py-3 text-sm text-[#3F3D56] font-[500]">
                      {consultation?.user?.phoneNo}
                    </td>
                    <td className="whitespace-nowrap  py-3 text-sm text-[#3F3D56] font-[500]">
                      {consultation.type}
                    </td>
                    <td className="whitespace-nowrap py-3 text-sm text-[#3F3D56] font-[500]">
                      {consultation.schedule
                        ? new Date(consultation.createdAt).toLocaleDateString(
                            "en-LB",
                            {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            }
                          )
                        : "23/12/2024"}{" "}
                      {consultation?.time}
                    </td>
                    <td className="whitespace-nowrap  py-3 text-sm text-gray-500 flex justify-center items-center gap-4">
                      <select
                        defaultValue={consultation.status}
                        onChange={(e) =>
                          handleStatusChange(e.target.value, consultation.id)
                        }
                        className="cursor-pointer inline-flex gap-2 items-center justify-center rounded-md border border-gray-300 bg-[#FFF7E8] px-2.5 py-2.5 font-medium text-[#63B883] shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                      </select>
                      <div className="relative inline-block text-left">
                        <button
                          onClick={() => handleDelete(consultation?.id)}
                          type="button"
                          className="inline-flex gap-1 items-center justify-center rounded-md border border-transparent bg-[#FFEDED] px-2.5 py-2.5 text-xs font-medium text-[#FE4D4F] shadow-sm hover:bg-red-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                          aria-controls={`alert-dialog-content-${consultation.id}`}
                          aria-describedby={`alert-dialog-description-${consultation.id}`}
                        >
                          <Trash size={20} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <div className="flex justify-end mt-4 space-x-2">
        <button
          onClick={() => handlePrint()}
          className="border px-1 py-2 rounded-md bg-[#9473ad] hover:bg-[#71518a] text-white cursor-pointer"
        >
          {loading ? "Downloading..." : "Download PDF"}
        </button>
        {/* Previous button */}
        <button
          onClick={() => page > 1 && setPage(page - 1)}
          disabled={page === 1}
          className={`inline-flex items-center justify-center rounded-md border border-gray-300 bg-[#63B88333] px-2.5 py-1.5 text-xs font-medium ${
            page === 1
              ? "text-gray-400 cursor-not-allowed"
              : "text-[#63B883] hover:bg-gray-50"
          } shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Page buttons */}
        {[page, page + 1, page + 2].map((pg) =>
          pg <= totalPages ? (
            <button
              key={pg}
              onClick={() => setPage(pg)}
              className={`inline-flex items-center justify-center rounded-md border border-gray-300 px-3 py-2 text-xs font-medium shadow-sm ${
                pg === page
                  ? "bg-[#63B883] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
            >
              {pg}
            </button>
          ) : null
        )}

        {/* Ellipsis */}
        {page + 3 < totalPages && (
          <span className="inline-flex items-center justify-center px-3 py-2 text-xs font-medium text-gray-500">
            ...
          </span>
        )}

        {/* Last Page */}
        {page !== totalPages && (
          <button
            onClick={() => setPage(totalPages)}
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {totalPages}
          </button>
        )}

        {/* Next button */}
        <button
          onClick={() => page < totalPages && setPage(page + 1)}
          disabled={page === totalPages}
          className={`inline-flex items-center justify-center rounded-md border border-gray-300 bg-[#63B88333] px-2.5 py-1.5 text-xs font-medium ${
            page === totalPages
              ? "text-gray-400 cursor-not-allowed"
              : "text-[#63B883] hover:bg-gray-50"
          } shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </>
  );
};

export default ConsultationManage;
