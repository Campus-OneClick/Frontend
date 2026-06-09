import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "../api/api";
import "./Floor.css";

export default function Floor3Map() {
  const navigate = useNavigate();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomStatus, setRoomStatus] = useState({});

  const rooms = {
    "공1301": { name: "공1301", capacity: 40, projector: true, computer: true },
    "공1302": { name: "공1302", capacity: 35, projector: false, computer: true },
    "공1303": { name: "공1303", capacity: 50, projector: true, computer: false },
    "공1304": { name: "공1304", capacity: 30, projector: false, computer: false },
  };

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
    <div className="toss_container floor3">
      <div className="map_wrapper">
        <img src="/floor3.png" className="floor_img" alt="" />
        <button className={`toss_pin room1 ${isUsed("공1301") ? "used" : ""}`} onClick={() => setSelectedRoom(rooms["공1301"])}>공1301</button>
        <button className={`toss_pin room2 ${isUsed("공1302") ? "used" : ""}`} onClick={() => setSelectedRoom(rooms["공1302"])}>공1302</button>
        <button className={`toss_pin room3 ${isUsed("공1303") ? "used" : ""}`} onClick={() => setSelectedRoom(rooms["공1303"])}>공1303</button>
        <button className={`toss_pin room4 ${isUsed("공1304") ? "used" : ""}`} onClick={() => setSelectedRoom(rooms["공1304"])}>공1304</button>
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
