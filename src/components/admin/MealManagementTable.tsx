"use client";
import {
  useDeleteMealMutation,
  useGetMealsQuery,
} from "@/lib/services/mealApi";
import { Edit, Trash } from "lucide-react";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import CustomeLoader from "./Loader";

interface Meals {
  id: string;
  mealName: string;
  mealType: string;
  calories: number;
  status: string;
  food: any;
  availableDateFrom: Date;
}

const MealManagementTable = () => {
  const [page, setPage] = useState(1);
  const { data: meals, isLoading } = useGetMealsQuery({ page });
  const totalPages = meals?.result?.totalPages;
  const [loading, setLoading] = useState(false);

  const printRef = useRef<HTMLDivElement>(null);
  const [deleteMealFn, { error: deleteError }] = useDeleteMealMutation();

  const handleDelete = async (mealId: string) => {
    try {
      const response = await deleteMealFn(mealId);
      if (response.data.success === true) {
        toast.success("meal has been deleted successfull");
      } else {
        toast.error("Failed to delete meal.");
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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Meal Management
          </h2>
          <Link
            href={"/admin/meal/add_meal"}
            className="bg-[#6E498B] rounded-full py-2 px-4 text-white"
          >
            Add Meal
          </Link>
        </div>
        <div className="overflow-x-auto">
          {isLoading ? (
            <CustomeLoader message="Loading Meals, please wait..." />
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="lg:px-2 py-3.5 text-start text-sm font-medium text-gray-500"
                  >
                    Meal Name
                  </th>
                  <th
                    scope="col"
                    className="lg:px-2 py-3.5 text-start text-sm font-medium text-gray-500"
                  >
                    Food Name
                  </th>
                  <th
                    scope="col"
                    className="lg:px-2 py-3.5 text-start text-sm font-medium text-gray-500"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className="lg:px-2 py-3.5 text-start text-sm font-medium text-gray-500"
                  >
                    Calories
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3.5 text-start text-sm font-medium text-gray-500 w-[15%]"
                  >
                    Available From
                  </th>
                  <th
                    scope="col"
                    className="lg:px-2 py-3.5 text-center text-sm font-medium text-gray-500 w-[15%]"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {meals?.result?.meals.map((meal: Meals) => (
                  <tr key={meal.id}>
                    <td className="whitespace-nowrap py-3 text-sm text-[#3F3D56] lg:font-[500]">
                      {meal.mealName}
                    </td>
                    <td className="whitespace-nowrap py-3 text-sm text-[#3F3D56] lg:font-[500]">
                      {meal.food?.foodName}
                    </td>
                    <td className="whitespace-nowrap  py-3 text-sm text-[#3F3D56] lg:font-[500]">
                      {meal.mealType}
                    </td>
                    <td className="whitespace-nowrap  py-3 text-sm text-[#3F3D56] lg:font-[500]">
                      {meal.calories}
                    </td>
                    <td className="whitespace-nowrap  py-3 text-sm text-[#3F3D56] lg:font-[500]">
                      {meal?.availableDateFrom
                        ? new Date(meal.availableDateFrom).toLocaleString()
                        : ""}
                    </td>
                    <td className="whitespace-nowrap  py-3 text-sm text-gray-500 flex justify-center items-center lg:gap-4 gap-2">
                      <Link href={`/admin/meal/${meal.id}`}>
                        <button className="cursor-pointer inline-flex lg:gap-2 gap-1 items-center justify-center rounded-md border border-gray-300 bg-[#FFF7E8] lg:px-2.5 lg:py-2.5 text-xs lg:font-medium text-[#63B883] shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                          <Edit size={20} />{" "}
                          <p className="hidden lg:flex">Edit</p>
                        </button>
                      </Link>
                      <div className="relative inline-block text-left">
                        <button
                          onClick={() => handleDelete(meal.id)}
                          type="button"
                          className="inline-flex gap-1 items-center justify-center rounded-md border border-transparent bg-[#FFEDED] lg:px-2.5 lg:py-2.5  text-xs font-medium text-[#FE4D4F] shadow-sm hover:bg-red-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                          <Trash size={20} />
                          <p className="hidden lg:flex">Delete</p>
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
          {loading ? "Exporting..." : "Export PDF"}
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

export default MealManagementTable;
