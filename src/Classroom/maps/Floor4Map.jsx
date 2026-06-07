import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "../api/api";
import "./Floor.css";

export default function Floor4Map() {
  const navigate = useNavigate();

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [activeRoom, setActiveRoom] = useState(null);
  const [roomStatus, setRoomStatus] = useState([]);

  const rooms = {
    "401": { name: "401호", capacity: 40, projector: true, computer: true },
    "402": { name: "402호", capacity: 35, projector: false, computer: true },
    "403": { name: "403호", capacity: 50, projector: true, computer: false },
    "404": { name: "404호", capacity: 30, projector: false, computer: false },
    "405": { name: "405호", capacity: 30, projector: false, computer: false },
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
    <div className="toss_container floor4">
      <div className="map_wrapper">
        <img src="/floor4.png" className="floor_img" alt="4층 도면" />

        <button className={`toss_pin room1 ${isUsed("401호") ? "used" : ""}`} onClick={() => handleRoomClick(rooms["401"])}>401</button>
        <button className={`toss_pin room2 ${isUsed("402호") ? "used" : ""}`} onClick={() => handleRoomClick(rooms["402"])}>402</button>
        <button className={`toss_pin room3 ${isUsed("403호") ? "used" : ""}`} onClick={() => handleRoomClick(rooms["403"])}>403</button>
        <button className={`toss_pin room4 ${isUsed("404호") ? "used" : ""}`} onClick={() => handleRoomClick(rooms["404"])}>404</button>
        <button className={`toss_pin room5 ${isUsed("405호") ? "used" : ""}`} onClick={() => handleRoomClick(rooms["405"])}>405</button>
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