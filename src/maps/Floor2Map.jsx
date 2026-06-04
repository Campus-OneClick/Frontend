import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "../api/api";
import "./Floor.css";

export default function Floor2Map() {
  const navigate = useNavigate();

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [activeRoom, setActiveRoom] = useState(null);
  const [roomStatus, setRoomStatus] = useState([]);

  const rooms = {
    "201": { name: "201호", capacity: 40, projector: true, computer: true },
    "202": { name: "202호", capacity: 30, projector: true, computer: false },
    "203": { name: "203호", capacity: 25, projector: false, computer: true },
    "204": { name: "204호", capacity: 50, projector: true, computer: true },
    "205": { name: "205호", capacity: 20, projector: false, computer: false },
    "206": { name: "206호", capacity: 35, projector: true, computer: true },
  };

  // 상태 조회 API
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
        status: "STUDY",
      });

      setActiveRoom(room);
      fetchStatus(); // 상태 즉시 갱신
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
      fetchStatus(); // 상태 갱신
    } catch (err) {
      console.error("end 실패", err);
    }
  };

  // 사용중 체크 함수
  const isUsed = (roomName) =>
    roomStatus.find((r) => r.roomName === roomName)?.status === "USED";

  return (
    <div className="toss_container floor2">
      <h1>2층</h1>

      <button onClick={() => navigate("/Basement")}>지하</button>
      <button onClick={() => navigate("/")}>2층</button>
      <button onClick={() => navigate("/floor3")}>3층</button>
      <button onClick={() => navigate("/floor4")}>4층</button>

      {/* 지도 */}
      <div className="map_wrapper">
        <img src="/floor2.png" className="floor_img" />

        <button
          className={`toss_pin room1 ${isUsed("201호") ? "used" : ""}`}
          onClick={() => handleRoomClick(rooms["201"])}
        >
          201
        </button>

        <button
          className={`toss_pin room2 ${isUsed("202호") ? "used" : ""}`}
          onClick={() => handleRoomClick(rooms["202"])}
        >
          202
        </button>

        <button
          className={`toss_pin room3 ${isUsed("203호") ? "used" : ""}`}
          onClick={() => handleRoomClick(rooms["203"])}
        >
          203
        </button>

        <button
          className={`toss_pin room4 ${isUsed("204호") ? "used" : ""}`}
          onClick={() => handleRoomClick(rooms["204"])}
        >
          204
        </button>

        <button
          className={`toss_pin room5 ${isUsed("205호") ? "used" : ""}`}
          onClick={() => handleRoomClick(rooms["205"])}
        >
          205
        </button>

        <button
          className={`toss_pin room6 ${isUsed("206호") ? "used" : ""}`}
          onClick={() => handleRoomClick(rooms["206"])}
        >
          206
        </button>
      </div>

      {/* 팝업 */}
      {selectedRoom && (
        <div className="popup_overlay">
          <div className="popup">
            <h2>{selectedRoom.name}</h2>

            <p>수용인원: {selectedRoom.capacity}명</p>
            <p>컴퓨터: {selectedRoom.computer ? "있음" : "없음"}</p>
            <p>빔프로젝터: {selectedRoom.projector ? "있음" : "없음"}</p>

            <button
              onClick={() => navigate(`/timetable/${selectedRoom.name}`)}
              className="reserve_btn"
            >
              예약하기
            </button>

            {/* 본인 사용중인 방만 종료 가능 */}
            {activeRoom?.name === selectedRoom?.name && (
              <button onClick={handleEnd} className="end_btn">
                사용 종료
              </button>
            )}

            <button onClick={() => setSelectedRoom(null)} className="close_btn">
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}