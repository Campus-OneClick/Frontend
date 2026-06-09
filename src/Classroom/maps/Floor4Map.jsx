import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "../api/api";
import "./Floor.css";

const rooms = {
  "공1401": { name: "공1401", capacity: 40, projector: true, computer: true },
  "공1402": { name: "공1402", capacity: 35, projector: false, computer: true },
  "공1403": { name: "공1403", capacity: 50, projector: true, computer: false },
  "공1404": { name: "공1404", capacity: 30, projector: false, computer: false },
  "공1405": { name: "공1405", capacity: 30, projector: false, computer: false },
};

export default function Floor4Map() {
  const navigate = useNavigate();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomStatus, setRoomStatus] = useState({});

  useEffect(() => {
    Promise.all(
      Object.keys(rooms).map(name =>
        api.get(`/room-usage/status/${encodeURIComponent(name)}`)
          .then(res => res.data)
          .catch(() => ({ roomName: name, status: "FREE" }))
      )
    ).then(results => {
      const map = {};
      results.forEach(r => { map[r.roomName] = r.status; });
      setRoomStatus(map);
    });
  }, []);

  const isUsed = (roomName) => roomStatus[roomName] === "USED";

  return (
    <div className="toss_container floor4">
      <div className="map_wrapper">
        <img src="/floor4.png" className="floor_img" alt="4층 도면" />
        <button className={`toss_pin room1 ${isUsed("공1401") ? "used" : ""}`} onClick={() => setSelectedRoom(rooms["공1401"])}>공1401</button>
        <button className={`toss_pin room2 ${isUsed("공1402") ? "used" : ""}`} onClick={() => setSelectedRoom(rooms["공1402"])}>공1402</button>
        <button className={`toss_pin room3 ${isUsed("공1403") ? "used" : ""}`} onClick={() => setSelectedRoom(rooms["공1403"])}>공1403</button>
        <button className={`toss_pin room4 ${isUsed("공1404") ? "used" : ""}`} onClick={() => setSelectedRoom(rooms["공1404"])}>공1404</button>
        <button className={`toss_pin room5 ${isUsed("공1405") ? "used" : ""}`} onClick={() => setSelectedRoom(rooms["공1405"])}>공1405</button>
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
              <button className="reserve_btn" onClick={() => navigate(`/timetable/${selectedRoom.name}`)}>예약하기</button>
              <button className="close_btn" onClick={() => setSelectedRoom(null)}>닫기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
