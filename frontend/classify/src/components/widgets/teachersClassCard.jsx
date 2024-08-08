import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

const ClassCard = ({ data }) => {
  return (
    <div className="relative card w-full sm:w-64 md:w-72 shadow-sm bg-white text-gray-800 rounded-md m-2">
      <button className="absolute text-purple-600 top-2 right-2 bg-gray-100 p-2 rounded-full shadow hover:bg-gray-200">
        <FontAwesomeIcon icon={faEye} className="text-purple-600" />
      </button>
      {data.image_url ? (
        <div
          className="h-28 bg-cover bg-center rounded-t-md"
          style={{ backgroundImage: `url(${data.image_url})` }}
        ></div>
      ) : (
        <div className="h-28 flex items-center justify-center bg-gray-200 rounded-t-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-gray-400"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <text
              x="50%"
              y="50%"
              dominantBaseline="middle"
              textAnchor="middle"
              fontSize="16"
              fill="gray"
            >
              {data.name.split(' ').map((word) => word[0]).join('')}
            </text>
          </svg>
        </div>
      )}
      <div className="card-body p-3">
        <h2 className="card-title text-gray-900 font-semibold text-base sm:text-lg">
          {data.name}
        </h2>
        <p className="text-gray-600 text-sm">Category: {data.category}</p>
        <p className="text-gray-700 text-sm mt-2 truncate">{data.description}</p>
      </div>
    </div>
  );
};

export default ClassCard;