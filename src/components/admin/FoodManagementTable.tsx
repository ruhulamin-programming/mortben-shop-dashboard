"use client";
import {
  useDeleteFoodMutation,
  useGetFoodsQuery,
} from "@/lib/services/foodApi";
import { Edit, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import CustomeLoader from "./Loader";

const FoodManagementTable = () => {
  const [loading, setLoading] = useState(false);

  const printRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const { data: foods, isLoading } = useGetFoodsQuery({ page });
  const totalPages = foods?.result?.totalPages;
  const [foodDeleteFn, { error: deleteError }] = useDeleteFoodMutation();

  const handleDelete = async (foodId: string) => {
    try {
      const response = await foodDeleteFn(foodId);
      if (response.data.success === true) {
        toast.success("food has been deleted successfull");
      } else {
        toast.error("Failed to delete food.");
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
          <h2 className="text-2xl font-semibold text-gray-800">Food List</h2>
          <Link
            href={"/admin/food/add_food"}
            className="bg-[#6E498B] rounded-full py-2 px-4 text-white"
          >
            Add Food
          </Link>
        </div>
        <div className="overflow-x-auto">
          {isLoading ? (
            <CustomeLoader message="Loading foods, please wait..." />
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-2 py-3.5 text-start text-sm font-medium text-gray-500"
                  >
                    Food Name
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3.5 text-start text-sm font-medium text-gray-500"
                  >
                    Description
                  </th>
                  {/* <th
                    scope="col"
                    className="px-2 py-3.5 text-start text-sm font-medium text-gray-500"
                  >
                    Calories
                  </th> */}
                  <th
                    scope="col"
                    className="px-2 py-3.5 text-start text-sm font-medium text-gray-500"
                  >
                    Subtotal
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3.5 text-start text-sm font-medium text-gray-500 w-[10%]"
                  >
                    Extras
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3.5 text-start text-sm font-medium text-gray-500 w-[10%]"
                  >
                    Total
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3.5 text-center text-sm font-medium text-gray-500 w-[15%]"
                  >
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 bg-white">
                {foods?.result?.foods.map((food: any) => (
                  <tr key={food?.id}>
                    <td className="whitespace-nowrap py-2 text-sm text-gray-500 flex gap-2 items-center">
                      <div className="h-8 w-8 rounded-full overflow-hidden">
                        <Image
                          width={20}
                          height={20}
                          className="h-full w-full object-cover"
                          src={food?.foodImage}
                          alt={food?.foodName}
                        />
                      </div>
                      <div className="font-medium text-gray-900">
                        {food?.foodName}
                      </div>
                    </td>
                    <td className="whitespace-nowrap py-3 text-sm text-[#3F3D56] font-[500]">
                      {food?.description.substring(0, 100)}...
                    </td>
                    {/* <td className="whitespace-nowrap py-3 text-sm text-[#3F3D56] font-[500]">
                      {food?.calories}
                    </td> */}
                    <td className="whitespace-nowrap  py-3 text-sm text-[#3F3D56] font-[500]">
                      ${food?.subTotal}
                    </td>
                    <td className="whitespace-nowrap  py-3 text-sm text-[#3F3D56] font-[500]">
                      ${food.extraPrice}
                    </td>
                    <td className="whitespace-nowrap  py-3 text-sm text-[#3F3D56] font-[500]">
                      ${food?.total}
                    </td>
                    <td className="whitespace-nowrap  py-3 text-sm text-gray-500 flex justify-center items-center lg:gap-4 gap-2">
                      <Link href={`/admin/food/${food.id}`}>
                        <button className="cursor-pointer inline-flex lg:gap-2 gap-1 items-center justify-center rounded-md border border-gray-300 bg-[#FFF7E8] lg:px-2.5 lg:py-2.5 text-xs lg:font-medium text-[#63B883] shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                          <Edit size={20} />
                          <p className="hidden lg:flex">Edit</p>
                        </button>
                      </Link>
                      <div className="relative inline-block text-left">
                        <button
                          onClick={() => handleDelete(food.id)}
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

export default FoodManagementTable;
