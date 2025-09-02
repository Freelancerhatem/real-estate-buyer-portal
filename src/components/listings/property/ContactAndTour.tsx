"use client";
import Link from "next/link";
import { useState } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { MdTour } from "react-icons/md";
import toast from "react-hot-toast";
import { protectedApi } from "@/lib/axiosInstance";
import { useAuth } from "@/hooks/useAuth";
import { AxiosError } from "axios";

const ContactAndTour = ({ id }: { id: string | undefined }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    date: "",
    time: "",
  });
  const userId = user?._id;
  const propertyId = id;
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      toast.error("Please log in to schedule a tour.");
      return;
    }

    const toastId = toast.loading("Scheduling your tour...");

    try {
      await protectedApi.post("/tour/schedule", {
        userId,
        propertyId,
        preferredDate: formData.date,
        preferredTime: formData.time,
      });

      toast.success("Tour scheduled successfully!", { id: toastId });
      setFormData({ ...formData, date: "", time: "" });
    } catch (err: unknown) {
      const axErr = err as AxiosError<{ message?: string }>;
      console.error("Schedule Tour Error:", err);
      toast.error(axErr.response?.data?.message ?? "Failed to schedule tour.", {
        id: toastId,
      });
    }
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-md p-6 lg:p-10 mt-10 flex flex-col gap-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Request a Tour
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Preferred Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="time"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Preferred Time
            </label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-lg hover:bg-hover flex items-center justify-center gap-2 text-lg font-medium transition duration-300"
          >
            <MdTour className="text-xl" />
            Schedule Tour
          </button>
        </form>
      </div>

      <div className="border-t pt-6 text-center space-y-4">
        <p className="text-gray-600">Need more details?</p>
        <Link href={`/appointment-scheduling/${id}`}>
          <button className="w-full bg-gray-100 text-primary border border-gray-200 py-3 rounded-lg hover:bg-gray-200 hover:text-hover flex items-center justify-center gap-2 transition duration-300 font-medium">
            <FaRegCalendarAlt className="text-xl" />
            Set Appointment
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ContactAndTour;
