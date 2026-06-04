import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "../api/api";
import "./Floor.css";

export default function Floor2Map() {
  const navigate = useNavigate();

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [activeRoom, setActiveRoom] = useState(null);
  const [roomStatus, setRoomStatus] = useState([]);

  // roomName 통일 (숫자만 사용)
  const rooms = {
    "201": { name: "201", capacity: 40, projector: true, computer: true },
    "202": { name: "202", capacity: 30, projector: true, computer: false },
    "203": { name: "203", capacity: 25, projector: false, computer: true },
    "204": { name: "204", capacity: 50, projector: true, computer: true },
    "205": { name: "205", capacity: 20, projector: false, computer: false },
    "206": { name: "206", capacity: 35, projector: true, computer: true },
  };

  // 상태 조회
  const fetchStatus = async () => {
    try {
      const res = await api.get("/room-usage/status");
      setRoomStatus(res.data);
    } catch (err) {
      console.error("status 실패", err);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  // 사용 시작
  const handleRoomClick = async (room) => {
    setSelectedRoom(room);

    try {
      await api.post("/room-usage/start", {
        roomName: room.name,
        status: "USED",
      });

      setActiveRoom(room);
      fetchStatus();
    } catch (err) {
      console.error("start 실패", err);
    }
  };

  // 사용 종료
  const handleEnd = async () => {
    try {
      await api.post("/room-usage/end", {
        roomName: selectedRoom.name,
      });

      setActiveRoom(null);
      setSelectedRoom(null);
      fetchStatus();
    } catch (err) {
      console.error("end 실패", err);
    }
  };

  // 사용 여부 체크
  const isUsed = (roomName) => {
    return roomStatus.some(
      (r) => r.roomName === roomName && r.status === "USED"
    );
  };

  return (
    <div className="toss_container floor2">
      <h1>2층</h1>

      <button onClick={() => navigate("/Basement")}>지하</button>
      <button onClick={() => navigate("/")}>2층</button>
      <button onClick={() => navigate("/floor3")}>3층</button>
      <button onClick={() => navigate("/floor4")}>4층</button>

      <div className="map_wrapper">
        <img src="/floor2.png" className="floor_img" />

        {Object.entries(rooms).map(([key, room]) => (
          <button
            key={key}
            className={`toss_pin ${isUsed(room.name) ? "used" : ""}`}
            onClick={() => handleRoomClick(room)}
          >
            {room.name}
          </button>
        ))}
      </div>

      {selectedRoom && (
        <div className="popup_overlay">
          <div className="popup">
            <h2>{selectedRoom.name}호</h2>

            <p>수용인원: {selectedRoom.capacity}명</p>
            <p>컴퓨터: {selectedRoom.computer ? "있음" : "없음"}</p>
            <p>빔프로젝터: {selectedRoom.projector ? "있음" : "없음"}</p>

            <button
              onClick={() => navigate(`/timetable/${selectedRoom.name}`)}
              className="reserve_btn"
            >
              예약하기
            </button>

            {activeRoom?.name === selectedRoom?.name && (
              <button onClick={handleEnd} className="end_btn">
                사용 종료
              </button>
            )}

            <button
              onClick={() => setSelectedRoom(null)}
              className="close_btn"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}