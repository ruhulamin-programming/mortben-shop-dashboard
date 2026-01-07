"use client";
import { Plus, Trash } from "lucide-react";
import React, { useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import CustomeLoader from "./Loader";
import {
  useCreateCaloriesMutation,
  useDeleteCaloriesMutation,
  useGetCaloriesQuery,
} from "@/lib/services/mealApi";

const CaloriesManagement = () => {
  const [loading, setLoading] = useState(false);

  const printRef = useRef<HTMLDivElement>(null);
  const [calories, setCalories] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: caloriesData, isLoading } = useGetCaloriesQuery("");
  const [caloriesDeleteFn, { error: deleteError }] =
    useDeleteCaloriesMutation();
  const [createCaloriesFn, { error: createError }] =
    useCreateCaloriesMutation();

  const handleDelete = async (id: string) => {
    try {
      const response = await caloriesDeleteFn(id);
      if (response.data.success === true) {
        toast.success("Calories has been deleted successfull");
      } else {
        toast.error("Failed to calories calories.");
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

  const handleCreateCalories = async () => {
    if (!calories) {
      toast.error("Calories is required!");
      return;
    }

    try {
      const response = await createCaloriesFn({ calories: calories });
      if (response.data.success === true) {
        toast.success("Calories added successfully");
        setCalories("");
        setIsModalOpen(false);
      } else {
        toast.error("Failed to create calories");
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
        <ToastContainer position="bottom-right" />
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Calories Management
          </h2>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#6E498B] rounded-md shadow hover:bg-[#4ea172]"
          >
            <Plus size={18} /> Add Calories
          </button>
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 bg-opacalories-50 z-75 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-[90%] h-[25%] max-w-md shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Add New Calories</h3>
              <input
                type="number"
                value={calories}
                autoFocus
                onChange={(e) => setCalories(e.target.value)}
                placeholder="Enter Calories"
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
                  onClick={handleCreateCalories}
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
            <CustomeLoader message="Loading calories, please wait..." />
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
                    Calories
                  </th>

                  <th
                    scope="col"
                    className="px-2 py-3.5 text-start text-sm font-medium text-gray-500"
                  >
                    Create Time
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3.5 text-start text-sm font-medium text-gray-500"
                  >
                    Update Time
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3.5 text-center text-sm font-medium text-gray-500 w-[15%]"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {caloriesData?.result?.map((calories: any, index: number) => (
                  <tr key={calories.id}>
                    <td className="whitespace-nowrap py-3 text-sm text-[#3F3D56] font-[500]">
                      {index + 1}
                    </td>
                    <td className="whitespace-nowrap py-3 text-sm text-[#3F3D56] font-[500]">
                      {calories.calories}
                    </td>
                    <td className="whitespace-nowrap py-3 text-sm text-[#3F3D56] font-[500]">
                      {calories.createdAt
                        ? new Date(calories.createdAt).toLocaleString()
                        : "Mon Jun 16 2025"}{" "}
                    </td>
                    <td className="whitespace-nowrap py-3 text-sm text-[#3F3D56] font-[500]">
                      {calories.updatedAt
                        ? new Date(calories.createdAt).toLocaleString()
                        : "Mon Jun 16 2025"}{" "}
                    </td>
                    <td className="whitespace-nowrap  py-3 text-sm text-gray-500 flex justify-center items-center gap-4">
                      <div className="relative inline-block text-left">
                        <button
                          onClick={() => handleDelete(calories?.id)}
                          type="button"
                          className="inline-flex gap-1 items-center justify-center rounded-md border border-transparent bg-[#FFEDED] px-2.5 py-2.5 text-xs font-medium text-[#FE4D4F] shadow-sm hover:bg-red-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                          aria-controls={`alert-dialog-content-${calories.id}`}
                          aria-describedby={`alert-dialog-description-${calories.id}`}
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
      </div>
    </>
  );
};

export default CaloriesManagement;
