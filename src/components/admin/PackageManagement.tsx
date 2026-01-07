"use client";
import { Edit, Plus, Trash } from "lucide-react";
import React, { useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import CustomeLoader from "./Loader";
import { useForm } from "react-hook-form";
import {
  useCreatePackageMutation,
  useDeletePackageMutation,
  useGetPackagesQuery,
  useUpdatePackageMutation,
} from "@/lib/services/mealApi";

interface PackageValues {
  id: string;
  packageName: string;
  planName: string;
  price: number;
  calories: number;
  meals: string;
  status: boolean;
}

const PackageManagement = () => {
  const [loading, setLoading] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateModel, setUpdateModal] = useState(false);
  const { data: packages, isLoading } = useGetPackagesQuery("");
  const [packageDeleteFn, { error: deleteError }] = useDeletePackageMutation();
  const [packageUpdateFn, { error: updateError }] = useUpdatePackageMutation();
  const [packageCreateFn, { error: createError }] = useCreatePackageMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<PackageValues>();

  const onSubmit = async (data: PackageValues) => {
    try {
      const response = await packageCreateFn(data);
      if (response.data.success) {
        toast.success("Package created successfully");
        setIsModalOpen(false);
        reset();
      } else {
        toast.error("Failed to create package");
      }
    } catch (error: any) {
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

  const handleUpdate = async (data: PackageValues) => {
    function coerceStatus(raw: unknown): boolean | string | null {
      if (typeof raw === "boolean") return raw;
      if (raw === "true") return true;
      if (raw === "false") return false;
      if (raw === "" || raw == null) return null;
      return raw as string;
    }
    const updatedData = {
      packageName: data.packageName,
      price: Number(data.price),
      calories: Number(data.calories),
      planName: data.planName,
      meals: data.meals,
      status: coerceStatus(data.status),
    };
    const id = data.id;

    try {
      const response = await packageUpdateFn({ updatedData, id });
      if (response.data.success === true) {
        toast.success("Package has been updated successfuly");
        setUpdateModal(false);
      } else {
        toast.error("Failed to update package.");
      }
    } catch (error: any) {
      if (
        updateError &&
        "data" in updateError &&
        typeof updateError.data === "object" &&
        updateError.data !== null &&
        "message" in updateError.data
      ) {
        toast.error((updateError.data as { message?: string }).message);
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await packageDeleteFn(id);
      if (response.data.success === true) {
        toast.success("Package has been deleted successfuly");
      } else {
        toast.error("Failed to delete package.");
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
        <ToastContainer position="bottom-right" />
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Package Management
          </h2>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#6E498B] rounded-md shadow hover:bg-[#4ea172]"
          >
            <Plus size={18} /> Add Package
          </button>
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 bg-opacity-100 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-[90%] max-w-md shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Add New Package</h3>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Balanced
                  </label>
                  <select
                    {...register("planName", {
                      required: "Plan name is required",
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md mb-1"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select Plan
                    </option>
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                  {errors.planName && (
                    <p className="text-red-500 text-sm mb-3">
                      {errors.planName.message}
                    </p>
                  )}
                </div>

                {/* Package Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Package Name
                  </label>
                  <select
                    {...register("packageName", {
                      required: "Package name is required",
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md mb-1"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select Package
                    </option>
                    <option value="Full Package">Full Package</option>
                    <option value="Lunch Package">Lunch Package</option>
                    <option value="Morning Half Board">
                      Morning Half Board
                    </option>
                    <option value="Noon Half Board">Noon Half Board</option>
                  </select>
                  {errors.packageName && (
                    <p className="text-red-500 text-sm mb-3">
                      {errors.packageName.message}
                    </p>
                  )}
                </div>

                {/* Calories */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Calories
                  </label>
                  <input
                    type="number"
                    {...register("calories", {
                      required: "Calories is required",
                      min: {
                        value: 1,
                        message: "Calories must be greater than 0",
                      },
                    })}
                    placeholder="Enter Calories"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md mb-1"
                  />
                  {errors.calories && (
                    <p className="text-red-500 text-sm mb-3">
                      {errors.calories.message}
                    </p>
                  )}
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Price
                  </label>
                  <input
                    type="number"
                    {...register("price", {
                      required: "Price is required",
                      min: {
                        value: 1,
                        message: "Price must be greater than 0",
                      },
                    })}
                    placeholder="Enter Price"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md mb-1"
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm mb-3">
                      {errors.price.message}
                    </p>
                  )}
                </div>

                {/* Meals */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meals*
                  </label>
                  <div className="flex gap-1 mb-3">
                    {["breakfast", "lunch", "snack", "side", "dinner"].map(
                      (meal) => (
                        <button
                          type="button"
                          key={meal}
                          onClick={() => {
                            let updatedMeals: string[] = [];
                            const currentMeals = (watch("meals") || "")
                              .split(", ")
                              .filter(Boolean);
                            if (currentMeals.includes(meal)) {
                              updatedMeals = currentMeals.filter(
                                (m) => m !== meal
                              );
                            } else {
                              updatedMeals = [...currentMeals, meal];
                            }
                            setValue("meals", updatedMeals.join(", "), {
                              shouldValidate: true,
                            });
                          }}
                          className={`px-3 py-2 rounded-md border ${
                            (watch("meals") || "").split(", ").includes(meal)
                              ? "bg-blue-500 text-white border-blue-500"
                              : "bg-white text-gray-700 border-gray-300"
                          }`}
                        >
                          {meal.charAt(0).toUpperCase() + meal.slice(1)}
                        </button>
                      )
                    )}
                  </div>

                  {/* Hidden input for react-hook-form validation */}
                  <input
                    type="hidden"
                    {...register("meals", {
                      required: "Please select at least one meal",
                    })}
                  />

                  {errors.meals && (
                    <p className="text-red-500 text-sm mb-3">
                      {errors.meals.message}
                    </p>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#63B883] text-white rounded-md hover:bg-[#4ea172]"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {updateModel && (
          <div className="fixed inset-0 bg-opacity-100 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-[90%] max-w-md shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Update Package</h3>

              <form onSubmit={handleSubmit(handleUpdate)}>
                {/* Plan */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Balanced
                  </label>
                  <select
                    {...register("planName", {
                      required: "Plan name is required",
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md mb-1"
                    defaultValue={watch("planName") || ""}
                  >
                    <option value="" disabled>
                      Select Plan
                    </option>
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                  {errors.planName && (
                    <p className="text-red-500 text-sm mb-3">
                      {errors.planName.message}
                    </p>
                  )}
                </div>

                {/* calories */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Calories
                  </label>
                  <input
                    type="number"
                    {...register("calories", {
                      required: "Calories is required",
                      min: {
                        value: 1,
                        message: "Calories must be greater than 0",
                      },
                    })}
                    placeholder="Enter Calories"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md mb-1"
                  />
                  {errors.calories && (
                    <p className="text-red-500 text-sm mb-3">
                      {errors.calories.message}
                    </p>
                  )}
                </div>

                {/* Package Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Package Name
                  </label>
                  <select
                    {...register("packageName", {
                      required: "Package name is required",
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md mb-1"
                    defaultValue={watch("packageName") || ""}
                  >
                    <option value="" disabled>
                      Select Package
                    </option>
                    <option value="Full Package">Full Package</option>
                    <option value="Lunch Package">Lunch Package</option>
                    <option value="Morning Half Board">
                      Morning Half Board
                    </option>
                    <option value="Noon Half Board">Noon Half Board</option>
                  </select>
                  {errors.packageName && (
                    <p className="text-red-500 text-sm mb-3">
                      {errors.packageName.message}
                    </p>
                  )}
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Price
                  </label>
                  <input
                    type="number"
                    {...register("price", {
                      required: "Price is required",
                      min: {
                        value: 1,
                        message: "Price must be greater than 0",
                      },
                    })}
                    placeholder="Enter Price"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md mb-1"
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm mb-3">
                      {errors.price.message}
                    </p>
                  )}
                </div>

                {/* Meals (Button Selector) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meals*
                  </label>
                  <div className="flex gap-1 mb-2 flex-wrap">
                    {["breakfast", "lunch", "snack", "side", "dinner"].map(
                      (meal) => (
                        <button
                          type="button"
                          key={meal}
                          onClick={() => {
                            let updatedMeals: string[] = [];
                            const currentMeals = (watch("meals") || "")
                              .split(", ")
                              .filter(Boolean);
                            if (currentMeals.includes(meal)) {
                              updatedMeals = currentMeals.filter(
                                (m) => m !== meal
                              );
                            } else {
                              updatedMeals = [...currentMeals, meal];
                            }
                            setValue("meals", updatedMeals.join(", "), {
                              shouldValidate: true,
                            });
                          }}
                          className={`px-3 py-2 rounded-md border ${
                            (watch("meals") || "").split(", ").includes(meal)
                              ? "bg-blue-500 text-white border-blue-500"
                              : "bg-white text-gray-700 border-gray-300"
                          }`}
                        >
                          {meal.charAt(0).toUpperCase() + meal.slice(1)}
                        </button>
                      )
                    )}
                  </div>

                  {/* Hidden input for react-hook-form validation */}
                  <input
                    type="hidden"
                    {...register("meals", {
                      required: "Please select at least one meal",
                    })}
                  />

                  {errors.meals && (
                    <p className="text-red-500 text-sm mb-3">
                      {errors.meals.message}
                    </p>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    {...register("status")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md mb-1"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setUpdateModal(false)}
                    className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#63B883] text-white rounded-md hover:bg-[#4ea172]"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          {isLoading ? (
            <CustomeLoader message="Loading Packages, please wait..." />
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-2 py-3 text-start text-sm font-medium text-gray-500"
                  >
                    SL
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3.5 text-start text-sm font-medium text-gray-500"
                  >
                    Package Name
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3.5 text-start text-sm font-medium text-gray-500"
                  >
                    Plan
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3.5 text-start text-sm font-medium text-gray-500"
                  >
                    Calories
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3.5 text-start text-sm font-medium text-gray-500"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3.5 text-start text-sm font-medium text-gray-500"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3.5 text-start text-sm font-medium text-gray-500"
                  >
                    Meals
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3.5 text-start text-sm font-medium text-gray-500"
                  >
                    Create Time
                  </th>

                  <th
                    scope="col"
                    className="px-2 py-3.5 text-center text-sm font-medium text-gray-500 w-[15%]"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {packages?.result?.map((pack: any, index: number) => (
                  <tr key={pack.id}>
                    <td className="whitespace-nowrap py-2 text-sm text-[#3F3D56] font-[500]">
                      {index + 1}
                    </td>
                    <td className="whitespace-nowrap py-2 text-sm text-[#3F3D56] font-[500]">
                      {pack.packageName}
                    </td>
                    <td className="whitespace-nowrap py-2 text-sm text-[#3F3D56] font-[500]">
                      {pack.planName}
                    </td>
                    <td className="whitespace-nowrap py-2 text-sm text-[#3F3D56] font-[500]">
                      {pack.calories}
                    </td>
                    <td className="whitespace-nowrap py-2 text-sm text-[#3F3D56] font-[500]">
                      {pack.price}
                    </td>
                    <td className="whitespace-nowrap py-2 text-sm text-[#3F3D56] font-[500]">
                      {pack.status === true ? "Active" : "Inactive"}
                    </td>
                    <td className="whitespace-nowrap py-2 text-sm text-[#3F3D56] font-[500]">
                      {pack.packageName === "Full Package"
                        ? "lunch, breakfast, dinner, 2 snacks, side"
                        : (() => {
                            const meals = [...pack.meals];

                            // Count all snack variants
                            const snackCount = meals.filter(
                              (m) =>
                                m.toLowerCase() === "snack" ||
                                m.toLowerCase() === "snacks"
                            ).length;

                            // Remove snack items
                            const filtered = meals.filter(
                              (m) =>
                                m.toLowerCase() !== "snack" &&
                                m.toLowerCase() !== "snacks"
                            );

                            // Add formatted snack text
                            if (snackCount > 0) {
                              filtered.push(`${snackCount} snacks`);
                            }

                            return filtered.join(", ");
                          })()}
                    </td>

                    <td className="whitespace-nowrap py-2 text-sm text-[#3F3D56] font-[500]">
                      {pack.createdAt
                        ? new Date(pack.createdAt).toLocaleString()
                        : "Mon Jun 16 2025"}{" "}
                    </td>

                    <td className="whitespace-nowrap  py-2 text-sm text-gray-500 flex justify-center items-center gap-4">
                      <button
                        className="cursor-pointer inline-flex gap-2 items-center justify-center rounded-md border border-gray-300 bg-[#FFF7E8] px-2.5 py-2 text-xs font-medium text-[#63B883] shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        onClick={() => {
                          reset({
                            id: pack.id,
                            packageName: pack.packageName,
                            price: pack.price,
                            calories: pack.calories,
                            meals: pack.meals.join(", "),
                            status: pack.status,
                            planName: pack.planName,
                          });
                          setUpdateModal(true);
                        }}
                      >
                        <Edit size={20} /> Edit
                      </button>

                      <div className="inline-block text-left">
                        <button
                          onClick={() => handleDelete(pack?.id)}
                          type="button"
                          className="inline-flex gap-1 items-center justify-center rounded-md border border-transparent bg-[#FFEDED] px-2.5 py-2 text-xs font-medium text-[#FE4D4F] shadow-sm hover:bg-red-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                          aria-controls={`alert-dialog-content-${pack.id}`}
                          aria-describedby={`alert-dialog-description-${pack.id}`}
                        >
                          <Trash size={20} /> Delete
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
      </div>
    </>
  );
};

export default PackageManagement;
