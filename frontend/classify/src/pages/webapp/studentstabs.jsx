import DashboardLayout from "../../components/UI/dashboardlayout";
import StudentTabLayout from "../../components/UI/studentTabLayout";
import StudentClassHome from "./studentcClassHome";
const StudentViewClass = () =>{
    return (
        <DashboardLayout>
        <StudentTabLayout>
            <StudentClassHome />
            <p>Class Works</p>
            <p>People</p>
            <p>Grade Book</p>
        </StudentTabLayout>
        </DashboardLayout>
    )
}

export default StudentViewClass