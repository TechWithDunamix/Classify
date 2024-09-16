import DashboardLayout from "../../components/UI/dashboardlayout";
import { api } from "../../utils";
import { useState, useEffect } from "react";
import Loader from "../../components/widgets/loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceMeh, faPen, faUserFriends, faPenSquare } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import ClassCard from "../../components/widgets/teachersClassCard";
import { toast } from "react-toastify";

const DashboardHome = () => {
    const [classList, setClassList] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isJOinModalOpen, setIsJOinModalOpen] = useState(false);
    const [joinClassCode, setJoinClassCode] = useState("");
    const [classNotFound, setClassNOtFound] = useState("");
    const [joinIsLoading, setJoinIsLoading] = useState(false);

    const fetchCLass = () => {
        api.get("/class", {}, 50000,
            (data, status) => {
                setClassList(data);
            },
            (error, status) => {
                toast.error("An error occurred");
            },
            (error) => {
                toast.error("Server is too slow");
            }
        );
    };

    useEffect(() => {
        fetchCLass();
    }, []);

    const handleJoinClass = () => {

        if (joinClassCode.length < 8 || joinClassCode.length > 8) {
            setClassNOtFound("Class Code must be 8 digits.");
            return;
        }

        setJoinIsLoading(true);
        api.post(`/class/join/${joinClassCode}`, {}, {}, 50000,
            (data, status) => {
                let classURL = `/s/${data.class_id}`;

                if (data.code === "001") {
                    toast.success("Welcome to the class.");
                }
                if (data.code === "004") {
                    toast.info("You're already a member of this class.");
                }
                if (data.code === "005") {
                    toast.info("You're already a member of this class.");
                    let teacherUrl = `/class/view/${data.class_id}`;
                    window.location.href = teacherUrl
                    return ;
                    

                    
                }
                setJoinIsLoading(false);
                setIsJOinModalOpen(false);
                window.location.href = classURL;
            },
            (error, status) => {
                if (status === 404) {
                    toast.error(`Class with id "${joinClassCode}" does not exist`);
                    setClassNOtFound("No class has the above joining id.");
                    setJoinIsLoading(false);
                    return;
                }
            },
            (error) => {
                toast.error("Server is not responding");
                setJoinIsLoading(false);
            }
        );
    };

    return (
        <DashboardLayout>
            {/* Join/Create Button at the Top */}
            <div className="flex justify-end">
                <button
                    className="flex items-center btn rounded-full text-purple-600 p-4 bg-purple-200 font-extralight"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                    Classes <FontAwesomeIcon icon={faPenSquare} />
                </button>
                {isDropdownOpen && (
                    <div className="mr-8 bg-white shadow-lg rounded-lg z-50 absolute right-0">
                        <ul className="p-2">
                            <li className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer">
                                <FontAwesomeIcon icon={faPen} />
                                <Link to="/class/new">Create Class</Link>
                            </li>
                            <li
                                onClick={() => setIsJOinModalOpen(true)}
                                className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                            >
                                <FontAwesomeIcon icon={faUserFriends} />
                                <span>Join Class</span>
                            </li>
                        </ul>
                    </div>
                )}
            </div>

            {/* Class List or Empty State */}
            {!classList ? (
                <div className="min-h-[70vh] flex justify-center items-center">
                    <div>
                        <Loader />
                        <p className="mt-5 text-slate-700">Loading your class list</p>
                    </div>
                </div>
            ) : classList.length === 0 ? (
                <div className="min-h-[70vh] flex justify-center items-center">
                    <div className="text-center">
                        <FontAwesomeIcon icon={faFaceMeh} className="w-20 h-20 text-purple-300" />
                        <p className="mt-5 text-slate-700">Your class list is empty</p>
                        <div className="flex mt-12 justify-between gap-14">
                            <button
                                onClick={() => setIsJOinModalOpen(true)}
                                className="btn bg-purple-900 px-4 py-2 text-white font-extralight"
                            >
                                <FontAwesomeIcon icon={faUserFriends} /> Join
                            </button>
                            <button className="btn bg-white px-4 py-2 border-2 border-purple-900 text-purple-900">
                                <FontAwesomeIcon icon={faPen} />
                                <Link to="/class/new">Create</Link>
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="h-[100vh] overflow-y-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
                        {classList.map((data, index) => (
                            <ClassCard key={index} data={data} />
                        ))}
                    </div>
                </div>
            )}

            {/* Join Modal */}
            {isJOinModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box min-h-36">
                        <p>Join Class</p>
                        <div className="my-5 px-5">
                            <p className="text-xs">You&apos;re Currently Signed in as</p>
                            <div className="flex items-center gap-4">
                                <p className="bg-purple-900 text-white px-4 py-2 rounded-full">
                                    {localStorage.getItem("email").slice(0, 1).toLocaleUpperCase()}
                                </p>
                                <p>{localStorage.getItem("email")}</p>
                            </div>
                        </div>
                        <div className="border-2 rounded-t-md rounded-r-md p-8">
                            <p>Class Code</p>
                            <p className="text-slate-600">
                                Ask your teacher for the class code, then enter it here.
                            </p>
                            <input
                                onChange={(e) => {
                                    setClassNOtFound("");
                                    setJoinClassCode(e.target.value);
                                }}
                                className="bg-slate-200 border-2 px-3 py-2 w-full rounded-sm"
                                placeholder="Enter class joining code"
                            />
                            <small className="text-red-800">{classNotFound}</small>
                        </div>
                        <div className="my-3">
                            <p>To sign with a class code</p>
                            <ul className="list-disc ml-12 text-xs">
                                <li className="my-2">Use an authorized Classify Account</li>
                                <li>
                                    Use a class code with 5-7 letters or numbers, and no spaces or symbols.
                                </li>
                            </ul>
                            <p className="text-sm mt-4 text-slate-700">
                                If you have any trouble joining the class, contact the class admin or visit
                                our <span className="text-purple-600 cursor-pointer">help center</span>
                            </p>
                        </div>
                        <div className="flex justify-end gap-6">
                            <button
                                onClick={() => setIsJOinModalOpen(false)}
                                className="text-purple-600 px-3 p-2 rounded-sm border-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleJoinClass}
                                className="bg-purple-600 px-6 text-white p-2 rounded-md"
                            >
                                Join
                            </button>
                        </div>
                        {joinIsLoading && <Loader />}
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default DashboardHome;
