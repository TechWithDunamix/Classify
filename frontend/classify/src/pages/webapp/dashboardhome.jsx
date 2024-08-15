import DashboardLayout from "../../components/UI/dashboardlayout";
import { api } from "../../utils";
import { useState, useEffect } from "react";
import Loader from "../../components/widgets/loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceMeh, faPen, faUserFriends, faPenSquare } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import ClassCard from "../../components/widgets/teachersClassCard";
const DashboardHome = () => {
    const [classList, setClassList] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const fetchCLass = () => {
        api.get("/class", {}, 5000,
            (data, status) => {
                setClassList(data);
            },
            (error, status) => {
                alert("Error");
            },
            (error) => {
                alert("Network error timed out");
            }
        );
    };

    useEffect(() => {
        fetchCLass();
    }, []);

    if (!classList) {
        return (
            <DashboardLayout>
                <div className="min-h-[70vh] flex justify-center items-center">
                    <div>
                        <Loader />
                        <p className="mt-5 text-slate-700">Loading your class list</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (classList.length === 0) {
        return (
            <DashboardLayout>
                <div className="min-h-[70vh] flex justify-center items-center">
                    <div className="text-center">
                        <FontAwesomeIcon icon={faFaceMeh} className="w-20 h-20 text-purple-300"/>
                        <p className="mt-5 text-slate-700">Your class list is empty</p>
                        <div className="flex flex-2 mt-12 justify-between gap-14">
                            <button className="btn bg-purple-900 px-4 py-2 text-white font-extralight">
                                <FontAwesomeIcon icon={faUserFriends} />
                                Join
                            </button>
                            <button className="btn bg-white px-4 py-2 border-2 border-purple-900 text-purple-900">
                                <FontAwesomeIcon icon={faPen} />
                                <Link to='/class/new'>Create</Link>
                            </button>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            
            <div className="">
                <button 
                    className="flex items-center btn rounded-full text-purple-600  p-4 bg-purple-200 font-extralight ml-auto"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                > Classes
                    <FontAwesomeIcon icon={faPenSquare} />
                </button>
                {isDropdownOpen && (
                    <div className="mr-8  bg-white shadow-lg rounded-lg z-50 absolute right-0">
                        <ul className="p-2">
                            <li className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer">
                                <FontAwesomeIcon icon={faPen} />
                                <Link to='/class/new'>Create Class</Link>
                            </li>
                            <li className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer ">
                                <FontAwesomeIcon icon={faUserFriends} />
                                <span>Join Class</span>
                            </li>
                        </ul>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
            {classList.map((data, index) => (
            <ClassCard key={index} data={data} />
            ))}
            </div>

            
        </DashboardLayout>
    );
}

export default DashboardHome;
