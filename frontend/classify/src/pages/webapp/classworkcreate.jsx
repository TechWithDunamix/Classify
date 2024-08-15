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
    const [dateDue, setDateDue] = useState("");
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
        if (!dateDue) newErrors.dateDue = "Date Due is required.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;

        setIsLoading(true);
        const data = {
            title,
            question: value,
            date_due: dateDue,
            classwork_type: classworkType,
            mark,
            _files: files.length ? files : [],
            draft: isDraft, 
        };

        api.post(`/class/assignment?class_id=${id}`, data, {}, 5000,
            (data, status) => {
                console.log(data);
                setIsLoading(false);
                window.location.href = `/class/view/${id}`

            },
            (error, status) => {
                
                if (status === 404){
                    window.location.href = "/not-found"
                }

                if (status === 400){
                    toast.error("Error 400 : Bad request")
                    setIsLoading(false)
                }
            },
            (error) => {
                toast.error("Sever is to slow , try refreshing")
                setIsLoading(false);
            }
        );
        console.log(data);
    };

    return (
        <DashboardLayout>
            <div className="flex justify-center items-center">
                <div className="h-[60%] md:w-[60%] p-2">
                    <h2 className="text-xl font-bold mb-4">Create Class Work</h2>

                    <input
                        className={`bg-white w-full py-4 px-2 my-4 border-2 ${errors.title ? 'border-red-600' : ''}`}
                        placeholder="ClassWork Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    {errors.title && <p className="text-red-600">{errors.title}</p>}

                    <p className="mb-4">Add Class Work Instructions</p>
                    <ReactQuill value={value} onChange={setValue} className={`h-32 mb-12 ${errors.value ? 'border-red-600' : ''}`} />
                    {errors.value && <p className="text-red-600">{errors.value}</p>}

                    <input
                        type="number"
                        className={`bg-white w-full py-4 px-2 my-4 border-2 ${errors.mark ? 'border-red-600' : ''}`}
                        placeholder="Marks"
                        value={mark}
                        onChange={(e) => setMark(e.target.value)}
                    />
                    {errors.mark && <p className="text-red-600">{errors.mark}</p>}

                    <div className="py-4">
                        <p className="text-slate-700 my-3">Date Due</p>
                        <input
                            type="datetime-local"
                            className={`date bg-white py-2 w-full border-2 ${errors.dateDue ? 'border-red-600' : ''}`}
                            value={dateDue}
                            onChange={(e) => setDateDue(e.target.value)}
                        />
                        {errors.dateDue && <p className="text-red-600">{errors.dateDue}</p>}
                    </div>

                    <div className="my-4">
                        <p className="text-slate-700 my-3">Files</p>
                        <div className="flex flex-wrap">
                            {files.map((file, index) => (
                                <span key={index} className="bg-gray-200 p-2 m-1 rounded-lg flex items-center">
                                    {file}
                                    <button
                                        className="ml-2 text-red-600"
                                        onClick={() => handleRemoveUrl(index)}
                                    >
                                        &times;
                                    </button>
                                </span>
                            ))}
                        </div>
                        <button
                            className="btn bg-purple-800 text-white mt-4"
                            onClick={() => setModalOpen(true)}
                        >
                            Add File URL
                        </button>
                    </div>

                    {modalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                            <div className="bg-white p-4 rounded-lg">
                                <h2 className="text-xl font-bold mb-4">Add File URL</h2>
                                <input
                                    className="bg-white w-full py-2 px-2 mb-4 border-2"
                                    placeholder="Enter URL"
                                    value={newUrl}
                                    onChange={(e) => setNewUrl(e.target.value)}
                                />
                                <button
                                    className="btn bg-purple-800 text-white mr-2"
                                    onClick={handleAddUrl}
                                >
                                    Add
                                </button>
                                <button
                                    className="btn bg-gray-600 text-white"
                                    onClick={() => setModalOpen(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Draft Switch */}
                    <div className="flex items-center my-4">
                        <label htmlFor="draft-switch" className="mr-2 text-slate-700">Save as Draft</label>
                        <input
                            type="checkbox"
                            id="draft-switch"
                            checked={isDraft}
                            onChange={(e) => setIsDraft(e.target.checked)}
                            className="toggle-switch"
                        />
                    </div>

                    <button
                        className="btn bg-purple-800 text-white mt-8"
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
