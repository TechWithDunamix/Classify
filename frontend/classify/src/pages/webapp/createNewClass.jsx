import React, { useState } from "react";
import DashboardLayout from "../../components/UI/dashboardlayout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceMeh, faPen, faUserFriends, faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import { api } from "../../utils";
import Loader from "../../components/widgets/loader";
import { toast } from "react-toastify";
const CreateNewClass = () => {
    const [isLoading,setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        setIsLoading(true)
        e.preventDefault();
        console.log(formData);
        api.post("/class",formData,{},50000,
            (data,status) => {
                console.log(status);
               window.location.href = "/d"

            },
            (err,status) => {
                console.log(err)
                setIsLoading(false)
            }
        )
    };

    // Check if all fields are filled
    const isFormValid = formData.name && formData.description && formData.category;

    return (
        <DashboardLayout>
            <div className="flex flex-2 justify-between mx-2 md:mx-4 items-center">
                <button className="bg-transparent text-purple-700 px-2 py-2 border-2 btn">
                    <Link to={"/d"}>
                        <FontAwesomeIcon icon={faArrowAltCircleLeft} />
                        Back
                    </Link>
                </button>

                <p className="mt-4 text-slate-800">Create new class</p>
            </div>

            <div className="max-w-md mx-auto p-4 bg-white rounded-lg">
                <h2 className="text-[1rem] text-slate-800 mb-4">Your Teaching journey starts !!</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-control mb-4">
                        <label className="label">
                            <span className="label-text flex items-center">
                                <FontAwesomeIcon icon={faPen} className="mr-2" />
                                Name
                            </span>
                        </label>
                        <p className="font-extralight text-slate-400 my-4 text-[0.8em]">
                            The class name is the name on top of your class when users join.
                        </p>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter Your class Name"
                            className="input input-bordered w-full"
                            value={formData.className}
                            onChange={handleChange}
                        />
                        <span className="text-red-500 text-sm my-2">This field is required.</span>
                    </div>

                    <div className="form-control mb-4">
                        <label className="label">
                            <span className="label-text flex items-center">
                                <FontAwesomeIcon icon={faFaceMeh} className="mr-2" />
                                Description
                            </span>
                        </label>
                        <p className="font-extralight text-slate-400 my-4 text-[0.8em]">
                            Elegantly describe your class details, features, etc.
                        </p>
                        <textarea
                            name="description"
                            placeholder="Enter description"
                            className="textarea textarea-bordered w-full"
                            value={formData.description}
                            onChange={handleChange}
                        />
                        <span className="text-red-500 text-sm my-2">This field is required.</span>
                    </div>

                    <div className="form-control mb-4">
                        <label className="label">
                            <span className="label-text flex items-center">
                                <FontAwesomeIcon icon={faUserFriends} className="mr-2" />
                                Category
                            </span>
                        </label>
                        <p className="font-extralight text-slate-400 my-4 text-[0.8em]">
                            What is your niche?
                        </p>
                        <input
                            type="text"
                            name="category"
                            placeholder="Enter category"
                            className="input input-bordered w-full"
                            value={formData.category}
                            onChange={handleChange}
                        />
                        <span className="text-red-500 text-sm my-2">This field is required.</span>
                    </div>

                    <div className="form-control">
                        <button 
                            type="submit" 
                            className="btn bg-purple-800 text-white w-full rounded-none rounded-b-md rounded-r-md"
                            disabled={!isFormValid} // Disable button if form is not valid
                        >
                            Submit
                        </button>
                        {isLoading && <Loader />}
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default CreateNewClass;
