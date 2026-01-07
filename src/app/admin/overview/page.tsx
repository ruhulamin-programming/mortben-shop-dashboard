"use client";

import CustomerTable from "@/components/admin/CustomerTable";
import OrderChart from "@/components/admin/OrderChart";
import OrderList from "@/components/admin/OrderList";
import TotalRevenueChart from "@/components/admin/RevenuChart";
import { CircleDollarSign, ListOrdered, ShoppingCart } from "lucide-react";
import React from "react";
import { BsPersonFillCheck } from "react-icons/bs";

const stats = [
  {
    label: "Total Revenue",
    value: "1,234",
    increment: "10",
    today: "150",
    icon: <CircleDollarSign color="#63B883" />,
  },
  {
    label: "Active Subscriptions",
    value: "876",
    increment: "10",
    today: "150",
    icon: <BsPersonFillCheck size={24} color="#2D99FE" />,
  },
  {
    label: "Total Delivery",
    value: "$12,450",
    increment: "10",
    today: "150",
    icon: <ShoppingCart color="#FC9736" />,
  },
  {
    label: "Active Orders",
    value: "23",
    increment: "10",
    today: "150",
    icon: <ListOrdered color="#F06899" />,
  },
];

const OverViewPage = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 lg:gap-14 gap-4 items-center">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`rounded-xl p-6 shadow-md bg-[#FFFFFF] transition hover:scale-[1.02]`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-[#7C8091]">
                  {stat.label}
                </p>
                <h2 className="text-2xl font-bold mt-2 text-[#3F3D56]">
                  {stat.value}
                </h2>
              </div>
              <p>{stat.icon}</p>
            </div>
            {/* <div className="flex gap-6 mt-4">
              <p className="text-[#63B883]">
                <span>{stat.increment}%</span>
              </p>
              <p className="text-[#7C8091]">+${stat.today} today</p>
            </div> */}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 lg:gap-6 gap-2 lg:mt-10 mt-4">
        <div className="lg:col-span-2 col-span-3">
          <TotalRevenueChart />
        </div>
        <div className="lg:col-span-1 col-span-3 bg-[#FFFFFF] p-4 rounded-md overflow-y-auto h-100 custom-scrollbar">
          <OrderList />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-6 mt-10">
        <CustomerTable />
        <OrderChart />
      </div>
    </>
  );
};

export default OverViewPage;
