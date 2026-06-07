import React from "react";

const classrooms = [
  { id: "공1201", top: "18%", left: "30%" },
  { id: "공1202", top: "18%", left: "65%" },
  { id: "공1203", top: "40%", left: "70%" },
  { id: "공1204", top: "60%", left: "30%" },
  { id: "공1205", top: "75%", left: "70%" },
];

export default function Floor2Map({ onSelectRoom }) {
  return (
    <div style={{ position: "relative", width: "600px" }}>
      
      {/* 도식도 */}
      <img
        src="/floor2.png"
        alt="2층 도면"
        style={{ width: "100%" }}
      />

      {/* 강의실 버튼 */}
      {classrooms.map((room) => (
        <button
          key={room.id}
          onClick={() => onSelectRoom(room.id)}
          style={{
            position: "absolute",
            top: room.top,
            left: room.left,
            transform: "translate(-50%, -50%)",
            padding: "6px 10px",
            backgroundColor: "green",
            color: "white",
            border: "none",
            borderRadius: "20px",
            cursor: "pointer",
          }}
        >
          {room.id}
        </button>
      ))}
    </div>
  );
}