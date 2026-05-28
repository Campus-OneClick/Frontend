import React, { useState } from "react";
import "../styles/layout.css";

import BasementMap from "../components/maps/BasementMap";
import Floor2Map from "../components/maps/Floor2Map";
import Floor3Map from "../components/maps/Floor3Map";
import Floor4Map from "../components/maps/Floor4Map";

import ClassroomModal from "../components/common/ClassroomModal";

export default function ClassroomReservationPage() {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [floor, setFloor] = useState("2");

  return (
    <div className="App">
      <h1>강의실 예약 시스템</h1>

      <div className="floor-buttons">
        <button onClick={() => setFloor("B1")}>지하</button>
        <button onClick={() => setFloor("2")}>2층</button>
        <button onClick={() => setFloor("3")}>3층</button>
        <button onClick={() => setFloor("4")}>4층</button>
      </div>

      {floor === "B1" && <BasementMap onSelectRoom={setSelectedRoom} />}
      {floor === "2" && <Floor2Map onSelectRoom={setSelectedRoom} />}
      {floor === "3" && <Floor3Map onSelectRoom={setSelectedRoom} />}
      {floor === "4" && <Floor4Map onSelectRoom={setSelectedRoom} />}

      {selectedRoom && (
        <ClassroomModal
          roomId={selectedRoom}
          onClose={() => setSelectedRoom(null)}
        />
      )}
    </div>
  );
}