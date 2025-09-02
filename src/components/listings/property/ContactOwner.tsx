"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import demoUser from "@/assets/images/demo-user.png";
import { useForm, SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
import axiosInstance, { protectedApi } from "@/lib/axiosInstance";
import { TbMessageChatbotFilled } from "react-icons/tb";

// Define form data types
interface FormData {
  name: string;
  email: string;
  message: string;
}
interface Info {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface IProps {
  ownerInforMation: Info | undefined;
}

const ContactOwner: React.FC<IProps> = ({ ownerInforMation }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const buyerId = "678bf210dfccecb9dae45fe6";

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      // const finalData = { ...data, _id };
      const finalData = { user1Id: buyerId, user2Id: ownerInforMation?._id };
      const createConversation = await protectedApi.post(
        "/conversations/create",
        finalData
      );

      const messageFormat = {
        sender: buyerId,
        receiver: ownerInforMation?._id,
        content: `Hello, ${ownerInforMation?.firstName}. I am ${data.name}, and I need some information about (specific property). My inquiry is: ${data.message}. You can contact me further via email at ${data.email} or by phone at (phone number).`,
        conversationId: createConversation.data._id,
      };
      await protectedApi.post(`/conversations/send`, messageFormat);
      reset();

      Swal.fire({
        title: "Message Sent!",
        text: "Your message has been successfully sent to the owner.",
        icon: "success",
        confirmButtonText: "OK",
      });

      setIsOpen(false); // Close modal after submission
    } catch (error: unknown) {
      Swal.fire({
        title: "Error",
        text: "Something went wrong. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div>
      {/* Floating Contact Button */}
      <button
        className="fixed bottom-4 right-8 hover:shadow-2xl hover:shadow-secondary border-2 bg-primary text-white px-4 py-4 rounded-full shadow-lg flex items-center gap-2 text-lg font-medium hover:bg-hover transition-all"
        onClick={() => setIsOpen(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <TbMessageChatbotFilled className="text-2xl" />
        {isHovered && (
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-sm px-2 py-1 rounded-md whitespace-nowrap">
            Contact Seller
          </span>
        )}
      </button>

      {/* Centered Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black bg-opacity-50">
          {/* Modal Content */}
          <div className="relative w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              onClick={() => setIsOpen(false)}
            >
              ✖
            </button>

            {/* Agent Info */}
            <div className="text-center">
              <Image
                src={demoUser}
                width={60}
                height={60}
                alt="Agent"
                className="w-16 h-16 mx-auto rounded-full border-2 border-primary"
              />
              <h3 className="text-lg font-semibold mt-2">
                {ownerInforMation?.firstName} {ownerInforMation?.lastName}
              </h3>
              <p className="text-sm text-gray-500">Real Estate Agent</p>
              <a
                href={`tel:${ownerInforMation?.email}`}
                className="text-primary text-sm hover:underline"
              >
                {ownerInforMation?.email}
              </a>
            </div>

            {/* Quick Actions */}
            <div className="flex justify-around my-4">
              <a
                href={`tel:${ownerInforMation?.email}`}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-1"
              >
                📞 Call
              </a>
              <a
                href={`mailto:${ownerInforMation?.email}`}
                className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-1"
              >
                ✉ Email
              </a>
              <a
                href={`https://wa.me/${ownerInforMation?.email}`}
                className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-1"
              >
                💬 WhatsApp
              </a>
            </div>

            {/* Contact Form */}
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Your Name
                </label>
                <input
                  type="text"
                  {...register("name", { required: "Name is required" })}
                  className="w-full p-2 outline-none border-2 border-gray-300 focus:border-gray-400 rounded-lg "
                  placeholder="Enter your name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Your Email
                </label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: "Enter a valid email address",
                    },
                  })}
                  className="w-full p-2  rounded-lg outline-none border-2 border-gray-300 focus:border-gray-400"
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Message
                </label>
                <textarea
                  {...register("message", { required: "Message is required" })}
                  rows={4}
                  className="w-full p-2  rounded-lg outline-none border-2 border-gray-300 focus:border-gray-400"
                  placeholder="I'm interested in this property. Please contact me!"
                />
                {errors.message && (
                  <p className="text-red-500 text-sm">
                    {errors.message.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-white py-2 px-4 rounded-lg font-medium hover:bg-hover transition-all"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactOwner;
