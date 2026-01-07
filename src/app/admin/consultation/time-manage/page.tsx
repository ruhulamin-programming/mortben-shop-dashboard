"use client";
import React, { useRef, useState } from "react";
import {
  useCreateConsultationTimeMutation,
  useDeleteConsultationTimeMutation,
  useGetConsultationTimeQuery,
} from "@/lib/services/consultationApi";

interface ConsultationTime {
  id: string;
  availableDate: string;
  availableTime: string;
  isAvailable: boolean;
  type: "Online" | "Offline";
  createdAt: string;
  updatedAt: string;
}

const TimeManagePage = () => {
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState<string>("12:00");
  const [type, setType] = useState<"Offline" | "Online">("Offline");

  const { data, isLoading } = useGetConsultationTimeQuery("");
  const [createConsultationTime, { isLoading: isCreating }] =
    useCreateConsultationTimeMutation();
  const [deleteConsultationTime, { isLoading: isDeleting }] =
    useDeleteConsultationTimeMutation();

  const handleSubmit = async () => {
    try {
      const combinedDateTime = new Date(`${date}T${time}:00`).toISOString();

      await createConsultationTime({
        availableDate: combinedDateTime,
        availableTime: formatTo12Hour(time),
        type,
      });

      setTime("");
    } catch (err) {
      alert("Error creating consultation time");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this time?")) {
      await deleteConsultationTime(id);
    }
  };

  const formatTo12Hour = (time24: string) => {
    const [hour, minute] = time24.split(":");
    const h = parseInt(hour);
    const suffix = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12}:${minute} ${suffix}`;
  };

  // Group data by date
  const groupedData: { [key: string]: ConsultationTime[] } = {};
  if (data?.result) {
    data.result.forEach((item: ConsultationTime) => {
      const dateKey = new Date(item.availableDate).toISOString().split("T")[0];
      if (!groupedData[dateKey]) {
        groupedData[dateKey] = [];
      }
      groupedData[dateKey].push(item);
    });
  }

  const handlePrint = async () => {
    setLoading(true);
    if (printRef.current) {
      console.log("first");
      const printContents = printRef.current.innerHTML;
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
    }
    setLoading(false);
  };

  return (
    <div className="p-1 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
        Manage Consultation Times
      </h1>

      <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 rounded shadow-sm w-full md:w-auto"
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="border p-2 rounded shadow-sm w-full md:w-auto"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value as "Offline" | "Online")}
          className="border p-2 rounded shadow-sm w-full md:w-auto"
        >
          <option value="Offline">Offline</option>
          <option value="Online">Online</option>
        </select>
        <button
          onClick={handleSubmit}
          disabled={isCreating}
          className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition"
        >
          {isCreating ? "Saving..." : "Add Time"}
        </button>
      </div>

      <div className="bg-white rounded shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Available Times</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : Object.keys(groupedData).length === 0 ? (
          <p className="text-gray-500">No data found.</p>
        ) : (
          <div ref={printRef} className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-blue-100">
                <tr>
                  <th className="border p-3 text-left">Date</th>
                  <th className="border p-3 text-left">Time</th>
                  <th className="border p-3 text-left">Type</th>
                  <th className="border p-3 text-left">Availability</th>
                  <th className="border p-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(groupedData)
                  .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
                  .map((dateKey) => {
                    const slots = groupedData[dateKey];
                    return slots.map((item, index) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        {index === 0 && (
                          <td
                            className="border p-3 font-semibold"
                            rowSpan={slots.length}
                          >
                            {dateKey}
                          </td>
                        )}
                        <td className="border p-3">{item.availableTime}</td>
                        <td className="border p-3">{item.type}</td>
                        <td className="border p-3">
                          {item.isAvailable ? (
                            <span className="text-green-600 font-semibold">
                              Available
                            </span>
                          ) : (
                            <span className="text-red-600 font-semibold">
                              Booked
                            </span>
                          )}
                        </td>
                        <td className="border p-3">
                          <button
                            onClick={() => handleDelete(item.id)}
                            className={`font-semibold ${
                              item.isAvailable
                                ? "text-red-500 hover:text-red-700"
                                : "text-gray-400 cursor-not-allowed"
                            }`}
                            disabled={!item.isAvailable}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ));
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="flex justify-end mt-4 space-x-2">
        <button
          onClick={() => handlePrint()}
          className="border px-1 py-2 rounded-md bg-[#9473ad] hover:bg-[#71518a] text-white cursor-pointer"
        >
          {loading ? "Downloading..." : "Download PDF"}
        </button>
      </div>
    </div>
  );
};

export default TimeManagePage;
