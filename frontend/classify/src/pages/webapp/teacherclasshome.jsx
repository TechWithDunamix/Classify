import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import { api } from "../../utils";

const TeachersClassHome = () => {
    const { id } = useParams();
    const [classData, setClassData] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [image, setImage] = useState(null);

    const fetchData = () => {
        api.get(
            `/class/${id}`, 
            {}, 
            50000,
            (data, status) => {
                console.log(data);
                setClassData(data);
            },
            (error, data) => {
                console.error("Fetch error:", error);
            },
            (error) => {
                alert("Error: Request timed out");
            }
        );
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (classData) {
            document.title = classData.name;
        }
    }, [classData]);

    const handleCustomizeClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!image) {
            alert("Please select an image before submitting.");
            return;
        }

        const formData = new FormData();
        formData.append("cover", image);
        console.log(Array.from(formData.entries()))
        
        api.put(
            `/class/${id}`,
            formData,
            {},
            50000,
            (data, status) => {
                console.log(data);
                // Update classData with the new cover image URL
                setClassData((prevData) => ({
                    ...prevData,
                    cover_image_url: data.cover_image_url // assuming this is the key returned by the API
                }));
                setShowModal(false); // Close the modal after successful upload
            },
            (error, status) => {
                console.error("Upload error:", error);
            },
            (error) => {
                alert("Request Timeout");
            }
        );
    };

    return (
        <div className="p-4">
            {classData?.cover_image_url ? (
                <div className="relative">
                    <div
                        className="h-48 sm:h-56 lg:h-64 bg-cover bg-center rounded-t-md"
                        style={{ backgroundImage: `url(${classData.cover_image_url})` }}
                    ></div>
                    <button
                        className="absolute top-2 right-2 bg-purple-600 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-md"
                        onClick={handleCustomizeClick}
                    >
                        <FontAwesomeIcon icon={faPen} className="mx-2" />
                        Customize
                    </button>

                    <p className="bg-black px-3 py-4 absolute bottom-0 text-purple-50 right-1 m-3">
                        Total Students: {classData?.members?.length || 0}
                    </p>
                </div>
            ) : (
                <div className="relative h-48 sm:h-56 lg:h-64 flex items-center justify-center bg-gray-200 rounded-t-md">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-32 w-32 sm:h-40 sm:w-40 lg:h-48 lg:w-48 text-gray-400"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <text
                            x="50%"
                            y="50%"
                            dominantBaseline="middle"
                            textAnchor="middle"
                            fontSize="24"
                            fill="gray"
                        >
                            {classData?.name?.split(' ').map((word) => word[0]).join('')}
                        </text>
                    </svg>
                    <button
                        className="absolute top-2 right-2 bg-purple-600 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-md"
                        onClick={handleCustomizeClick}
                    >
                        <FontAwesomeIcon icon={faPen} className="mx-2" />
                        Customize
                    </button>

                    <p className="absolute bottom-0 text-purple-950 right-1 m-3">
                        Total Students: {classData?.members?.length || 0}
                    </p>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-lg font-bold mb-4 text-purple-900">Customize Class Image</h2>
                        <div>
                            <div className="mb-4">
                                <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700">
                                    Upload Cover Image
                                </label>
                                <input
                                    type="file"
                                    id="coverImage"
                                    name="cover_image"
                                    className="mt-1 p-2 w-full border rounded-md"
                                    onChange={(e) => setImage(e.target.files[0])}
                                />
                            </div>
                            
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="mr-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleFormSubmit}
                                    type="submit"
                                    className="px-4 py-2 bg-purple-600 text-white rounded-md"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeachersClassHome;
