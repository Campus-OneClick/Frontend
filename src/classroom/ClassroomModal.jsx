import React, { useState } from "react";
import TimetableModal from "./TimetableModal";

export default function ClassroomModal({ roomId, onClose }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="modal">
      <h2>{roomId}</h2>
      <p>수용 인원: 30명</p>
      <p>빔프로젝터 있음</p>

      <button onClick={onClose}>닫기</button>

      <button onClick={() => setOpen(true)}>
        예약하기
      </button>

      {open && (
        <TimetableModal
          roomId={roomId}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}