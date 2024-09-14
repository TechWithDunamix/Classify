// App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import SignUpForm from './components/signupform';
import DashboardHome from './pages/webapp/dashboardhome';
import PrivateRoute from './pages/protectedroutes';
import ProfilePage from './pages/webapp/profile';
import CreateNewClass from './pages/webapp/createNewClass';
import TeacherViewClass from './pages/webapp/teachertabs';
import CreateClassWork from './pages/webapp/classworkcreate';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotFoundPage from './pages/404';
import LandingPage from './pages/site/landing';
import TopicView from './pages/webapp/topicView';
import StudentViewClass from './pages/webapp/studentstabs';
import ClassworkSubmitions from './pages/webapp/classworksubmitons';
import ClassworkPage from './pages/webapp/teachersubmitionpage';
import StudentGrades from './pages/webapp/studentsgrade';
import PostDetail from './pages/webapp/morestream';
import VideoCallComponent from './pages/webapp/videocall';
import StudentVideoCallComponent from './pages/webapp/studentVideoCall';
import ChatbotIframe from './pages/webapp/bot';
import WaitingPage from './pages/site/auth/confirmemail';
import EmailConfirmation from './pages/site/auth/activateAccount';
import ChangeEmailPassword from './pages/site/auth/changeEmaillPassword';
function App() {
  
  return (
    
    <BrowserRouter>
      <ToastContainer />
      <Routes>
      <Route index element={<LandingPage />} />

        <Route path='*' element={<NotFoundPage />} />

        <Route path="signup" element={<SignUpForm />} />
        <Route path="d" element={<PrivateRoute element={<DashboardHome />} />} />
        <Route path="profile" element={<PrivateRoute element={<ProfilePage />} />} />
        <Route path="class/new" element={<PrivateRoute element={<CreateNewClass />} />} />
        <Route path="class/view/:id" element={<PrivateRoute element={<TeacherViewClass />} />} />
        <Route path="class/cw/create/:id" element={<PrivateRoute element={<CreateClassWork />} />} />
        <Route path='class/:id/topic' element={<PrivateRoute element={<TopicView />} />} />
        <Route path='s/:id' element={<PrivateRoute element={<StudentViewClass />} />} />
        <Route path='classwork' element={<PrivateRoute element={<ClassworkSubmitions />} />} />
        <Route path='classwork/:id' element={<PrivateRoute element={<ClassworkPage />} />} />
        <Route path="stream/detail/:id" element={<PrivateRoute element={<PostDetail />} />} />
        <Route path="chatbot" element={<ChatbotIframe />}  />        
        <Route path="waiting" element={<WaitingPage />}  />
        <Route path="auth/confirm/:id/:token" element={<EmailConfirmation />}  />        
        <Route path="auth/change/email-password" element={<ChangeEmailPassword />}  />        





      </Routes>
    </BrowserRouter>
  );
}

export default App;
