"use client";
import { useAllCitiesQuery } from "@/lib/services/citiesApi";
import { useUpdateUserMutation, useUserQuery } from "@/lib/services/userApi";
import { Info } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";

// Define the type for the form data
interface UserFormValue {
  fullName: string;
  email: string;
  gender: string;
  dob: string;
  city: string;
  address: string;
  phoneNo: string;
  bio: string;
  profileImage: string;
}

const UserProfile = () => {
  const params = useParams();
  const userId = params.id;

  // Initialize the form using useForm
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<UserFormValue>({
    defaultValues: {
      fullName: "",
      email: "",
      gender: "",
      phoneNo: "",
      dob: "",
      city: "",
      address: "",
      bio: "",
    },
  });

  const { data: userInfo, isLoading } = useUserQuery(params.id);
  const [updateUser, { isLoading: isUpdating, error }] =
    useUpdateUserMutation();
  const { data: cities } = useAllCitiesQuery({ page: 1, limit: 200 });

  useEffect(() => {
    if (userInfo?.result) {
      reset({
        fullName: userInfo.result.fullName || "",
        email: userInfo.result.email || "",
        gender: userInfo.result.gender || "",
        dob: userInfo.result.dob || "",
        city: userInfo.result.city || "",
        address: userInfo.result.address || "",
        bio: userInfo.result.bio || "",
        phoneNo: userInfo.result.phoneNo || "",
      });
    }
  }, [userInfo, reset, setValue]);

  if (isLoading) return <p>Loading...</p>;

  const onSubmit = async (data: UserFormValue) => {
    try {
      const response = await updateUser({ data, userId });
      console.log(response);
      if (response.data.success === true) {
        toast.success(response.data.message);
      } else {
        toast.error("Failed to update profile.");
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
          User Profile Information
          <Info />
        </h2>
        <div className="relative mb-4">
          <label
            htmlFor="profileImage"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            User Photo
          </label>
          <Image
            alt="photo"
            src={userInfo?.result?.profileImage}
            width={100}
            height={100}
            className="rounded-md"
          />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700"
            >
              Display Name
            </label>
            <div className="mt-1">
              <input
                id="fullName"
                type="text"
                placeholder="User Name"
                {...register("fullName", {
                  required: "Full name is required",
                })}
                className={`w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.fullName ? "border-red-500 focus:ring-red-500" : ""
                }`}
              />
            </div>
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.fullName.message}
              </p>
            )}
          </div>
          <div className="flex gap-4">
            <div className="w-1/2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  placeholder="Email"
                  {...register("email")}
                  className={`w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? "border-red-500 focus:ring-red-500" : ""
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="w-1/2">
              <label
                htmlFor="phoneNo"
                className="block text-sm font-medium text-gray-700"
              >
                Phone No
              </label>
              <div className="mt-1">
                <input
                  readOnly
                  id="phoneNo"
                  type="phoneNo"
                  placeholder="Phone No"
                  {...register("phoneNo")}
                  className={`w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.phoneNo ? "border-red-500 focus:ring-red-500" : ""
                  }`}
                />
              </div>
              {errors.phoneNo && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phoneNo.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-1/2">
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-700"
              >
                Gender
              </label>
              <div className="mt-1">
                <select
                  id="gender"
                  {...register("gender")}
                  className={`w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.gender ? "border-red-500 focus:ring-red-500" : ""
                  }`}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              {errors.gender && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.gender.message}
                </p>
              )}
            </div>

            <div className="w-1/2">
              <label
                htmlFor="dob"
                className="block text-sm font-medium text-gray-700"
              >
                Date of Birth
              </label>
              <div className="mt-1">
                <input
                  id="dob"
                  type="dob"
                  placeholder="Date of Birth"
                  {...register("dob")}
                  className={`w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.dob ? "border-red-500 focus:ring-red-500" : ""
                  }`}
                />
              </div>
              {errors.dob && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.dob.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-1/2">
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700"
              >
                City
              </label>
              <div className="mt-1">
                <select
                  id="city"
                  defaultValue={userInfo?.city}
                  {...register("city", {
                    required: "City is required",
                  })}
                  className={`w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.city ? "border-red-500 focus:ring-red-500" : ""
                  }`}
                >
                  <option value={userInfo?.result.city}>
                    Current City: {userInfo?.result.city}
                  </option>
                  {cities?.result?.cities?.map((city: any) => (
                    <option key={city.id} value={city.city}>
                      {city.city}
                    </option>
                  ))}
                </select>
              </div>
              {errors.city && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.city.message}
                </p>
              )}
            </div>
            <div className="w-1/2">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Address
              </label>
              <div className="mt-1">
                <input
                  id="address"
                  type="text"
                  placeholder="Address"
                  {...register("address", {
                    required: "Date of birth is required",
                  })}
                  className={`w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.dob ? "border-red-500 focus:ring-red-500" : ""
                  }`}
                />
              </div>
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-700"
            >
              Bio
            </label>
            <div className="mt-1">
              <textarea
                id="bio"
                placeholder="Enter Your Bio"
                {...register("bio")}
                className={`w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.bio ? "border-red-500 focus:ring-red-500" : ""
                }`}
              />
            </div>
            {errors.bio && (
              <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="cursor-pointer lg:w-1/6 w-full py-2.5 rounded-md bg-green-500 text-white font-semibold hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            {isUpdating ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
