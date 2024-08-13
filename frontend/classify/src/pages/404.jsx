import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloud } from '@fortawesome/free-solid-svg-icons'; // Importing the cloud icon

const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="text-center">
        {/* Cloud Icon */}
        <FontAwesomeIcon
          icon={faCloud}
          className="text-purple-600 w-20 h-20 mx-auto animate-bounce"
        />

        {/* 404 Title */}
        <h1 className="text-6xl font-bold text-purple-700 mt-8 animate-fade-in-down">
          404
        </h1>
        <p className="text-2xl text-gray-600 mt-4 animate-fade-in-down">
          Oops! The page you're looking for isn't available.
        </p>
        <p className="text-xl text-gray-500 mt-2 animate-fade-in-down">
          It looks like you're lost in the <span className="text-purple-700 font-bold">Classify</span> cloud.
        </p>

        {/* Back to Home Button */}
        <a
          href="/"
          className="btn btn-primary mt-8 animate-fade-in-up bg-purple-600 border-none hover:bg-purple-700 text-white"
        >
          Go Back Home
        </a>
      </div>
    </div>
  );
};

export default NotFoundPage;
