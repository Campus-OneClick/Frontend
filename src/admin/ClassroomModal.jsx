import React, { useState } from 'react';
import axios from 'axios';
import './ClassroomModal.css';

const API = process.env.REACT_APP_API_BASE_URL;

export default function ClassroomModal({ classrooms, onClose, onRefresh }) {
  const [newRoom, setNewRoom] = useState("");

  const addRoom = async () => {
  const trimmed = newRoom.trim();
  if (!trimmed) return;

  // 이미 있는 강의실인지 확인
  if (classrooms.some(r => r.roomName === trimmed)) {
    alert("이미 있는 강의실입니다.");
    return;
  }

  try {
    await axios.post(`${API}/classrooms`, {
      classroomId: trimmed.replace(/\s/g, ''),
      roomName: trimmed
    });
    setNewRoom("");
    onRefresh();
  } catch (error) {
    console.error("강의실 추가 실패:", error);
  }
};

  const deleteRoom = async (id) => {
    if (window.confirm("이 강의실을 삭제하면 기존 시간표 데이터와 연동에 문제가 생길 수 있습니다. 삭제하시겠습니까?")) {
      try {
        await axios.delete(`${API}/classrooms/${id}`);
        onRefresh();
      } catch (error) {
        console.error("강의실 삭제 실패:", error);
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>강의실 관리</h2>

        <div className="input-group">
          <input
            type="text"
            placeholder="새 강의실 이름 (예: 공1201)"
            value={newRoom}
            onChange={(e) => setNewRoom(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addRoom()}
          />
          <button className="save-btn" onClick={addRoom}>추가</button>
        </div>

        <ul className="room-list">
          {classrooms.map(room => (
            <li key={room.classroomId} className="room-item">
              {room.roomName}
              <button className="del-btn" onClick={() => deleteRoom(room.classroomId)}>삭제</button>
            </li>
          ))}
        </ul>

        <button className="close-btn" onClick={onClose}>닫기</button>
      </div>
    </div>
  );
}