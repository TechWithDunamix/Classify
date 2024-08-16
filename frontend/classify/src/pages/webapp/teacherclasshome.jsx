import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faCameraAlt, faPaperclip } from "@fortawesome/free-solid-svg-icons";
import { useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import AnnouncmentHome from "../../components/primitives/announcmentHome";
import { api } from "../../utils";
import { toast } from "react-toastify";

const TeachersClassHome = () => {
  const { id } = useParams();
  const [classData, setClassData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [image, setImage] = useState(null);
  const [announcementText,setAnnouncementText] = useState("")
  const [newAnnouncement,setNewAnnouncement] = useState(0)
  useEffect(() => {
    fetchData();
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
       toast.error("Server is not responding ")
      }
    );
  };

  const handleMakeAnnouncement = () => {
    const data  = {
      detail:announcementText
    }

    api.post(`/class/announcement?class_id=${id}`,data,{},50000,
      (date,status) => {
        setShowAnnouncementModal(false)
        toast.success("Announcement Published")
        setNewAnnouncement(newAnnouncement + 1)
      },
      (error,status) => {
        if (status === 404){
          return <Navigate to={"/not-found"} />
        }

        toast.error("Bad request")
      },
      (error) => {
        toast.error("Sever is not responding !!")
      }
    )
  }

  const handleAnnouncementClick = () => setShowAnnouncementModal(true);

  const handleCloseAnnouncementModal = () => setShowAnnouncementModal(false);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {classData?.cover_image_url ? (
        <div className="relative">
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
        </div>
      ) : (
        <div className="relative h-48 sm:h-64 lg:h-80 flex items-center justify-center bg-gray-200 rounded-t-md">
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

      <div className="flex flex-col md:flex-row gap-4 mt-6">
        <div className="md:w-[30%] flex justify-center items-center border-2 h-36 p-4 rounded-lg shadow-sm">
          <div className="text-center">
            <p className="text-lg font-medium">Class Code</p>
            <p className="text-2xl font-bold">{classData?.class_code || "N/A"}</p>
          </div>
        </div>

        <div className="md:w-[70%] flex flex-col gap-4">
          <div className="flex gap-4">
            <button className="w-full bg-purple-50 text-purple-700 font-medium rounded-lg p-2 flex items-center justify-center shadow-sm">
              <FontAwesomeIcon icon={faCameraAlt} className="mr-2" />
              Start a Class Call
            </button>
            <button
              className="w-full bg-purple-950 text-white font-medium text-[0.8rem] rounded-lg p-2 flex items-center justify-center shadow-sm"
              onClick={handleAnnouncementClick}
            >
              <FontAwesomeIcon icon={faPaperclip} className="mr-2 " />
              Make Announcement
            </button>
          </div>

          <AnnouncmentHome key={newAnnouncement}/>
        </div>
      </div>

      {showAnnouncementModal && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4 text-purple-900">Make Announcement</h2>
            <textarea
              className="w-full p-2 border rounded-md bg-purple-300 active:border-purple-900"
              rows="4"
              placeholder="Write your announcement..."
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}

            />
            <div className="flex justify-end mt-4">
              <button
                className="mr-2 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-md transition duration-300 ease-in-out"
                onClick={handleCloseAnnouncementModal}
              >
                Cancel
              </button>
              <button onClick = {handleMakeAnnouncement} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition duration-300 ease-in-out">
                Submit
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TeachersClassHome
