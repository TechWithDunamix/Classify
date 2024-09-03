import DashboardLayout from "../../components/UI/dashboardlayout";
import StudentTabLayout from "../../components/UI/studentTabLayout";
import StudentClassHome from "./studentcClassHome";
import StudentClassClassWork from "./studentclasswork";
import StudentGrades_ from "./studentgrade";
const StudentViewClass = () =>{
    return (
        <DashboardLayout>
        <StudentTabLayout>
            <StudentClassHome />
            <StudentClassClassWork />
            <p>People</p>
            <StudentGrades_ />
        </StudentTabLayout>
        </DashboardLayout>
    )
}

export default StudentViewClass