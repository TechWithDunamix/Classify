import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
const ClassCard = ({ data }) => {
  return (
    <div className="relative card w-full sm:w-64 md:w-72 shadow-sm bg-white text-gray-800 rounded-md m-2">
      {data.is_admin && <p className='absolute left-1 text-sm text-slate-600 mt-2'>Admin</p>}
      <button className="absolute text-purple-600 top-2 right-2 bg-gray-100 p-2 rounded-full shadow hover:bg-gray-200">
        <Link to={data.is_admin ? `/class/view/${data.id}` : `/s/${data.id}`}> <FontAwesomeIcon icon={faEye} className="text-purple-600" /></Link>
      </button>
      {data.cover_image_url ? (
        <div
          className="h-28 bg-cover bg-center rounded-t-md"
          style={{ backgroundImage: `url(${data.cover_image_url})` }}
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
