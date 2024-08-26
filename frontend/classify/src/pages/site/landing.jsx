// src/components/LandingPage.js

import HeroImage from "../../assets/hero.jpg"
import SmilingGirl from "../../assets/girl.png"
import HardTimeReading from "../../assets/hard_time_learning.jpg"
import {Link} from "react-router-dom"

import React from 'react';
import { motion } from 'framer-motion';
import { FaRocket, FaUsers, FaChalkboardTeacher, FaBook } from 'react-icons/fa';
import { MdEventAvailable, MdWork, MdContactMail } from 'react-icons/md';
import { Accordion, AccordionHeader, AccordionBody } from 'daisyui';
import PagesLayout from "../../components/UI/pageslayout";
const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
};

const LandingPage = () => {
  return (
    <PagesLayout>
    <div className="bg-gray-50 min-h-screen flex flex-col items-center p-6 md:p-12 space-y-8 md:space-y-16">
      {/* Hero Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="text-center max-w-6xl mx-auto space-y-6 md:space-y-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 md:mb-6">
          Welcome to Classify
        </h1>
        <p className="text-base md:text-lg text-gray-600 mb-4 md:mb-6">
          Transforming education with a modern, interactive approach. Start for free today!
        </p>
        <div className="space-x-4 flex  md:flex-row justify-center">
          <button className="bg-purple-600 text-white py-2 px-6 rounded-lg text-lg hover:bg-purple-700 transition mb-2 md:mb-0">
          <Link to="/signup">  Get Started </Link>
          </button>
          <button className="bg-green-600 text-white py-2 px-6 rounded-lg text-lg hover:bg-green-700 transition">
            Support Us
          </button>
        </div>
      </motion.div>

      {/* Hero Image Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="relative w-full max-w-6xl mx-auto object-cover"
      >
        <img src={HeroImage} className="w-full h-60 md:h-96 rounded-lg object-cover" />
      </motion.div>

      {/* Problems We Solve Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="w-full max-w-6xl mx-auto text-center bg-green-100 p-6 md:p-12 rounded-lg space-y-8 md:space-y-12"
      >
        <h2 className="text-3xl md:text-4xl font-semibold mb-6 md:mb-8">Problems We Solve</h2>
        <div className="flex flex-col md:flex-row justify-around space-y-8 md:space-y-0">
          {[
            { icon: <MdEventAvailable size={40} />, problem: 'Lack of Engagement', solution: 'Interactive lessons and gamified learning make education engaging and fun.' },
            { icon: <MdWork size={40} />, problem: 'Limited Resources', solution: 'Access to a wide range of resources and tools to enhance learning.' },
            { icon: <MdContactMail size={40} />, problem: 'Disconnected Learning', solution: 'A strong community and expert support to keep learners connected.' },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              className="bg-white rounded-lg p-6 md:p-8 max-w-xs mx-auto"
            >
              <div className="mb-4 text-green-600">{item.icon}</div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">{item.problem}</h3>
              <p className="text-gray-600">{item.solution}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12"
      >
        {[
          { icon: <FaRocket size={40} />, title: 'Innovative Learning', description: 'Engage with interactive and modern educational tools.' },
          { icon: <FaUsers size={40} />, title: 'Community Driven', description: 'Join a thriving community of learners and educators.' },
          { icon: <FaChalkboardTeacher size={40} />, title: 'Expert Educators', description: 'Learn from experienced teachers and industry professionals.' },
          { icon: <FaBook size={40} />, title: 'Extensive Resources', description: 'Access a wide range of educational materials and resources.' },
        ].map((feature, index) => (
          <motion.div
            key={index}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="bg-white rounded-lg p-6 md:p-8 flex flex-col items-center text-center"
          >
            <div className="mb-4 text-purple-600">{feature.icon}</div>
            <h2 className="text-lg md:text-2xl font-semibold mb-2">{feature.title}</h2>
            <p className="text-gray-600">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Before and After Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="w-full max-w-6xl mx-auto text-center bg-gray-100 p-6 md:p-12 rounded-lg space-y-8 md:space-y-12"
      >
        <h2 className="text-3xl md:text-4xl font-semibold mb-6 md:mb-8">Before and After</h2>
        <div className="flex flex-col md:flex-row justify-around space-y-8 md:space-y-0">
          {[
            { 
              title: 'Before Classify', 
              description: 'Students faced disengagement and struggled with traditional learning methods.',
              image: HardTimeReading
            },
            { 
              title: 'After Classify', 
              description: 'With Classify, students enjoy interactive lessons and a supportive community, making learning more engaging and effective.',
              image:SmilingGirl
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              className="bg-white rounded-lg p-6 md:p-8 max-w-xs mx-auto text-center"
            >
              <div className="mb-4">
               <img src={item.image} className="w-full h-48 bg-gray-200 rounded-lg"/>       
                      </div>
              <p className="text-gray-600">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Technology Impact Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="w-full max-w-6xl mx-auto text-center bg-green-200 p-6 md:p-12 rounded-lg space-y-8 md:space-y-12"
      >
        <h2 className="text-3xl md:text-4xl font-semibold mb-6 md:mb-8">Why Embrace Modern Tech?</h2>
        <p className="text-base md:text-lg mb-6">
          As technology evolves, educational tools must adapt to meet new standards. Classify offers a cutting-edge platform that integrates the latest advancements to enhance the learning experience. It's crucial for schools, online tutors, and educational institutions to adopt these tools to stay relevant and effective in today's fast-paced world.
        </p>
        <div className="flex flex-col md:flex-row justify-around space-y-8 md:space-y-0">
          {[
            { title: 'Schools', description: 'Integrate interactive learning tools to keep students engaged and improve outcomes.' },
            { title: 'Online Tutors', description: 'Utilize advanced features to deliver effective and personalized tutoring sessions.' },
            { title: 'Educational Institutions', description: 'Adopt modern technology to stay ahead and offer high-quality education.' }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              className="bg-white rounded-lg p-6 md:p-8 max-w-xs mx-auto text-center"
            >
              <h3 className="text-lg md:text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Developers Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="w-full max-w-6xl mx-auto text-center p-6 md:p-12 space-y-8 md:space-y-12"
      >
        <h2 className="text-3xl md:text-4xl font-semibold mb-6 md:mb-8">Meet the Developers</h2>
        <div className="flex flex-col md:flex-row justify-around space-y-8 md:space-y-0">
          {[
            { name: 'Developer 1', role: 'Lead Developer', image: 'path-to-developer1-image.svg' },
            { name: 'Developer 2', role: 'Frontend Developer', image: 'path-to-developer2-image.svg' },
            { name: 'Developer 3', role: 'Backend Developer', image: 'path-to-developer3-image.svg' }
          ].map((dev, index) => (
            <motion.div
              key={index}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              className="bg-white rounded-lg p-6 md:p-8 max-w-xs mx-auto text-center"
            >
              <div className="mb-4">
                <svg className="w-24 h-24 bg-gray-200 rounded-full mx-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                  <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="14" fill="#888">
                    {dev.name}
                  </text>
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">{dev.role}</h3>
              <p className="text-gray-600">{dev.name}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Floating Support Button */}
      <a
        href="#support"
        className="fixed bottom-8 right-8 bg-green-600 text-white py-2 px-4 rounded-full shadow-lg hover:bg-green-700 transition"
      >
        Support Us
      </a>
    </div>
    </PagesLayout>
  );
};

export default LandingPage;
