"use client";
import {
  useGetOrdersQuery,
  useUpdateOrderMutation,
} from "@/lib/services/orderApi";
import React, { useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import CustomeLoader from "./Loader";

interface order {
  id: string;
  status: string;
  name: string;
  paymentType: string;
  productName: string;
  price: number;
  user: any;
  package: any;
  food: any;
  createdAt: Date;
  mealPlan: string;
}

const OrderManagementTable = () => {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const { data: orders, isLoading: ordersLoading } = useGetOrdersQuery({
    page,
  });
  console.log(orders);
  const totalPages = orders?.result?.totalPages || 1;

  const [orderUpdateFn, { isLoading, error: orderUpdateError }] =
    useUpdateOrderMutation();

  // Track status per order ID
  const [statusMap, setStatusMap] = useState<Record<string, string>>({});

  const handleStatusChange = (orderId: string, status: string) => {
    console.log(status);
    setStatusMap((prev) => ({ ...prev, [orderId]: status }));
  };

  const handleOrderStatus = async (mealId: string) => {
    const selectedStatus = statusMap[mealId];
    if (!selectedStatus) return;
    const updateData = {
      status: selectedStatus,
    };
    try {
      const response = await orderUpdateFn({ updateData, mealId });
      if (response.data.success === true) {
        toast.success("Order has been updated successfully");
      } else {
        toast.error("Failed to update order.");
      }
    } catch (error: any) {
      if (
        orderUpdateError &&
        "data" in orderUpdateError &&
        typeof orderUpdateError.data === "object" &&
        orderUpdateError.data !== null &&
        "message" in orderUpdateError.data
      ) {
        toast.error((error.data as { message?: string }).message);
      }
    }
  };

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
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Order Management
        </h2>
        <ToastContainer />
        <div className="overflow-x-auto">
          {ordersLoading ? (
            <CustomeLoader message="Loading orders, please wait..." />
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 py-3.5 text-start text-sm font-medium text-gray-500">
                    SL
                  </th>
                  <th className="px-2 py-3.5 text-start text-sm font-medium text-gray-500">
                    User Name
                  </th>
                  <th className="px-2 py-3.5 text-start text-sm font-medium text-gray-500">
                    User Location
                  </th>
                  <th className="px-2 py-3.5 text-start text-sm font-medium text-gray-500">
                    Food Name
                  </th>
                  <th className="px-2 py-3.5 text-start text-sm font-medium text-gray-500">
                    Price
                  </th>
                  <th className="px-2 py-3.5 text-start text-sm font-medium text-gray-500">
                    Meal
                  </th>
                  <th className="px-2 py-3.5 text-start text-sm font-medium text-gray-500">
                    Payment Type
                  </th>
                  <th className="px-2 py-3.5 text-start text-sm font-medium text-gray-500">
                    Delivery Date
                  </th>
                  <th className="px-2 py-3.5 text-center text-sm font-medium text-gray-500 w-[15%]">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {orders?.result?.orders.map((order: order, index: number) => {
                  const selectedStatus = statusMap[order.id] || order.status;
                  return (
                    <tr key={order.id}>
                      <td className="whitespace-nowrap py-3 text-sm text-[#3F3D56] font-[500]">
                        {index + 1}
                      </td>
                      <td className="whitespace-nowrap py-3 text-sm text-[#3F3D56] font-[500]">
                        {order.user.fullName ?? "Unknown"}
                      </td>
                      <td className="whitespace-nowrap py-3 text-sm text-[#3F3D56] font-[500]">
                        {order.user.city}, {order.user.address}
                      </td>
                      <td className="whitespace-nowrap py-3 text-sm text-[#3F3D56] font-[500]">
                        {order?.food?.foodName}
                      </td>
                      <td className="whitespace-nowrap py-3 text-sm text-[#3F3D56] font-[500]">
                        {order?.food.total}
                      </td>
                      {/* <td className="whitespace-nowrap py-3 text-sm text-[#3F3D56] font-[500]">
                        {order?.package?.packageName} Package
                      </td> */}
                      <td className="whitespace-nowrap py-3 text-sm text-[#3F3D56] font-[500]">
                        {order.mealPlan}
                      </td>
                      <td className="whitespace-nowrap py-3 text-sm text-[#3F3D56] font-[500]">
                        {order.paymentType === "CASH_ON_DELIVERY"
                          ? "Cash On Delivery"
                          : "Bank Transfer"}
                      </td>
                      <td className="whitespace-nowrap py-3 text-sm text-[#3F3D56] font-[500]">
                        {new Date(order?.createdAt).toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap py-3 text-sm text-gray-500 flex justify-center items-center gap-4">
                        <select
                          value={selectedStatus}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value)
                          }
                          className="border rounded px-2 py-1 text-sm"
                        >
                          <option value="Payment_Completed">
                            Payment Complete
                          </option>
                          <option value="Order_Processing">
                            Order Processing
                          </option>
                          <option value="Delivered">Delivered</option>
                        </select>
                        <button
                          onClick={() => handleOrderStatus(order.id)}
                          className="cursor-pointer inline-flex gap-2 items-center justify-center rounded-md border border-gray-300 bg-[#F0EBF4] px-2.5 py-2 text-xs font-medium text-[#6E498B] shadow-sm hover:bg-gray-50"
                          disabled={isLoading}
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  );
                })}
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

export default OrderManagementTable;
