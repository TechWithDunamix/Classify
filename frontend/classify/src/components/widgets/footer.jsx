import React from "react";
import { FaFacebookF, FaEnvelope, FaPhone, FaMapMarkerAlt, FaGlobe } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-purple-700 text-white py-8 w-full">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start space-y-6 md:space-y-0">
          {/* Contact Information */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">Contact Us</h2>
            <div className="flex items-center space-x-2">
              <FaEnvelope className="text-white" />
              <a
                href="mailto:techwithdunamix@gmail.com"
                className="hover:text-purple-200 transition"
              >
                techwithdunamix@gmail.com
              </a>
            </div>
            <div className="flex items-center space-x-2">
              <FaPhone className="text-white" />
              <span>+2348119730652</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaMapMarkerAlt className="text-white" />
              <span>
                No 14 St Peter Avenue, Awka, Anambra, Nigeria
              </span>
            </div>
          </div>

          {/* Website and Social Links */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">Find Us Online</h2>
            <div className="flex items-center space-x-2">
              <FaGlobe className="text-white" />
              <a
                href="https://techwithdunamix.b12sites.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-purple-200 transition"
              >
                https://techwithdunamix.b12sites.com/
              </a>
            </div>
            <div className="flex items-center space-x-2">
              <FaFacebookF className="text-white" />
              <a
                href="https://www.facebook.com/profile.php?id=61567161477190"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-purple-200 transition"
              >
                Facebook
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-300">
            &copy; {new Date().getFullYear()} Classify <small>By Tech with dunamix</small>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
