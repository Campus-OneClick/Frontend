import { useState } from "react";
import BasementMap from "../maps/BasementMap";
import Floor2Map from "../maps/Floor2Map";
import Floor3Map from "../maps/Floor3Map";
import Floor4Map from "../maps/Floor4Map";

export default function ClassroomReservationPage() {
  const [floor, setFloor] = useState("B1");

  const handleSelectRoom = (room) => {
    alert(room + " 선택됨");
  };

  return (
    <div>
      <h1>강의실 예약</h1>

      {/* 층 선택 */}
      <button onClick={() => setFloor("B1")}>지하</button>
      <button onClick={() => setFloor("2F")}>2층</button>
      <button onClick={() => setFloor("3F")}>3층</button>
      <button onClick={() => setFloor("4F")}>4층</button>

      {/* 지도 */}
      {floor === "B1" && <BasementMap onSelectRoom={handleSelectRoom} />}
      {floor === "2F" && <Floor2Map onSelectRoom={handleSelectRoom} />}
      {floor === "3F" && <Floor3Map onSelectRoom={handleSelectRoom} />}
      {floor === "4F" && <Floor4Map onSelectRoom={handleSelectRoom} />}
    </div>
  );
}