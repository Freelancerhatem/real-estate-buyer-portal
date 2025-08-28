"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import bg from "@/assets/images/bg-contact.png";

interface IFormInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactUsPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();
  const [formStatus, setFormStatus] = useState("");

  const onSubmit: SubmitHandler<IFormInput> = async () => {
    setFormStatus("Sending...");
    try {
      setTimeout(() => {
        setFormStatus("Your message has been sent successfully!");
      }, 2000);
    } catch {
      setFormStatus("There was an error sending your message.");
    }
  };

  return (
    <>
      <Head>
        <title>Contact Us | Real Estate</title>
        <meta
          name="description"
          content="Contact us for any inquiries related to real estate"
        />
      </Head>

      {/* Hero Section */}
      <div className="relative h-[70vh] flex items-center justify-center">
        <Image src={bg} alt="Hero Image" fill className="absolute inset-0" />
        <div className="bg-black bg-opacity-50 p-6 rounded-lg text-center text-white z-10">
          <h1 className="text-4xl font-bold">Contact Us</h1>
          <p className="mt-2 text-xl">
            We’d love to hear from you! Get in touch with us today.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-semibold text-gray-800">Get in Touch</h1>
          <p className="text-lg text-gray-600">
            Have any questions? We are here to help!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white shadow-lg rounded-lg p-8">
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-lg font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  className="w-full p-3 mt-2 border border-gray-300 rounded-md"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-lg font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full p-3 mt-2 border border-gray-300 rounded-md"
                  {...register("email", {
                    required: "Email is required",
                    pattern: /^\S+@\S+\.\S+$/,
                  })}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="subject"
                  className="block text-lg font-medium text-gray-700"
                >
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  className="w-full p-3 mt-2 border border-gray-300 rounded-md"
                  {...register("subject", { required: "Subject is required" })}
                />
                {errors.subject && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.subject.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="message"
                  className="block text-lg font-medium text-gray-700"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full p-3 mt-2 border border-gray-300 rounded-md"
                  {...register("message", { required: "Message is required" })}
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <button
                  type="submit"
                  className="w-full bg-[#FF4C5A] text-white py-3 rounded-md hover:bg-[#FF4C5A]/90 focus:outline-none"
                >
                  Send Message
                </button>
              </div>

              {formStatus && (
                <p className="text-center text-lg text-gray-700 mt-4">
                  {formStatus}
                </p>
              )}
            </form>
          </div>

          {/* OpenStreetMap iframe */}
          <div className="bg-white shadow-lg rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Our Location
            </h2>
            <div className="w-full h-64">
              <iframe
                src="https://www.openstreetmap.org/export/embed.html?bbox=5.319156289577961%2C60.39022267237756%2C5.328143581151474%2C60.39507604096818&layer=mapnik"
                className="w-full h-full border-0 rounded-lg"
                title="Office Location"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="text-center mt-8">
          <p className="text-lg text-gray-700">Follow us on</p>
          <div className="flex justify-center space-x-6 mt-4">
            <Link href="https://facebook.com" target="_blank" passHref>
              <span className="text-blue-600">Facebook</span>
            </Link>
            <Link href="https://twitter.com" target="_blank" passHref>
              <span className="text-blue-400">Twitter</span>
            </Link>
            <Link href="https://instagram.com" target="_blank" passHref>
              <span className="text-pink-500">Instagram</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactUsPage;
