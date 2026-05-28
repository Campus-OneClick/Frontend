import React, { useState } from 'react';
import './ClassroomModal.css';

export default function ClassroomModal({ classrooms, setClassrooms, onClose }) {
  const [newRoom, setNewRoom] = useState("");

  const addRoom = () => {
    if (!newRoom) return;
    setClassrooms([...classrooms, { id: `r_${Date.now()}`, name: newRoom }]);
    setNewRoom("");
  };

  const deleteRoom = (id) => {
    if (window.confirm("이 강의실을 삭제하면 기존 시간표 데이터와 연동에 문제가 생길 수 있습니다. 삭제하시겠습니까?")) {
      setClassrooms(classrooms.filter(r => r.id !== id));
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>강의실 관리</h2>

        <div className="input-group">
          <input
            type="text"
            placeholder="새 강의실 이름"
            value={newRoom}
            onChange={(e) => setNewRoom(e.target.value)}
          />
          <button className="save-btn" onClick={addRoom}>추가</button>
        </div>

        <ul className="room-list">
          {classrooms.map(room => (
            <li key={room.id} className="room-item">
              {room.name}
              <button className="del-btn" onClick={() => deleteRoom(room.id)}>삭제</button>
            </li>
          ))}
        </ul>

        <button className="close-btn" onClick={onClose}>닫기</button>
      </div>
    </div>
  );
}