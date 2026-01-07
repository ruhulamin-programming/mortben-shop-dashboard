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
  const totalPages = cities?.result?.totalPages;
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
      <div ref={printRef} className="p-4 md:p-6 bg-white rounded-lg shadow-md">
        <ToastContainer />
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            City Management
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#6E498B] rounded-md shadow hover:bg-[#4ea172]"
          >
            <Plus size={18} /> Add City
          </button>
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-[90%] h-[25%] max-w-md shadow-lg">
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
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCity}
                  className="px-4 py-2 bg-[#63B883] text-white rounded-md hover:bg-[#4ea172]"
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
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-2 py-3.5 text-start text-sm font-medium text-gray-500"
                  >
                    SL
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3.5 text-start text-sm font-medium text-gray-500"
                  >
                    City
                  </th>

                  <th
                    scope="col"
                    className="px-2 py-3.5 text-start text-sm font-medium text-gray-500"
                  >
                    Create Time
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3.5 text-center text-sm font-medium text-gray-500 w-[15%]"
                  >
                    User Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {cities?.result?.cities.map((city: any, index: number) => (
                  <tr key={city.id}>
                    <td className="whitespace-nowrap py-3 text-sm text-[#3F3D56] font-[500]">
                      {index + 1}
                    </td>
                    <td className="whitespace-nowrap py-3 text-sm text-[#3F3D56] font-[500]">
                      {city.city}
                    </td>
                    <td className="whitespace-nowrap py-3 text-sm text-[#3F3D56] font-[500]">
                      {city.createdAt
                        ? new Date(city.createdAt).toDateString()
                        : "Mon Jun 16 2025"}{" "}
                    </td>
                    <td className="whitespace-nowrap  py-3 text-sm text-gray-500 flex justify-center items-center gap-4">
                      <select
                        defaultValue={
                          city.isAvailable ? "Available" : "Unavailable"
                        }
                        onChange={(e) =>
                          handleStatusChange(e.target.value, city.id)
                        }
                        className="cursor-pointer inline-flex gap-2 items-center justify-center rounded-md border border-gray-300 bg-[#FFF7E8] px-2.5 py-2.5 font-medium text-[#63B883] shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        <option value="Available">Available</option>
                        <option value="Unavailable">Unavailable</option>
                      </select>

                      <div className="inline-block text-left">
                        <button
                          onClick={() => handleDelete(city?.id)}
                          type="button"
                          className="inline-flex gap-1 items-center justify-center rounded-md border border-transparent bg-[#FFEDED] px-2.5 py-2.5 text-xs font-medium text-[#FE4D4F] shadow-sm hover:bg-red-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                          aria-controls={`alert-dialog-content-${city.id}`}
                          aria-describedby={`alert-dialog-description-${city.id}`}
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

export default CityManagement;
