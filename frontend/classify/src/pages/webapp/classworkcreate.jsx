import DashboardLayout from "../../components/UI/dashboardlayout";
import { useParams } from "react-router-dom";
import { useState } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { api } from "../../utils.js";
import Loader from "../../components/widgets/loader.jsx";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

const CreateClassWork = () => {
    const { id } = useParams();
    const [title, setTitle] = useState("");
    const [value, setValue] = useState("");
    const [dateDue, setDateDue] = useState(null);
    const [classworkType, setClassworkType] = useState("ClassWork");
    const [mark, setMark] = useState("");
    const [files, setFiles] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [newUrl, setNewUrl] = useState("");
    const [isDraft, setIsDraft] = useState(false); 
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleAddUrl = () => {
        if (newUrl.trim()) {
            setFiles([...files, newUrl]);
            setNewUrl("");
            setModalOpen(false);
        }
    };

    const handleRemoveUrl = (index) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!title.trim()) newErrors.title = "Title is required.";
        if (!value.trim()) newErrors.value = "Instructions are required.";
        if (!mark.trim()) {
            newErrors.mark = "Marks are required.";
        } else if (!Number.isInteger(Number(mark))) {
            newErrors.mark = "Marks must be an integer.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;

        setIsLoading(true);
        const data = {
            title,
            question: value,
            classwork_type: classworkType,
            mark,
            _files: files.length ? files : [],
            draft: isDraft, 
        };
        if (dateDue){
            data.date_due = dateDue
        }
        api.post(`/class/assignment?class_id=${id}`, data, {}, 5000,
            (data, status) => {
                console.log(data);
                setIsLoading(false);
                window.location.href = `/class/view/${id}`
            },
            (error, status) => {
                if (status === 404) {
                    window.location.href = "/not-found";
                }

                if (status === 400) {
                    toast.error("Error 400 : Bad request");
                    setIsLoading(false);
                }
            },
            (error) => {
                toast.error("Server is too slow, try refreshing");
                setIsLoading(false);
            }
        );
        console.log(data);
    };

    return (
        <DashboardLayout>
            <div className="flex justify-center items-center min-h-screen p-4 bg-gray-50">
                <div className="max-w-4xl w-full bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-2xl font-semibold mb-6">Create Class Work</h2>

                    <input
                        className={`bg-gray-100 w-full py-3 px-4 mb-4 border rounded-lg focus:outline-none focus:ring-2 ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="ClassWork Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    {errors.title && <p className="text-red-500 text-sm mb-2">{errors.title}</p>}

                    <p className="mb-4 text-gray-600">Add Class Work Instructions</p>
                    <ReactQuill
                    value={value} onChange={setValue} className={`mb-6 h-[250px]  rounded-lg mb-24`} />
                    {errors.value && <p className="text-red-500 text-sm mb-2">{errors.value}</p>}

                    <input
                        type="number"
                        className={`bg-gray-100 mt-8 w-full py-3 px-4 mb-4 border rounded-lg focus:outline-none focus:ring-2 ${errors.mark ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Marks"
                        value={mark}
                        onChange={(e) => setMark(e.target.value)}
                    />
                    {errors.mark && <p className="text-red-500 text-sm mb-2">{errors.mark}</p>}

                    <div className="py-4">
                        <p className="text-gray-600 mb-2">Date Due</p>
                        <input
                            type="datetime-local"
                            className={`bg-gray-100 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 ${errors.dateDue ? 'border-red-500' : 'border-gray-300'}`}
                            value={dateDue}
                            onChange={(e) => setDateDue(e.target.value)}
                        />
                        {errors.dateDue && <p className="text-red-500 text-sm mb-2">{errors.dateDue}</p>}
                    </div>

                    <div className="my-6">
                        <p className="text-gray-600 mb-2">Files</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {files.map((file, index) => (
                                <span key={index} className="bg-gray-200 p-2 rounded-lg flex items-center text-sm">
                                    {file}
                                    <button
                                        className="ml-2 text-red-500 hover:text-red-700"
                                        onClick={() => handleRemoveUrl(index)}
                                    >
                                        &times;
                                    </button>
                                </span>
                            ))}
                        </div>
                        <button
                            className="btn bg-purple-700 text-white py-2 px-4 rounded-lg hover:bg-purple-800 transition"
                            onClick={() => setModalOpen(true)}
                        >
                            Add File URL
                        </button>
                    </div>

                    {modalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                                <h2 className="text-xl font-semibold mb-4">Add File URL</h2>
                                <input
                                    className="bg-gray-100 w-full py-2 px-3 mb-4 border rounded-lg focus:outline-none focus:ring-2"
                                    placeholder="Enter URL"
                                    value={newUrl}
                                    onChange={(e) => setNewUrl(e.target.value)}
                                />
                                <div className="flex gap-2">
                                    <button
                                        className="btn bg-purple-700 text-white py-2 px-4 rounded-lg hover:bg-purple-800 transition"
                                        onClick={handleAddUrl}
                                    >
                                        Add
                                    </button>
                                    <button
                                        className="btn bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition"
                                        onClick={() => setModalOpen(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Draft Switch */}
                    <div className="flex items-center my-6">
                        <label htmlFor="draft-switch" className="mr-3 text-gray-600">Save as Draft</label>
                        <input
                            type="checkbox"
                            id="draft-switch"
                            checked={isDraft}
                            onChange={(e) => setIsDraft(e.target.checked)}
                            className="form-checkbox h-5 w-5 text-purple-600 transition duration-150 ease-in-out"
                        />
                    </div>

                    <button
                        className="btn bg-purple-700 text-white py-2 px-4 rounded-lg hover:bg-purple-800 transition mt-6"
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>

                    {isLoading && <Loader />}
                </div>
            </div>
        </DashboardLayout>
    );
}

export default CreateClassWork;
