"use client";
import {
  useAllCitiesQuery,
  useCreateCityMutation,
  useDeleteCityMutation,
  useUpdateCityMutation,
} from "@/lib/services/citiesApi";
import { Plus, Trash } from "lucide-react";
import React, { useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import CustomeLoader from "./Loader";

const CityManagement = () => {
  const [page, setPage] = useState(1);
  const [newCity, setNewCity] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: cities, isLoading } = useAllCitiesQuery({ page });
  const citiesList = cities?.result?.cities ?? [];
  const totalPages = cities?.result?.totalPages || 1;
  const [cityDeleteFn, { error: deleteError }] = useDeleteCityMutation();
  const [cityUpdateFn, { error: updateError }] = useUpdateCityMutation();
  const [cityCreate, { error: createError }] = useCreateCityMutation();

  const handleDelete = async (cityId: string) => {
    try {
      const response = await cityDeleteFn(cityId);
      if (response.data.success === true) {
        toast.success("city has been deleted successfull");
      } else {
        toast.error("Failed to delete city.");
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
      isAvailable: status === "Available" ? true : false,
    };
    try {
      const response = await cityUpdateFn({ updateData, id });
      if (response.data.success === true) {
        toast.success("City has been updated successfully");
      } else {
        toast.error("Failed to update city.");
      }
    } catch (error: any) {
      if (
        updateError &&
        "data" in updateError &&
        typeof updateError.data === "object" &&
        updateError.data !== null &&
        "message" in updateError.data
      ) {
        toast.error((updateError.data as { message?: string }).message);
      }
    }
  };

  const handleCreateCity = async () => {
    if (!newCity.trim()) {
      toast.error("City name is required!");
      return;
    }

    try {
      const response = await cityCreate({ city: newCity });
      if (response.data.success === true) {
        toast.success("City created successfully");
        setNewCity("");
        setIsModalOpen(false);
      } else {
        toast.error("Failed to create city");
      }
    } catch {
      if (
        createError &&
        "data" in createError &&
        typeof createError.data === "object" &&
        createError.data !== null &&
        "message" in createError.data
      ) {
        toast.error((createError.data as { message?: string }).message);
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
      <div
        ref={printRef}
        className="p-4 md:p-6 rounded-2xl shadow-md bg-gradient-to-br from-[#F8FAFF] via-white to-[#F1F5FF]"
      >
        <ToastContainer position="bottom-right" />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-[#1E1F2D]">
              City Management
            </h2>
            <p className="text-sm text-[#6B7280]">
              Organize service areas, update availability, and keep records
              printable.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#6E498B] rounded-lg shadow hover:bg-[#4ea172]"
            >
              <Plus size={18} /> Add City
            </button>
          </div>
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center px-4">
            <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl border border-[#E8ECF4]">
              <h3 className="text-lg font-semibold mb-4">Create New City</h3>
              <input
                type="text"
                value={newCity}
                autoFocus
                onChange={(e) => setNewCity(e.target.value)}
                placeholder="Enter city name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCity}
                  className="px-4 py-2 bg-[#63B883] text-white rounded-md shadow hover:bg-[#4ea172]"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          {isLoading ? (
            <CustomeLoader message="Loading cities, please wait..." />
          ) : citiesList.length === 0 ? (
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
                    No cities found
                  </p>
                  <p className="text-sm text-[#6B7280]">
                    Add a city to start managing availability across regions.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {citiesList.map((city: any, index: number) => (
                <div
                  key={city.id}
                  className="flex h-full flex-col rounded-xl border border-[#E8ECF4] bg-gradient-to-br from-white via-[#F9FAFB] to-[#F3F6FF] p-4 shadow-sm ring-1 ring-[#EEF1F7] transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-[#1E1F2D]">
                        {city.city}
                      </p>
                      <p className="text-xs text-[#6B7280]">
                        Added{" "}
                        {city.createdAt
                          ? new Date(city.createdAt).toLocaleDateString()
                          : "-"}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        city.isAvailable
                          ? "bg-[#E6F7EE] text-[#2F9E61]"
                          : "bg-[#FFEDED] text-[#E34141]"
                      }`}
                    >
                      {city.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-2">
                    <select
                      value={city.isAvailable ? "Available" : "Unavailable"}
                      onChange={(e) =>
                        handleStatusChange(e.target.value, city.id)
                      }
                      className="cursor-pointer inline-flex gap-2 items-center justify-center rounded-md border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-[#63B883] shadow-sm hover:-translate-y-0.5 hover:shadow-md transition"
                    >
                      <option value="Available">Available</option>
                      <option value="Unavailable">Unavailable</option>
                    </select>

                    <button
                      onClick={() => handleDelete(city?.id)}
                      type="button"
                      className="inline-flex gap-1 items-center justify-center rounded-md border border-transparent bg-[#FFEDED] px-3 py-2 text-xs font-medium text-[#FE4D4F] shadow-sm hover:bg-red-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition"
                      aria-controls={`alert-dialog-content-${city.id}`}
                      aria-describedby={`alert-dialog-description-${city.id}`}
                    >
                      <Trash size={18} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
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

export default CityManagement;
