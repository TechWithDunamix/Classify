// App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import VideoCall from './pages/webrtc';
import LandingPage from './pages/site/landing';
import TopicView from './pages/webapp/topicView';
import StudentViewClass from './pages/webapp/studentstabs';
import ClassworkSubmitions from './pages/webapp/classworksubmitons';
import ClassworkPage from './pages/webapp/teachersubmitionpage';
function App() {
  
  return (
    
    <BrowserRouter>
      <ToastContainer />
      <Routes>
      <Route index element={<LandingPage />} />

        <Route path='*' element={<NotFoundPage />} />
        <Route path="vid" element={<VideoCall />}  />

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





      </Routes>
    </BrowserRouter>
  );
}

export default App;
