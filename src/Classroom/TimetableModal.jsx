import React, { useEffect, useState } from "react";

export default function TimetableModal({ roomId, onClose }) {
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    fetch(`/api/classrooms/${roomId}/schedule`)
      .then(res => res.json())
      .then(data => setSchedule(data))
      .catch(() => {
        // 테스트용 데이터
        setSchedule([
          { time: "09:00", status: "사용중" },
          { time: "10:00", status: "비어있음" },
        ]);
      });
  }, [roomId]);

  return (
    <div className="modal">
      <h3>{roomId} 시간표</h3>

      {schedule.map((item, i) => (
        <div key={i}>
          {item.time} - {item.status}
        </div>
      ))}

      <button>이 시간 예약</button>
      <button onClick={onClose}>닫기</button>
    </div>
  );
}