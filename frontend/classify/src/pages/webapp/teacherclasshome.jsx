import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faVideoCamera,faPaperclip, faQuestionCircle, faLightbulb, faComments, faBullhorn } from "@fortawesome/free-solid-svg-icons";
import { useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import AnnouncmentHome from "../../components/primitives/announcmentHome";
import { api } from "../../utils";
import { toast } from "react-toastify";
import ReactQuill from 'react-quill';
import { Link } from "react-router-dom";
const TeachersClassHome = () => {
  const { id } = useParams();
  const [classData, setClassData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [image, setImage] = useState(null);
  const [announcementText, setAnnouncementText] = useState("");
  const [newAnnouncement, setNewAnnouncement] = useState(0);
  const [userData, setUserData] = useState();
  const [streamDIV, setStreamDiv] = useState(false);
  const [postType, setPostType] = useState("question"); // New state for post type
  const [postTitle,setPostTitle] = useState("")
  const fetchUserData = () => {
    api.get("/user/profile", {}, 50000,
      (data, status) => {
        setUserData(data);
      },
      (error, status) => {
        return;
      },
      (error) => {
        toast.error("Server is too slow !!");
      }
    );
  };

  useEffect(() => {
    fetchData();
    fetchUserData();
  }, []);

  useEffect(() => {
    if (classData) {
      document.title = classData.name;
    }
  }, [classData]);

  const fetchData = () => {
    api.get(
      `/class/${id}`,
      {},
      50000,
      (data, status) => setClassData(data),
      (error, status) => {
        if (status === 404) {
          window.location.href = "/not-found";
        }
        console.error("Fetch error:", error);
      },
      (error) => {
        alert("Error: Request timed out");
      }
    );
  };

  const handleCustomizeClick = () => setShowModal(true);
  const handleNoLink = () => {
    toast.info("This class do not have a meet Link !")
  }
  const handleCloseModal = () => setShowModal(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!image) {
      alert("Please select an image before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("cover", image);

    api.put(
      `/class/${id}`,
      formData,
      {},
      50000,
      (data, status) => {
        setClassData((prevData) => ({
          ...prevData,
          cover_image_url: data.cover_image_url
        }));
        setShowModal(false);
      },
      (error, status) => {
        console.error("Upload error:", error);
        if (status === 404) {
          return <Navigate to={"not-found"} />;
        }
      },
      (error) => {
        toast.error("Server is not responding ");
      }
    );
  };

  const handleMakeAnnouncement = () => {
    const data = {
      detail: announcementText,
      _type: postType,
      title:postTitle
    };

    api.post(`/class/announcement?class_id=${id}`, data, {}, 50000,
      (date, status) => {
        setShowAnnouncementModal(false);
        toast.success("Announcement Published");
        setNewAnnouncement(newAnnouncement + 1);
        setStreamDiv(false)
      },
      (error, status) => {
        if (status === 404) {
          return <Navigate to={"/not-found"} />;
        }

        toast.error("Bad request");
      },
      (error) => {
        toast.error("Server is not responding !!");
      }
    );
  };

  const handleAnnouncementClick = () => setShowAnnouncementModal(true);

  const handleCloseAnnouncementModal = () => setShowAnnouncementModal(false);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {classData?.cover_image_url ? (
        <div className="relative mx-3">
          <div
            className="h-48 sm:h-64 lg:h-80 bg-cover bg-center rounded-t-md"
            style={{ backgroundImage: `url(${classData.cover_image_url})` }}
          ></div>
          <button
            className="absolute top-2 right-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-full shadow-md transition duration-300 ease-in-out"
            onClick={handleCustomizeClick}
          >
            <FontAwesomeIcon icon={faPen} />
          </button>
          <p className="bg-black text-white px-4 py-2 absolute bottom-0 right-1 m-3 rounded-md shadow-md">
            Total Students: {classData?.members?.length || 0}
          </p>

          <p className="bg-black hidden md:block  opacity-50 text-sm text-white px-4 py-2 absolute bottom-0 left-1 m-3 rounded-md shadow-md">
           {classData?.name}
          </p>

          <p className="bg-black opacity-50 text-xs text-white px-4 py-2 absolute top-0 left-1 m-3 rounded-md shadow-md">
           {classData?.class_code}
          </p>

        </div>
      ) : (
        <div className="relative mx-3 h-48 sm:h-64 lg:h-80 flex items-center justify-center bg-gray-200 rounded-t-md">
          <div className="text-gray-400 text-4xl sm:text-5xl lg:text-6xl font-bold">
            {classData?.name?.split(" ").map((word) => word[0]).join("")}
          </div>
          <button
            className="absolute top-2 right-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-full shadow-md transition duration-300 ease-in-out"
            onClick={handleCustomizeClick}
          >
            <FontAwesomeIcon icon={faPen} />
          </button>
          <p className="absolute bottom-0 right-1 m-3 bg-gray-800 text-white px-4 py-2 rounded-md shadow-md">
            Total Students: {classData?.members?.length || 0}
          </p>
          <p className="bg-black opacity-50 hidden md:block text-sm text-white px-4 py-2 absolute bottom-0 left-1 m-3 rounded-md shadow-md">
           {classData?.name}
          </p>

          <p className="bg-black opacity-50 text-xs text-white px-4 py-2 absolute top-0 left-1 m-3 rounded-md shadow-md">
           {classData?.class_code}
          </p>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4 text-purple-900">Customize Class Image</h2>
            <div>
              <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700">
                Upload Cover Image
              </label>
              <input
                type="file"
                id="coverImage"
                name="cover_image"
                className="mt-2 p-2 w-full border rounded-md"
                onChange={(e) => setImage(e.target.files[0])}
              />
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="mr-2 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-md transition duration-300 ease-in-out"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFormSubmit}
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition duration-300 ease-in-out"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6">
        {/* <div className="md:w-[30%] flex justify-center items-center border-2 h-36 p-4 rounded-lg shadow-sm">
          <div className="text-center">
            <p className="text-lg font-medium">Class Code</p>
            <p className="text-2xl font-bold">{classData?.class_code || "N/A"}</p>
          </div>
        </div> */}

        <div className="md:w-[100%] flex flex-col gap-4">
          <div className="flex gap-4">
           {classData?.meet_link ? 
            <Link to={classData?.meet_link} target="_blank"
            className="rounded-full bg-purple-50 text-purple-700 font-medium px-4  p-2 flex items-center justify-center shadow-sm">
              <FontAwesomeIcon icon={faVideoCamera} className="mr-2" />
              
            </Link> : <button onClick={handleNoLink}
            className="rounded-full bg-purple-50 text-purple-700 font-medium px-4  p-2 flex items-center justify-center shadow-sm">
              <FontAwesomeIcon icon={faVideoCamera} className="mr-2" />
              
            </button>}
            <div onClick={() => setStreamDiv(!streamDIV)}
              className="flex items-center gap-4 border-[1px] shadow-sm p-2 rounded-full cursor-pointer">
              <img src={userData && userData.profile_image} className="w-8 h-8 rounded-full" />
              <span>Post an update </span>
            </div>
          </div>
          <div className="max-w-[100%]">
          {streamDIV && (
           <motion.div 
           className="bg-white shadow-lg rounded-lg md:p-6 p-2"
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           exit={{ opacity: 0, scale: 0.8 }}
           transition={{ duration: 0.3 }}
         >
           <form className="space-y-6">
             <label htmlFor="announcement-text" className="block text-lg font-semibold text-gray-800 mb-2">
               Create Post
             </label>
             {/* Post Type Dropdown */}
             <div className="mb-4">
               <label htmlFor="postType" className="block text-sm font-medium text-gray-700 mb-2">Post Type</label>
               <select
                 id="postType"
                 name="postType"
                 value={postType}
                 onChange={(e) => setPostType(e.target.value)}
                 className="block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
               >
                 <option value="idea">Idea 💡</option>
                 <option value="discussion">Discussion 💬</option>
                 <option value="announcement">Announcement 📢</option>
                 <option value="question">Question ❓</option>
               </select>
             </div>
             
             {/* Post Title */}
             <input  
               placeholder="Post Title"
               className="w-full bg-white border-2 border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
               value={postTitle}
               onChange={(e) => setPostTitle(e.target.value)}
             />
             
             {/* React Quill Text Editor */}
             <ReactQuill
               id="announcement-text"
               name="announcement-text"
               value={announcementText}
               onChange={setAnnouncementText}
               className="w-full h-48 [padding:0px!important] border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
               placeholder="Type your announcement here..."
             />
             
             {/* Post Button */}
             <div className="flex justify-end">
               <button
                 type="button"
                 onClick={handleMakeAnnouncement}
                 className="px-5 mt-16 md:mt-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-md shadow-md transition duration-300 ease-in-out"
               >
                 Post
               </button>
             </div>
           </form>
         </motion.div>
         
          )}
          </div>
        </div>
      </div>

      {!streamDIV && (
        <AnnouncmentHome
          handleCloseAnnouncementModal={handleCloseAnnouncementModal}
          handleMakeAnnouncement={handleMakeAnnouncement}
          announcementText={announcementText}
          setAnnouncementText={setAnnouncementText}
        />
      )}
    </div>
  );
};

export default TeachersClassHome;
