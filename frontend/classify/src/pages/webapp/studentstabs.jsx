import DashboardLayout from "../../components/UI/dashboardlayout";
import StudentTabLayout from "../../components/UI/studentTabLayout";
import StudentClassHome from "./studentcClassHome";
import StudentClassClassWork from "./studentclasswork";
import StudentGrades_ from "./studentgrade";
import ChatBubble from "../../components/widgets/chat";
const StudentViewClass = () =>{
    return (
        <DashboardLayout>
        <StudentTabLayout>
            <StudentClassHome />
            
            <StudentClassClassWork />
            <ChatBubble />
            <StudentGrades_ />
        </StudentTabLayout>
        {/* <ChatBubble /> */}
        </DashboardLayout>
    )
}

export default StudentViewClass