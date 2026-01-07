import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  TooltipProps,
  ResponsiveContainer,
} from "recharts";

interface OrderData {
  day: string;
  orders: number;
}

const data: OrderData[] = [
  { day: "M", orders: 150 },
  { day: "T", orders: 450 },
  { day: "W", orders: 280 },
  { day: "T", orders: 100 },
  { day: "F", orders: 380 },
  { day: "S", orders: 220 },
  { day: "S", orders: 350 },
];

interface CustomTooltipProps extends TooltipProps<number, string> {
  payload?: { name?: string; value?: number; unit?: string }[];
  label?: string | number;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 rounded shadow-md text-gray-700">
        <p className="font-semibold">{`${payload[0].value} orders`}</p>
        <p className="text-sm">{`Oct ${new Date(
          2025,
          4,
          data.findIndex((item) => item.day === label) + 7
        ).getDate()}th, 2025`}</p>
      </div>
    );
  }

  return null;
};

const OrderChart: React.FC = () => {
  return (
    <div className="lg:col-span-1 col-span-3 bg-[#FFFFFF] rounded-md p-4 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Order Chart</h2>
        <div className="relative inline-block text-left">
          {/* <div>
            <button
              type="button"
              className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              id="menu-button"
              aria-expanded="false"
              aria-haspopup="true"
            >
              This Week
              <svg
                className="-mr-1 h-4 w-4 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0L5.23 8.23a.75.75 0 0 1 .02-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div> */}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="orders" fill="#82ca9d" barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OrderChart;
