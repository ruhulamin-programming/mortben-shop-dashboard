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
  const caloriesList = caloriesData?.result ?? [];
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
      <div
        ref={printRef}
        className="p-4 md:p-6 mt-4 rounded-2xl shadow-md bg-gradient-to-br from-[#F8FAFF] via-white to-[#F1F5FF]"
      >
        <ToastContainer position="bottom-right" />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-[#1E1F2D]">
              Calories Management
            </h2>
            <p className="text-sm text-[#6B7280]">
              Maintain calorie presets, print records, and keep the list clean.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handlePrint()}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#6E498B] rounded-lg shadow hover:bg-[#4ea172]"
            >
              Download
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#6E498B] rounded-lg shadow hover:bg-[#4ea172]"
            >
              <Plus size={18} /> Add Calories
            </button>
          </div>
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center px-4">
            <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl border border-[#E8ECF4]">
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
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCalories}
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
            <CustomeLoader message="Loading calories, please wait..." />
          ) : caloriesList.length === 0 ? (
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
                    No calories found
                  </p>
                  <p className="text-sm text-[#6B7280]">
                    Add a calorie preset to start building your meal offerings.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {caloriesList.map((item: any, index: number) => (
                <div
                  key={item.id}
                  className="flex h-full flex-col rounded-xl border border-[#E8ECF4] bg-gradient-to-br from-white via-[#F9FAFB] to-[#F3F6FF] p-4 shadow-sm ring-1 ring-[#EEF1F7] transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-[#1E1F2D]">
                        {item.calories} kcal
                      </p>
                      <p className="text-xs text-[#6B7280]">
                        Added{" "}
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString()
                          : "-"}
                      </p>
                    </div>
                    <span className="rounded-full bg-[#E6F7EE] px-2.5 py-1 text-[11px] font-semibold text-[#2F9E61]">
                      Preset
                    </span>
                  </div>

                  <div className="mb-3 rounded-lg bg-white/70 px-3 py-2 text-sm text-[#1E1F2D] shadow-inner">
                    <p className="text-[11px] uppercase tracking-wide text-[#6B7280]">
                      Last Update
                    </p>
                    <p className="font-semibold">
                      {item.updatedAt
                        ? new Date(item.updatedAt).toLocaleDateString()
                        : "-"}
                    </p>
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-2">
                    <span className="rounded-md bg-white px-3 py-2 text-xs font-medium text-[#6B7280] shadow-inner">
                      #{index + 1}
                    </span>
                    <button
                      onClick={() => handleDelete(item?.id)}
                      type="button"
                      className="inline-flex gap-1 items-center justify-center rounded-md border border-transparent bg-[#FFEDED] px-3 py-2 text-xs font-medium text-[#FE4D4F] shadow-sm hover:bg-red-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition"
                      aria-controls={`alert-dialog-content-${item.id}`}
                      aria-describedby={`alert-dialog-description-${item.id}`}
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
    </>
  );
};

export default CaloriesManagement;
