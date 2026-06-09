import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "../api/api";
import "./Floor.css";

const rooms = {
  "공1201": { name: "공1201", capacity: 40, projector: true, computer: true },
  "공1202": { name: "공1202", capacity: 30, projector: true, computer: false },
  "공1203": { name: "공1203", capacity: 25, projector: false, computer: true },
  "공1204": { name: "공1204", capacity: 50, projector: true, computer: true },
  "공1205": { name: "공1205", capacity: 20, projector: false, computer: false },
  "공1206": { name: "공1206", capacity: 35, projector: true, computer: true },
};

export default function Floor2Map() {
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
    <div className="toss_container floor2">
      <div className="map_wrapper">
        <img src="/floor2.png" className="floor_img" alt="" />
        <button className={`toss_pin room1 ${isUsed("공1201") ? "used" : ""}`} onClick={() => setSelectedRoom(rooms["공1201"])}>공1201</button>
        <button className={`toss_pin room2 ${isUsed("공1202") ? "used" : ""}`} onClick={() => setSelectedRoom(rooms["공1202"])}>공1202</button>
        <button className={`toss_pin room3 ${isUsed("공1203") ? "used" : ""}`} onClick={() => setSelectedRoom(rooms["공1203"])}>공1203</button>
        <button className={`toss_pin room4 ${isUsed("공1204") ? "used" : ""}`} onClick={() => setSelectedRoom(rooms["공1204"])}>공1204</button>
        <button className={`toss_pin room5 ${isUsed("공1205") ? "used" : ""}`} onClick={() => setSelectedRoom(rooms["공1205"])}>공1205</button>
        <button className={`toss_pin room6 ${isUsed("공1206") ? "used" : ""}`} onClick={() => setSelectedRoom(rooms["공1206"])}>공1206</button>
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
