import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./Login/Login";
import MainPage from "./MainPage/Mainpage";
import { Floor1 } from "./Floor1/Floor1";
import AdminMain from "./admin/Main";
import ClassroomModal  from "./Classroom/ClassroomModal";
import MyInfoPage from "./MyInfo/MyInfoPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/floor1" element={<Floor1 />} />
        <Route path="/floor1/:lounge" element={<Floor1 />} />
        <Route path="/admin" element={<AdminMain />} />
        <Route path="/classrooms" element={<ClassroomModal />} />
        <Route path="/my-info" element={<MyInfoPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
