import React from "react";

interface CustomerReport {
  id: string;
  date: string;
  usersOrdered: number;
  mealsOrdered: number;
  cash: number;
  bankTransfer: number;
}

const users: CustomerReport[] = [
  {
    id: "1",
    date: "April 1, 2025",
    usersOrdered: 25,
    mealsOrdered: 60,
    cash: 120,
    bankTransfer: 80,
  },
  {
    id: "2",
    date: "April 2, 2025",
    usersOrdered: 30,
    mealsOrdered: 75,
    cash: 150,
    bankTransfer: 100,
  },
  {
    id: "3",
    date: "April 3, 2025",
    usersOrdered: 20,
    mealsOrdered: 50,
    cash: 100,
    bankTransfer: 70,
  },
  {
    id: "4",
    date: "April 4, 2025",
    usersOrdered: 40,
    mealsOrdered: 100,
    cash: 200,
    bankTransfer: 150,
  },
  {
    id: "5",
    date: "April 5, 2025",
    usersOrdered: 35,
    mealsOrdered: 85,
    cash: 170,
    bankTransfer: 120,
  },
  {
    id: "6",
    date: "April 6, 2025",
    usersOrdered: 15,
    mealsOrdered: 40,
    cash: 80,
    bankTransfer: 50,
  },
  {
    id: "7",
    date: "April 7, 2025",
    usersOrdered: 50,
    mealsOrdered: 120,
    cash: 250,
    bankTransfer: 180,
  },
  {
    id: "8",
    date: "April 8, 2025",
    usersOrdered: 28,
    mealsOrdered: 70,
    cash: 140,
    bankTransfer: 90,
  },
  {
    id: "9",
    date: "April 9, 2025",
    usersOrdered: 42,
    mealsOrdered: 105,
    cash: 210,
    bankTransfer: 160,
  },
  {
    id: "10",
    date: "April 10, 2025",
    usersOrdered: 32,
    mealsOrdered: 80,
    cash: 160,
    bankTransfer: 110,
  },
  {
    id: "10",
    date: "April 10, 2025",
    usersOrdered: 32,
    mealsOrdered: 80,
    cash: 160,
    bankTransfer: 110,
  },
  {
    id: "10",
    date: "April 10, 2025",
    usersOrdered: 32,
    mealsOrdered: 80,
    cash: 160,
    bankTransfer: 110,
  },
  {
    id: "10",
    date: "April 10, 2025",
    usersOrdered: 32,
    mealsOrdered: 80,
    cash: 160,
    bankTransfer: 110,
  },
];

const CustomerReport = () => {
  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Customer Report
      </h2>
      <div className="overflow-x-auto">
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
                Date
              </th>
              <th
                scope="col"
                className="px-2 py-3.5 text-start text-sm font-medium text-gray-500"
              >
                Users Ordered
              </th>
              <th
                scope="col"
                className="px-2 py-3.5 text-start text-sm font-medium text-gray-500"
              >
                Meals Ordered
              </th>
              <th
                scope="col"
                className="px-2 py-3.5 text-start text-sm font-medium text-gray-500"
              >
                Cash
              </th>
              <th
                scope="col"
                className="px-2 py-3.5 text-start text-sm font-medium text-gray-500 w-[12%]"
              >
                Bank Transfer
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {users.map((user, index) => (
              <tr key={user.id}>
                <td className="whitespace-nowrap py-4 text-sm text-[#3F3D56] font-[500]">
                  {index + 1}
                </td>
                <td className="whitespace-nowrap py-4 text-sm text-[#3F3D56] font-[500]">
                  {user.date}
                </td>
                <td className="whitespace-nowrap py-4 text-sm text-[#3F3D56] font-[500]">
                  {user.usersOrdered} users
                </td>
                <td className="whitespace-nowrap  py-4 text-sm text-[#3F3D56] font-[500]">
                  {user.mealsOrdered} meals
                </td>
                <td className="whitespace-nowrap  py-4 text-sm text-[#3F3D56] font-[500]">
                  ${user.cash}
                </td>
                <td className="whitespace-nowrap  py-4 text-sm text-[#3F3D56] font-[500]">
                  ${user.bankTransfer}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end mt-4 space-x-2">
        <button className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-[#63B88333] px-2.5 py-1.5 text-xs font-medium text-[#63B883] shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
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
        <button className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-[#63B883] focus:ring-offset-2">
          1
        </button>
        <button className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:bg-[#63B883]">
          2
        </button>
        <button className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:bg-[#63B883]">
          3
        </button>
        <span className="inline-flex items-center justify-center px-3 py-2 text-xs font-medium text-gray-500">
          ...
        </span>
        <button className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:bg-[#63B883]">
          440
        </button>
        <button className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-[#63B88333] px-2.5 py-1.5 text-xs font-medium text-[#63B883] shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
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
    </div>
  );
};

export default CustomerReport;
