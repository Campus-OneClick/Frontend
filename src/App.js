<<<<<<< HEAD
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Floor2Map from "./maps/Floor2Map";
import Floor3Map from "./maps/Floor3Map";
import Floor4Map from "./maps/Floor4Map";
import Basement from "./maps/BasementMap";

import TimeTablePage from "./pages/TimeTablePage";

export default function App() {
  return (
   <div>
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<Floor2Map />} />
        <Route path="/floor3" element={<Floor3Map />} />
        <Route path="/floor4" element={<Floor4Map />} />
        <Route path="/basement" element={<Basement />} />

        <Route path="/timetable/:roomId" element={<TimeTablePage />} />
      </Routes>
    </BrowserRouter>
   </div>
  );
}
=======
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
        <Route path="/admin" element={<AdminMain />} />
        <Route path="/classrooms" element={<ClassroomModal />} />
        <Route path="/my-info" element={<MyInfoPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
>>>>>>> a1cdfe68d701592594529459ad17efb71bcb4da1
