import DashboardLayout from "../../components/UI/dashboardlayout";
import { useParams } from "react-router-dom";
import { useState } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const CreateClassWork = () => {
    const { id } = useParams();
    const [title, setTitle] = useState("");
    const [value, setValue] = useState("");
    const [dateDue, setDateDue] = useState("");
    const [classworkType, setClassworkType] = useState("");
    const [mark, setMark] = useState("");
    const [files, setFiles] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [newUrl, setNewUrl] = useState("");

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

    const handleSubmit = () => {
        const data = {
            title,
            question: value,
            date_due: dateDue,
            classwork_type: classworkType,
            mark,
            _files: files.length ? files : null,
        };

        // Make your API call here using the `data`
        console.log(data)
    };

    return (
        <DashboardLayout>
            <div className="flex justify-center items-center">
                <div className="h-[60%] md:w-[60%] p-2">
                    <h2 className="text-xl font-bold mb-4">Create Class Work</h2>

                    <input
                        className="bg-white w-full py-4 px-2 my-4 border-2"
                        placeholder="ClassWork Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <p className="mb-4">Add Class Work Instructions</p>
                    <ReactQuill value={value} onChange={setValue} className="h-32 mb-12" />


                    <input
                        className="bg-white w-full py-4 px-2 my-4 border-2"
                        placeholder="Marks"
                        value={mark}
                        onChange={(e) => setMark(e.target.value)}
                    />

                    <div className="py-4">
                        <p className="text-slate-700 my-3">Date Due</p>
                        <input
                            type="datetime-local"
                            className="date bg-white py-2 w-full border-2"
                            value={dateDue}
                            onChange={(e) => setDateDue(e.target.value)}
                        />
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

                    <button
                        className="btn bg-purple-800 text-white mt-8"
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default CreateClassWork;
