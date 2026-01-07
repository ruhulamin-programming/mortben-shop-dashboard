import { useGetOrdersQuery } from "@/lib/services/orderApi";
import React from "react";

const OrderList = () => {
  const { data: ordersList } = useGetOrdersQuery({ page: 1, limit: 5 });

  return (
    <div>
      <p className="text-[#3F3D56] font-bold mb-4">Order List</p>
      {ordersList?.result?.orders.map((order: any) => (
        <div className="flex justify-between mb-4 items-center" key={order.id}>
          <div className="flex items-center gap-4">
            <div>
              <p>{order.package.packageName}</p>
              <p>Price: {order.package.price}</p>
            </div>
          </div>
          <p className="bg-[#63B883] p-2 rounded-md text-white">
            {order.status}
          </p>
        </div>
      ))}
    </div>
  );
};

export default OrderList;
