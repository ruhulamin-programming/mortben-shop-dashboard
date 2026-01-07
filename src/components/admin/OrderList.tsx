import { useGetOrdersQuery } from "@/lib/services/orderApi";
import React from "react";

const OrderList = () => {
  const { data: ordersList } = useGetOrdersQuery({ page: 1, limit: 5 });
  const orders = ordersList?.result?.orders ?? [];

  return (
    <div>
      <p className="text-[#3F3D56] font-bold mb-4">Order List</p>

      {orders.length === 0 ? (
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
              <p className="text-[#1E1F2D] font-semibold">No orders found</p>
              <p className="text-sm text-[#6B7280]">
                New orders will appear here automatically. You can refresh or
                come back later.
              </p>
            </div>
          </div>
        </div>
      ) : (
        orders.map((order: any) => (
          <div
            className="flex items-center justify-between rounded-lg border border-[#E8ECF4] p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            key={order.id}
          >
            <div className="flex items-center gap-4">
              <div>
                <p className="text-[#1E1F2D] font-semibold">
                  {order.package.packageName}
                </p>
                <p className="text-sm text-[#6B7280]">
                  Price: {order.package.price}
                </p>
              </div>
            </div>
            <p className="rounded-md bg-[#63B883] px-3 py-2 text-sm font-medium text-white">
              {order.status}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderList;
