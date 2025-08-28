"use client";
import Link from "next/link";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className={`bg-gray-900 text-white py-12`}>
      <div className="container mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Logo and Description */}
        <div>
          <h2 className="text-2xl font-extrabold tracking-wide mb-4">
            Your Logo
          </h2>
          <p className="text-sm text-gray-400">
            Discover the best properties with us. Your dream home is just a
            click away.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4 uppercase">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="#about"
                className="hover:text-primary transition duration-200"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="#services"
                className="hover:text-primary transition duration-200"
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                href="#projects"
                className="hover:text-primary transition duration-200"
              >
                Projects
              </Link>
            </li>
            <li>
              <Link
                href="#contact"
                className="hover:text-primary transition duration-200"
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Help & Support */}
        <div>
          <h3 className="text-lg font-semibold mb-4 uppercase">
            Help & Support
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="#help"
                className="hover:text-primary transition duration-200"
              >
                Help Center
              </Link>
            </li>
            <li>
              <Link
                href="#faq"
                className="hover:text-primary transition duration-200"
              >
                FAQ
              </Link>
            </li>
            <li>
              <Link
                href="#support"
                className="hover:text-primary transition duration-200"
              >
                Customer Support
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold mb-4 uppercase">Newsletter</h3>
          <p className="text-sm text-gray-400 mb-4">
            Subscribe to receive the latest updates and offers.
          </p>
          <form className="flex items-center w-full">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-l-md text-gray-900 focus:ring-2 focus:ring-primary outline-none"
            />
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded-r-md hover:bg-primary-dark transition duration-300"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Social Media Links */}
      <div className="border-t border-gray-700 mt-10 pt-6 text-center">
        <p className="text-sm text-gray-400 mb-4">Follow us on social media</p>
        <div className="flex justify-center gap-4">
          <a
            href="#"
            className="text-gray-400 hover:text-white transition duration-300"
          >
            <FaFacebookF size={20} />
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-white transition duration-300"
          >
            <FaTwitter size={20} />
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-white transition duration-300"
          >
            <FaInstagram size={20} />
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-white transition duration-300"
          >
            <FaLinkedinIn size={20} />
          </a>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="mt-6 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Your Company. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
