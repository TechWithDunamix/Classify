import { useParams } from "react-router-dom";
import { api } from "../../utils";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

const TeachersClassHome = () => {
    const { id } = useParams();
    const [classData, setClassData] = useState(null);

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
                console.log(error);
            },
            (error) => {
                alert("Error timed out");
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
        // Implement your logic to allow users to edit the picture
        alert('Customize button clicked!');
    };

    return (
        <div className="p-4">
            {classData?.image_url ? (
                <div className="relative">
                    <div
                        className="h-48 sm:h-56 lg:h-64 bg-cover bg-center rounded-t-md"
                        style={{ backgroundImage: `url(${classData.image_url})` }}
                    ></div>
                    <button
                        className="absolute top-2 right-2 bg-purple-600 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-md"
                        onClick={handleCustomizeClick}
                    >
                        Customize
                    </button>
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
                            {classData && classData.name.split(' ').map((word) => word[0]).join('')}
                        </text>
                    </svg>
                    <button
                        className="absolute top-2 right-2 bg-purple-600 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-md"
                        onClick={handleCustomizeClick}
                    >   <FontAwesomeIcon icon={faPen} className="mx-2" />
                        Customize
                    </button>

                    <p className="absolute bottom-0 text-purple-950 right-1 m-3">Total Students : : {classData && classData.members.length}</p>
                </div>
            )}
        </div>
    );
};

export default TeachersClassHome;
