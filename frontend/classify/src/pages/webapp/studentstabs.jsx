import DashboardLayout from "../../components/UI/dashboardlayout";
import StudentTabLayout from "../../components/UI/studentTabLayout";
import StudentClassHome from "./studentcClassHome";
import StudentClassClassWork from "./studentclasswork";
const StudentViewClass = () =>{
    return (
        <DashboardLayout>
        <StudentTabLayout>
            <StudentClassHome />
            <StudentClassClassWork />
            <p>People</p>
            <p>Grade Book</p>
        </StudentTabLayout>
        </DashboardLayout>
    )
}

export default StudentViewClass