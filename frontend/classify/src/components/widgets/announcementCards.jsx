import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleRight } from "@fortawesome/free-solid-svg-icons";
import { faPen, faCameraAlt, faPaperclip, faQuestionCircle, faLightbulb, faComments, faBullhorn, faManatSign, faEllipsisV } from "@fortawesome/free-solid-svg-icons";

const AnnouncementCard = ({ data ,deleteStream}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const comments = 10;

  // Convert the date to a more human-readable format
  const formattedDate = new Date(data.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const typeIcon = {
    idea: faLightbulb,
    question: faQuestionCircle,
    comments: faComments,
    announcement: faBullhorn,
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <div className="w-full bg-base-100 border-b-2 mb-2 relative">
      <div className="flex justify-between md:px-6 p-4">
        <FontAwesomeIcon icon={typeIcon[data._type]} className="text-slate-300" />
        <FontAwesomeIcon
          icon={faEllipsisV}
          className="cursor-pointer"
          onClick={toggleMenu}
        />

        {isMenuOpen && (
          <div className="absolute right-4 top-12 bg-white shadow-lg rounded-lg w-48 z-50">
            <ul>
            { (data.user_is_admin || data.is_owner) && 
            <li onClick = {() => {deleteStream(data.id);setIsMenuOpen(false)}} className="p-2 hover:bg-gray-100 cursor-pointer">Delete</li> }

              <li className="p-2 hover:bg-gray-100 cursor-pointer">View More</li>
              <li className="p-2 hover:bg-gray-100 cursor-pointer">See students profile</li>
              <li className="p-2 hover:bg-gray-100 cursor-pointer">Add comment</li>
            </ul>
          </div>
        )}
      </div>
      <p className="text-slate-600 text-sm ">{formattedDate}</p>
      <div className="flex my-2 gap-2">
        <img src={data.user.profile_image} className="w-8 h-8 rounded-full" />
        <p className="text-sm font-italic">
          <i>
            {data.user.username}{" "}
            <small className="text-slate-500">
              {data.by_admin && "admin"}
            </small>
          </i>
        </p>
      </div>

      <p className="my-4">{data.title}</p>
      <small className="mx-2 text-slate-400"><i>{data.comments.length} Comments</i></small>
      <span className="text-purple-900">
        Read more <FontAwesomeIcon icon={faArrowCircleRight} />
      </span>
    </div>
  );
};

export default AnnouncementCard;
