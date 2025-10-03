"use client";

import { Phone, Mail, MapPin } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 text-gray-900 min-h-[70vh] flex items-center overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="w-full md:w-2/3 text-left">
            <h1 className="text-5xl font-extrabold uppercase tracking-wide drop-shadow-sm">
              CONTACT US
            </h1>
            <p className="mt-4 text-gray-700 text-lg">
              We're here to help and answer any questions you might have. We
              look forward to hearing from you!
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-gray-200">
        <div className="flex flex-col items-center text-center space-y-2">
          <Phone className="w-8 h-8 text-orange-500" />
          <h3 className="font-bold text-lg text-gray-900">PHONE</h3>
          <p className="text-gray-700">929-242-6868</p>
        </div>

        <div className="flex flex-col items-center text-center space-y-2">
          <Mail className="w-8 h-8 text-orange-500" />
          <h3 className="font-bold text-lg text-gray-900">EMAIL</h3>
          <p className="text-gray-700">contact@info.com</p>
        </div>

        <div className="flex flex-col items-center text-center space-y-2">
          <MapPin className="w-8 h-8 text-orange-500" />
          <h3 className="font-bold text-lg text-gray-900">ADDRESS</h3>
          <p className="text-gray-700">Ahmedabad, India</p>
        </div>
      </section>

      {/* Contact + Form Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-extrabold uppercase text-gray-900">
            Get a Quote
          </h2>
          <p className="mt-2 text-gray-600">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem.
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-lg">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name *"
                className="border border-gray-300 rounded-md px-4 py-2 w-full focus:ring-2 focus:ring-purple-500 outline-none"
                required
              />
              <input
                type="text"
                placeholder="Last Name *"
                className="border border-gray-300 rounded-md px-4 py-2 w-full focus:ring-2 focus:ring-purple-500 outline-none"
                required
              />
            </div>

            <input
              type="email"
              placeholder="Email *"
              className="border border-gray-300 rounded-md px-4 py-2 w-full focus:ring-2 focus:ring-purple-500 outline-none"
              required
            />

            <textarea
              placeholder="Message *"
              rows="4"
              className="border border-gray-300 rounded-md px-4 py-2 w-full focus:ring-2 focus:ring-purple-500 outline-none"
              required
            ></textarea>

            <button
              type="submit"
              className="bg-orange-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-orange-600 transition"
            >
              SEND
            </button>
          </form>
        </div>
      </section>

      {/* Google Map Section */}
      <section className="w-full h-[300px]">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3679.54436687594!2d72.5713620751197!3d23.022505217313975!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e84f5f5df34a3%3A0x5e7e4e3d06c1a9e7!2sAhmedabad%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1693914300000!5m2!1sen!2sin"
          width="100%"
          height="100%"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full border-0"
        ></iframe>
      </section>

      <Footer />
    </div>
  );
}
