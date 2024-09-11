import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleRight } from "@fortawesome/free-solid-svg-icons";
import { faQuestionCircle, faLightbulb, faComments, faBullhorn, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { Link, useParams } from "react-router-dom";

const AnnouncementCard = ({ data, deleteStream }) => {
  const { id } = useParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Convert the date to a more human-readable format
  const formattedDate = new Date(data.date).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const typeIcon = {
    idea: faLightbulb,
    question: faQuestionCircle,
    comments: faComments,
    announcement: faBullhorn,
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="w-full bg-white shadow-sm rounded-lg mb-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
      {/* Card Header */}
      <div className="flex items-start justify-between px-4 py-3 relative">
        {/* Icon + Date */}
        <div className="flex items-center gap-3">
          <FontAwesomeIcon icon={typeIcon[data._type]} className="text-purple-500 text-lg" />
          <div>
            <p className="text-xs text-gray-400">{formattedDate}</p>
            <div className="flex items-center gap-2">
              <img src={data.user.profile_image} alt="profile" className="w-8 h-8 rounded-full" />
              <p className="text-sm font-semibold text-gray-700">
                {data.user.username}{" "}
                {data.by_admin && (
                  <span className="text-xs text-gray-400 font-light">• Admin</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="relative">
          <FontAwesomeIcon
            icon={faEllipsisV}
            className="text-gray-400 cursor-pointer"
            onClick={toggleMenu}
          />
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 bg-white shadow-md rounded-lg w-48 z-50">
              <ul className="text-sm">
                {(data.user_is_admin || data.is_owner) && (
                  <li
                    onClick={() => { deleteStream(data.id); setIsMenuOpen(false); }}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    Delete
                  </li>
                )}
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">View More</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">See students profile</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Add comment</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="px-4 py-2">
        <p className="text-base font-medium text-gray-900 mb-2">{data.title}</p>
        <p className="text-xs text-gray-500">
          <i>{data.comments.length} Comments</i>
        </p>
      </div>

      {/* Card Footer */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
        <Link to={`/stream/detail/${id}?stream=${data.id}`} className="text-sm text-purple-600 hover:underline">
          Read more <FontAwesomeIcon icon={faArrowCircleRight} />
        </Link>
      </div>
    </div>
  );
};

export default AnnouncementCard;
