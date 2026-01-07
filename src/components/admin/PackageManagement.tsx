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

  const groupedPackages = (packages?.result || []).reduce(
    (acc: Record<string, any[]>, pack: any) => {
      const key = pack.packageName || "Other";
      if (!acc[key]) acc[key] = [];
      acc[key].push(pack);
      return acc;
    },
    {}
  );

  const paletteMap: Record<
    string,
    {
      cardBg: string;
      ring: string;
      accentText: string;
      badgeBg: string;
      badgeText: string;
      chipBg: string;
    }
  > = {
    "Full Package": {
      cardBg: "from-emerald-50 via-white to-emerald-100",
      ring: "ring-emerald-100",
      accentText: "text-emerald-700",
      badgeBg: "bg-emerald-100",
      badgeText: "text-emerald-700",
      chipBg: "bg-emerald-50",
    },
    "Lunch Package": {
      cardBg: "from-amber-50 via-white to-amber-100",
      ring: "ring-amber-100",
      accentText: "text-amber-700",
      badgeBg: "bg-amber-100",
      badgeText: "text-amber-700",
      chipBg: "bg-amber-50",
    },
    "Morning Half Board": {
      cardBg: "from-sky-50 via-white to-sky-100",
      ring: "ring-sky-100",
      accentText: "text-sky-700",
      badgeBg: "bg-sky-100",
      badgeText: "text-sky-700",
      chipBg: "bg-sky-50",
    },
    "Noon Half Board": {
      cardBg: "from-rose-50 via-white to-rose-100",
      ring: "ring-rose-100",
      accentText: "text-rose-700",
      badgeBg: "bg-rose-100",
      badgeText: "text-rose-700",
      chipBg: "bg-rose-50",
    },
    Other: {
      cardBg: "from-slate-50 via-white to-slate-100",
      ring: "ring-slate-100",
      accentText: "text-slate-700",
      badgeBg: "bg-slate-100",
      badgeText: "text-slate-700",
      chipBg: "bg-slate-50",
    },
  };

  const formatMeals = (pack: any) => {
    if (pack.packageName === "Full Package") {
      return "lunch, breakfast, dinner, 2 snacks, side";
    }

    const meals = [...pack.meals];
    const snackCount = meals.filter(
      (m: string) => m.toLowerCase() === "snack" || m.toLowerCase() === "snacks"
    ).length;
    const filtered = meals.filter(
      (m: string) => m.toLowerCase() !== "snack" && m.toLowerCase() !== "snacks"
    );
    if (snackCount > 0) filtered.push(`${snackCount} snacks`);
    return filtered.join(", ");
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
          ) : Object.keys(groupedPackages).length === 0 ? (
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
                  <p className="text-[#1E1F2D] font-semibold">
                    No packages found
                  </p>
                  <p className="text-sm text-[#6B7280]">
                    Create your first package to start organizing plans by name.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedPackages).map(([packageName, items]) => (
                <div
                  key={packageName}
                  className="rounded-2xl border border-[#E8ECF4] bg-white p-4 md:p-6 shadow-sm"
                >
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold text-[#1E1F2D]">
                        {packageName}
                      </p>
                    </div>
                    <span className="rounded-full bg-[#63B8831A] px-3 py-1 text-xs font-semibold text-[#63B883]">
                      Organized by package name
                    </span>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {(items as any[]).map((pack: any, index: number) => (
                      <div
                        key={pack.id}
                        className="rounded-xl border border-[#EEF1F7] bg-gradient-to-br from-white via-[#F9FAFB] to-[#F3F6FF] p-4 shadow-sm"
                      >
                        <div className="mb-2 flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold text-[#1E1F2D]">
                              {pack.planName}
                            </p>
                            <p className="text-xs text-[#6B7280]">
                              Created{" "}
                              {pack.createdAt
                                ? new Date(pack.createdAt).toLocaleDateString()
                                : "-"}
                            </p>
                          </div>
                          <span
                            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                              pack.status === true
                                ? "bg-[#E6F7EE] text-[#2F9E61]"
                                : "bg-[#FFEDED] text-[#E34141]"
                            }`}
                          >
                            {pack.status === true ? "Active" : "Inactive"}
                          </span>
                        </div>

                        <div className="mb-3 grid grid-cols-2 gap-2 text-sm text-[#1E1F2D]">
                          <div className="rounded-lg bg-white/80 px-3 py-2 shadow-inner">
                            <p className="text-[11px] uppercase tracking-wide text-[#6B7280]">
                              Calories
                            </p>
                            <p className="font-semibold">{pack.calories}</p>
                          </div>
                          <div className="rounded-lg bg-white/80 px-3 py-2 shadow-inner">
                            <p className="text-[11px] uppercase tracking-wide text-[#6B7280]">
                              Price
                            </p>
                            <p className="font-semibold">{pack.price}</p>
                          </div>
                        </div>

                        <div className="mb-3 rounded-lg bg-white/70 px-3 py-2 text-sm text-[#1E1F2D] shadow-inner">
                          <p className="text-[11px] uppercase tracking-wide text-[#6B7280]">
                            Meals
                          </p>
                          <p className="font-semibold leading-snug">
                            {formatMeals(pack)}
                          </p>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                          <button
                            className="cursor-pointer inline-flex gap-2 items-center justify-center rounded-md border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-[#63B883] shadow-sm hover:-translate-y-0.5 hover:shadow-md transition"
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
                            <Edit size={18} /> Edit
                          </button>

                          <button
                            onClick={() => handleDelete(pack?.id)}
                            type="button"
                            className="inline-flex gap-1 items-center justify-center rounded-md border border-transparent bg-[#FFEDED] px-3 py-2 text-xs font-medium text-[#FE4D4F] shadow-sm hover:bg-red-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition"
                            aria-controls={`alert-dialog-content-${pack.id}`}
                            aria-describedby={`alert-dialog-description-${pack.id}`}
                          >
                            <Trash size={18} /> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
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
