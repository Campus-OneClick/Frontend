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