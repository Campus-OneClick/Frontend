import { useState } from "react";
import BasementMap from "../maps/BasementMap";
import Floor2Map from "../maps/Floor2Map";
import Floor3Map from "../maps/Floor3Map";
import Floor4Map from "../maps/Floor4Map";
import ClassroomModal from "../common/ClassroomModal";
import CoordinatePicker from "../CoordinatePickers";

export default function MainPage() {
  const [floor, setFloor] = useState("B1");
  const [selectedRoom, setSelectedRoom] = useState(null);

  return (
    <div>
      <CoordinatePicker />
      <h1>강의실 예약</h1>

      <button onClick={() => setFloor("B1")}>지하</button>
      <button onClick={() => setFloor("2F")}>2층</button>
      <button onClick={() => setFloor("3F")}>3층</button>
      <button onClick={() => setFloor("4F")}>4층</button>

      {floor === "B1" && (
        <BasementMap onSelectRoom={setSelectedRoom} />
      )}
      {floor === "2F" && (
        <Floor2Map onSelectRoom={setSelectedRoom} />
      )}
      {floor === "3F" && (
        <Floor3Map onSelectRoom={setSelectedRoom} />
      )}
      {floor === "4F" && (
        <Floor4Map onSelectRoom={setSelectedRoom} />
      )}

      <ClassroomModal
        roomId={selectedRoom?.id}
        onClose={() => setSelectedRoom(null)}
      />
    </div>
  );
}