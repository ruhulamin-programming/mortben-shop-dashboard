"use client";
import { useGetFoodsQuery } from "@/lib/services/foodApi";
import {
  useGeneratedMealDetailsQuery,
  useUpdateGeneratedMealMutation,
  useUpdateMealMutation,
} from "@/lib/services/mealApi";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { IoMdArrowRoundBack } from "react-icons/io";
import { toast, ToastContainer } from "react-toastify";
import Select from "react-select";

interface MealFormValues {
  mealPlan: string;
  planName: string;
  foodName: string;
  foodId: string;
}

const EditGeneratedMealPlan = () => {
  const params = useParams();
  const mealId = params.id;
  const [search, setSearch] = useState("");
  const limit = 10;

  const { data: foods } = useGetFoodsQuery({ limit, search });

  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<MealFormValues>({
    defaultValues: {
      mealPlan: "",
      planName: "",
      foodName: "",
    },
  });

  const { data: meal } = useGeneratedMealDetailsQuery(mealId);
  const [mealUpdateFn, { isLoading }] = useUpdateGeneratedMealMutation();

  useEffect(() => {
    if (meal?.result) {
      reset({
        foodId: meal.result.food?.id || "",
      });
    }
  }, [meal, reset]);

  const onSubmit = async (data: MealFormValues) => {
    const finalData = {
      foodId: data.foodId,
    };
    try {
      const response = await mealUpdateFn({ finalData, mealId });
      if (response.data.success === true) {
        console.log(finalData);
        toast.success("Meal plan has been updated successfully");
      } else {
        toast.error("Failed to update meal plan.");
      }
    } catch (error: any) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="flex justify-start">
      <ToastContainer />
      <div className="lg:w-2/3 w-full lg:px-20 p-2 lg:py-8 bg-white rounded-lg shadow-md">
        <h2 className="flex items-center gap-2 text-2xl font-semibold text-gray-800 mb-6">
          <Link href={"/admin/plans"}>
            <IoMdArrowRoundBack />
          </Link>
          Edit Generated Meal Plan
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="lg:flex gap-4">
            <div className="lg:w-1/2">
              <label
                htmlFor="mealPlan"
                className="block text-sm font-medium text-gray-700"
              >
                Meal Plan
              </label>
              <div className="mt-1">
                <input
                  id="mealPlan"
                  type="text"
                  disabled
                  placeholder="Enter Meal Name"
                  defaultValue={meal?.result?.mealPlan}
                  className={`w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.mealPlan ? "border-red-500 focus:ring-red-500" : ""
                  }`}
                />
              </div>
            </div>
            <div className="lg:w-1/2">
              <label
                htmlFor="planName"
                className="block text-sm font-medium text-gray-700"
              >
                Plan Name
              </label>
              <div className="mt-1">
                <input
                  id="planName"
                  disabled
                  type="text"
                  defaultValue={meal?.result?.planName}
                  className={`w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.planName ? "border-red-500 focus:ring-red-500" : ""
                  }`}
                />
              </div>
            </div>
          </div>
          <div className="lg:flex gap-4">
            <div className="lg:w-full">
              <label
                htmlFor="foodName"
                className="block text-sm font-medium text-gray-700"
              >
                Food Name
              </label>
              <div className="mt-1">
                <input
                  id="foodName"
                  type="text"
                  disabled
                  placeholder="Enter Food Name"
                  defaultValue={meal?.result?.food?.foodName}
                  className={`w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>

              {/* ✅ Food Image */}
              {meal?.result?.food?.foodImage && (
                <div className="mt-3">
                  <img
                    src={meal.result.food.foodImage}
                    alt={meal.result.food.foodName}
                    className="w-40 h-40 object-cover rounded-md"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="lg:flex gap-4">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700">
                Select Food for Edit
              </label>
              <div className="mt-1">
                {foods?.result?.foods?.length > 0 && (
                  <Controller
                    name="foodId"
                    control={control}
                    rules={{ required: "Food ID is required" }}
                    render={({ field }) => {
                      const options =
                        foods?.result?.foods?.map((food: any) => ({
                          value: food.id,
                          label: food.foodName,
                        })) || [];

                      const selectedOption =
                        options.find(
                          (option: any) => option.value === field.value
                        ) || null;

                      return (
                        <Select
                          options={options}
                          isSearchable
                          placeholder="Search and select food"
                          value={selectedOption} // ✅ show correct selected food
                          onChange={(selected) =>
                            field.onChange(selected?.value)
                          }
                          onBlur={field.onBlur}
                        />
                      );
                    }}
                  />
                )}
              </div>
              {errors.foodId && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.foodId.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Link
              href={"/admin/plans"}
              className="text-center lg:w-1/8 w-full py-2.5 rounded-md bg-[#f53c3c] outline-4 text-white font-semibold hover:bg-[#d17171] focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="lg:w-1/8 w-full py-2.5 rounded-md bg-[#6E498B] text-white font-semibold hover:bg-[#9570b1] focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditGeneratedMealPlan;
