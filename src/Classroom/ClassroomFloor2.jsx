import React, { useState } from "react";
import ClassroomModal from "./ClassroomModal";
import floor2Image from "./floor2.png"


export default function ClassroomFloor2() {
  const [selectedRoom, setSelectedRoom] = useState(null);

  return (
    <div className="container">
      <h1>2층 강의실 안내</h1>
      <p>도면에서 강의실을 선택하세요</p>

      <div className="map_wrapper">
        <img src={floor2Image} alt="2층 도면" className="floor_img" />

        {/* 강의실 버튼 */}
        <button
          className="pin"
          style={{ top: "25%", left: "30%" }}
          onClick={() => setSelectedRoom("공1201")}
        >
          공1201
        </button>

        <button
          className="pin"
          style={{ top: "25%", left: "50%" }}
          onClick={() => setSelectedRoom("공1202")}
        >
          공1202
        </button>

        <button
          className="pin"
          style={{ top: "25%", left: "70%" }}
          onClick={() => setSelectedRoom("공1203")}
        >
          공1203
        </button>
      </div>

      {/*선택됐을 때만 모달 렌더링 */}
      {selectedRoom && (
        <ClassroomModal
          roomId={selectedRoom}
          onClose={() => setSelectedRoom(null)}
        />
      )}
    </div>
  );
}
