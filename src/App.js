import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./Login/Login";
import MainPage from "./MainPage/Mainpage";
import { Floor1 } from "./Floor1/Floor1";
import AdminMain from "./admin/Main";
import ClassroomPage from "./Classroom/ClassroomPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/floor1" element={<Floor1 />} />
        <Route path="/admin" element={<AdminMain />} />
        <Route path="/classrooms" element={<ClassroomPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
