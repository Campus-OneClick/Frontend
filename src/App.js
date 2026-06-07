import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Login from "./Login/Login";
import MainPage from "./MainPage/Mainpage";
import { Floor1 } from "./Floor1/Floor1";
import AdminMain from "./admin/Main";
import ClassroomModal  from "./Classroom/ClassroomModal";
import MyInfoPage from "./MyInfo/MyInfoPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <PageRoutes />
    </BrowserRouter>
  );
}

function PageRoutes() {
  const location = useLocation();

  return (
    <main className="page-transition-shell" key={location.pathname}>
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
    </main>
  );
}

export default App;
