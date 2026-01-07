import React from "react";
import Image from "next/image";
import { PencilIcon, TrashIcon } from "lucide-react";
import { useDeleteUserMutation, useUsersQuery } from "@/lib/services/userApi";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";

const CustomerTable = () => {
  const { data: users } = useUsersQuery({ page: 1, limit: 3 });
  const [userDeleteFn, { error: deleteError }] = useDeleteUserMutation();

  const handleDelete = async (userId: string, fullName: string) => {
    console.log(fullName);
    try {
      const response = await userDeleteFn(userId);
      console.log(response);
      if (response.data.success === true) {
        toast.success(`${fullName} has been deleted successfull`);
      } else {
        toast.error("Failed to delete user.");
      }
    } catch (error: any) {
      toast.error(
        "Something went wrong or this user already connected to others service"
      );
    }
  };

  return (
    <div className="lg:col-span-2 col-span-3 bg-[#FFFFFF] p-6 rounded-md shadow-md">
      <ToastContainer />
      <h2 className="text-xl font-semibold mb-4">Recent Customers</h2>
      <div className="bg-white rounded-md shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
              >
                Phone Number
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                City
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users?.result?.users.map((customer: any) => (
              <tr key={customer.name}>
                <td className="px-3 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full overflow-hidden">
                      <Image
                        src={customer.profileImage}
                        alt={customer.fullName}
                        width={40}
                        height={40}
                        className="object-cover bg-[#F9F7F9]"
                      />
                    </div>
                    <div className="ml-2">
                      <div className="text-sm font-medium text-gray-900">
                        {customer.fullName}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-4 whitespace-nowrap hidden sm:table-cell">
                  <div className="text-sm text-gray-500">{customer.email}</div>
                </td>
                <td className="px-3 py-4 whitespace-nowrap hidden md:table-cell">
                  <div className="text-sm text-gray-500">
                    {customer.phoneNo}
                  </div>
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{customer.city}</div>
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-start gap-2">
                    <button
                      onClick={() =>
                        handleDelete(customer?.id, customer.fullName)
                      }
                      className="text-red-600 hover:text-red-900 cursor-pointer"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                    <Link
                      href={`/admin/users/${customer.id}`}
                      className="text-green-500 hover:text-green-700"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerTable;
