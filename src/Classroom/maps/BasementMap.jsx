import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "../api/api";
import "./Floor.css";

export default function Basement() {
  const navigate = useNavigate();

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [activeRoom, setActiveRoom] = useState(null);
  const [roomStatus, setRoomStatus] = useState([]);

  const rooms = {
    "B101": { name: "B101", capacity: 40, projector: true, computer: true },
    "B102": { name: "B102", capacity: 30, projector: true, computer: false },
    "B103": { name: "B103", capacity: 20, projector: false, computer: true },
    "B104": { name: "B104", capacity: 50, projector: true, computer: true },
    "B105": { name: "B105", capacity: 25, projector: false, computer: false },
  };

  const fetchStatus = async () => {
    try {
      const res = await api.get("/room-usage/status");
      setRoomStatus(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleRoomClick = async (room) => {
    setSelectedRoom(room);

    try {
      await api.post("/room-usage/start", {
        roomName: room.name,
        status: "STUDY",
      });

      setActiveRoom(room);
      fetchStatus();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEnd = async () => {
    try {
      await api.post("/room-usage/end", {
        roomName: selectedRoom.name,
      });

      setActiveRoom(null);
      setSelectedRoom(null);
      fetchStatus();
    } catch (err) {
      console.error(err);
    }
  };

  const isUsed = (roomName) =>
    roomStatus.find((r) => r.roomName === roomName)?.status === "USED";

  return (
    <div className="toss_container basement">
      <div className="map_wrapper">
        <img src="/basement.png" className="floor_img" />

        <button className={`toss_pin room1 ${isUsed("B101") ? "used" : ""}`} onClick={() => handleRoomClick(rooms["B101"])}>B101</button>
        <button className={`toss_pin room2 ${isUsed("B102") ? "used" : ""}`} onClick={() => handleRoomClick(rooms["B102"])}>B102</button>
        <button className={`toss_pin room3 ${isUsed("B103") ? "used" : ""}`} onClick={() => handleRoomClick(rooms["B103"])}>B103</button>
        <button className={`toss_pin room4 ${isUsed("B104") ? "used" : ""}`} onClick={() => handleRoomClick(rooms["B104"])}>B104</button>
        <button className={`toss_pin room5 ${isUsed("B105") ? "used" : ""}`} onClick={() => handleRoomClick(rooms["B105"])}>B105</button>
      </div>

      {selectedRoom && (
        <div className="popup_overlay" onClick={() => setSelectedRoom(null)}>
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            <span className="popup_badge">강의실</span>
            <h2>{selectedRoom.name}</h2>
            <div className="popup_info">
              <span className="popup_info_label">수용인원</span>
              <span className="popup_info_value">{selectedRoom.capacity}명</span>
            </div>
            <div className="popup_info">
              <span className="popup_info_label">빔프로젝터</span>
              <span className="popup_info_value">{selectedRoom.projector ? "있음" : "없음"}</span>
            </div>
            <div className="popup_info">
              <span className="popup_info_label">컴퓨터</span>
              <span className="popup_info_value">{selectedRoom.computer ? "있음" : "없음"}</span>
            </div>
            <div className="popup_buttons">
              <button className="reserve_btn" onClick={() => navigate(`/timetable/${selectedRoom.name}`)}>
                예약하기
              </button>
              {activeRoom?.name === selectedRoom?.name && (
                <button className="end_btn" onClick={handleEnd}>사용 종료</button>
              )}
              <button className="close_btn" onClick={() => setSelectedRoom(null)}>닫기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}