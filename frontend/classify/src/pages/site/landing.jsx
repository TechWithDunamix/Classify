import { Link } from "react-router-dom";
import React from "react";
import { motion } from "framer-motion";
import { FaRocket, FaUsers, FaChalkboardTeacher, FaBook } from "react-icons/fa";
import { MdEventAvailable, MdWork, MdContactMail } from "react-icons/md";
import { AiOutlineClose, AiFillCloseCircle } from 'react-icons/ai'; //
import PagesLayout from "../../components/UI/pageslayout";
import HeroImage from "../../assets/hero3.png";
import PlaceholderImage2 from "../../assets/hero2.svg";
import FeatureImage from "../../assets/hero.svg"; // Add the feature image here
import Fet1 from "../../assets/fet.png"; // Add the feature image here
import Fet2 from "../../assets/fet2.png"; // Add the feature image here
import HeroSide from "../../assets/hero2.png";
import Dev from "../../assets/dev.jpg"

// Animation variants for sections and icons
const sectionVariants = {
  hidden: { opacity: 1, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const iconVariants = {
  hidden: {rotate: 0 },
  visible: {
    // opacity: 1,
    scale: 1,
    rotate: [5, 360],
    transition: { duration: 5, repeat: Infinity, ease: "ease" },
  },
};

const iconPositions = [
  { top: "10%", left: "15%" },
  { top: "35%", left: "70%" },
  { top: "60%", left: "20%" },
  { top: "75%", left: "80%" },
  { top: "45%", left: "50%" },
  { top: "5%", left: "50%" },
  { top: "35%", left: "30%" },
  { top: "25%", left: "80%" },

  { top: "15%", left: "90%" },
  { top: "25%", left: "34%" },
  { top: "45%", left: "20%" },
  { top: "15%", left: "40%" },
  { top: "35%", left: "70%" },


];

const LandingPage = () => {
  return (
    <PagesLayout>
      {/* Floating Icons */}
      <div className="relative h-[100vh] w-full">
        {[
          AiOutlineClose,
          AiOutlineClose,
          AiOutlineClose,
          AiOutlineClose,
          AiOutlineClose,
          AiOutlineClose,
          AiOutlineClose,
          AiOutlineClose,
          AiOutlineClose,
          AiOutlineClose,
          AiOutlineClose,
          AiOutlineClose,
          AiOutlineClose,


        ].map((Icon, index) => (
          <motion.div
            key={index}
            variants={iconVariants}
            initial="hidden"
            animate="visible"
            className="absolute text-purple-600 text-2xl"
            style={iconPositions[index % iconPositions.length]}
          >
            <Icon />
          </motion.div>
        ))}

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-600 via-purple-400 to-purple-200 p-8 md:p-12 flex flex-col md:flex-row justify-between items-center">
          <div
            
            className="text-center md:text-left md:w-[55%] p-4"
          >
            <h1 className="text-white font-bold md:text-5xl text-3xl mb-4">
              Elevate Learning with Classify
            </h1>
            <p className="text-white text-lg md:text-xl mb-6">
              Simplify classroom management with intuitive features that help
              educators and students connect effortlessly.
            </p>
            <Link
              to="/signup"
              className="bg-white text-purple-600 font-semibold px-8 py-3 rounded-md shadow-md hover:bg-purple-200 transition"
            >
              Get Started
            </Link>
          </div>
          <div
            
            className="w-full md:w-[40%]"
          >
            <img
              src={HeroImage}
              className="w-full h-auto rounded-md shadow-lg transform hover:scale-105 transition duration-500"
              alt="Hero Image"
            />
          </div>
        </div>

        {/* Second Section */}
        <div className="flex flex-col md:flex-row-reverse p-8 md:p-12 justify-center items-center bg-gray-50">
          <div
            
            className="md:w-[60%] p-4 text-center md:text-left"
          >
            <h2 className="text-3xl md:text-4xl text-purple-800 font-semibold mb-4">
              Streamline Classroom Management
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Classify's tools empower teachers to easily organize classwork and
              engage students in a collaborative learning environment. Stay
              productive and focused with our seamless features.
            </p>
          </div>
          <div
            
            className="w-full md:w-[40%]"
          >
            <img
              src={PlaceholderImage2}
              className="w-full h-auto rounded-md shadow-lg hover:scale-105 transition duration-500"
              alt="Classify Features"
            />
          </div>
        </div>

        {/* Features Section */}
        <div className="flex flex-col md:flex-row min-h-full md:p-12 p-8 justify-center items-center">
          <div className="md:w-[60%]">
            <h2 className="md:text-[2.5rem] text-[1.5rem] text-purple-800">
              Powerful Features to Empower Your Classroom
            </h2>
            <p className="text-lg text-slate-800">
              Explore a suite of tools that bring educators and students closer
              together. Manage classwork, communicate effortlessly, and create
              an engaging learning experience.
            </p>
          </div>
          <div className="">
            {/* Icons spinning around */}
            <img src={HeroSide} />
          </div>
        </div>

        {/* New Feature Section */}
        <div className="flex flex-col md:flex-row p-8 md:p-12 justify-between items-center bg-white">
          <div
            
            className="w-full md:w-[40%] mb-6 md:mb-0"
          >
            <img
              src={FeatureImage}
              className="w-full h-auto rounded-md shadow-lg hover:scale-105 transition duration-500"
              alt="Feature Image"
            />
          </div>
          <div
            
            className="text-center md:text-left md:w-[55%] p-4"
          >
            <h2 className="text-purple-800 font-bold md:text-4xl text-2xl mb-4">
              Discover Our Features
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              We've built Classify to enhance learning experiences with
              effective tools. Each feature is designed to empower teachers and
              create better collaboration in classrooms.
            </p>
            <div className="space-y-6">
              <div className=" p-4 rounded-md">
                <div className="flex items-center">
                <img src={Fet2} />

                <h3 className="text-purple-800 font-semibold text-2xl mb-2">
                   Smart Class Management
                </h3>
                </div>
                <p className="text-gray-700">
                  Organize assignments, grades, and feedback in one place. Our
                  system keeps your workflow smooth and organized.
                </p>
              </div>
              <div className=" p-4 rounded-md ">
                <div className="flex items-center">
                <img src={Fet1} />
                <h3 className="text-purple-800 font-semibold text-2xl mb-2">
                   Real-Time Collaboration
                </h3>
                </div>
                <p className="text-gray-700 flex">
                  Collaborate with students and teachers in real-time. Our
                  system supports live chat, video calls, and instant feedback.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="flex flex-col md:flex-row min-h-full md:p-12 p-8 justify-center items-center bg-gradient-to-r from-purple-600 to-purple-400">
          <div className="text-center md:text-left md:w-[60%] p-4">
            <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Classroom?
            </h2>
            <p className="text-white text-lg md:text-xl mb-6">
              Join thousands of educators and students who are already
              benefiting from our intuitive platform. Start your journey with
              Classify today!
            </p>
            <Link
              to="/signup"
              className="bg-white text-purple-600 font-semibold px-8 py-3 rounded-md shadow-md hover:bg-purple-200 transition"
            >
              Sign Up Now
            </Link>
          </div>
        </div>

        <div className="bg-gray-100 py-12 px-8 md:px-16">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl text-purple-800 font-bold mb-6">
          Meet the Developer
        </h2>
        <div className="flex flex-col md:flex-row items-center justify-between space-x-8">
          <div className="w-full md:w-[40%] mb-6 md:mb-0">
            <img
              src={Dev}
              className="w-3/4 h-auto rounded-md"
              alt="Developer"
            />
          </div>
          <div className="w-full md:w-[60%] text-center md:text-left">
            <p className="text-lg text-gray-700 mb-4">
              Hello! I'm Dunamix, a passionate software developer specializing in
              modern web technologies. With expertise in Python, React, Django, and
              more, I love creating intuitive and powerful applications. When I'm
              not coding, you can find me exploring new tech trends and mentoring
              aspiring developers.
            </p>
            <p className="text-lg text-gray-700">
              Feel free to connect with me through my [LinkedIn](#) or [GitHub](#)
              profiles. I'm always open to collaboration and new opportunities!
            </p>
          </div>
        </div>
      </div>
    </div>
      </div>

      
    </PagesLayout>
  );
};

export default LandingPage;
