import { useState } from "react";
import "./styles/layout.css";
import "./styles/map.css";
import "./styles/modal.css";

export default function App() {
  const [floor, setFloor] = useState(-1);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [emptyRooms, setEmptyRooms] = useState([]);

  const roomsByFloor = {
    [-1]: [
      { id: "B101", x: 94, y: 220, computer: false, beam: true, capacity: 20 },
      { id: "B102", x: 200, y: 155, computer: false, beam: true, capacity: 25 },
      { id: "B103", x: 273, y: 155, computer: false, beam: true, capacity: 25 },
      { id: "B104", x: 342, y: 155, computer: false, beam: true, capacity: 25 },
      { id: "B105", x: 171, y: 295, computer: false, beam: true, capacity: 25 },
      { id: "B106", x: 255, y: 295, computer: false, beam: true, capacity: 25 },
      { id: "B107", x: 360, y: 295, computer: false, beam: true, capacity: 25 },
    ],
    2: [
      { id: "공1214", x: 120, y: 230, computer: true, beam: true, capacity: 30 },
      { id: "공1217", x: 420, y: 230, computer: true, beam: true, capacity: 30 },
      { id: "공1202", x: 223, y: 120, computer: false, beam: true, capacity: 20 },
      { id: "공1203", x: 370, y: 120, computer: false, beam: true, capacity: 20 },
      { id: "공1204", x: 448, y: 120, computer: false, beam: true, capacity: 20 },
      { id: "공1205", x: 475, y: 120, computer: false, beam: true, capacity: 20 },
    ],
    3: [
      { id: "공1300", x: 43, y: 190, computer: false, beam: true, capacity: 25 },
      { id: "공1302", x: 83, y: 95, computer: false, beam: true, capacity: 40 },
      { id: "공1303", x: 286, y: 140, computer: false, beam: true, capacity: 40 },
      { id: "공1304", x: 365, y: 140, computer: false, beam: true, capacity: 40 },
    ],
    4: [
      { id: "공1402", x: 80, y: 80, computer: true, beam: true, capacity: 35 },
      { id: "공1403", x: 225, y: 135, computer: false, beam: true, capacity: 30 },
      { id: "공1404", x: 290, y: 135, computer: false, beam: true, capacity: 30 },
      { id: "공1405", x: 370, y: 135, computer: false, beam: true, capacity: 30 },
      { id: "공1406", x: 105, y: 275, computer: true, beam: true, capacity: 35 },
      { id: "공1407", x: 185, y: 275, computer: true, beam: true, capacity: 35 },
    ],
  };

  const rooms = roomsByFloor[floor] || [];

  // 강의실 클릭
  const handleRoomClick = (room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
    setShowSchedule(false);
  };

  // 지도 클릭 (히트박스)
  const handleMapClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const foundRoom = rooms.find((room) => {
      const dx = room.x - clickX;
      const dy = room.y - clickY;

      return Math.abs(dx) < 70 && Math.abs(dy) < 50;
    });

    if (foundRoom) {
      handleRoomClick(foundRoom);
    }
  };

  // API 호출 (핵심)
  const fetchEmptyRooms = async () => {
    try {
      const res = await fetch(
        `/classrooms/empty?day=MON&time=13:00`
      );

      const data = await res.json();
      setEmptyRooms(data);
      setShowSchedule(true);
    } catch (err) {
      console.error("API 에러:", err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>강의실 조회</h1>

      <div style={{ marginBottom: 10 }}>
        <button onClick={() => setFloor(-1)}>지하</button>
        <button onClick={() => setFloor(2)}>2층</button>
        <button onClick={() => setFloor(3)}>3층</button>
        <button onClick={() => setFloor(4)}>4층</button>
      </div>

      <div
        onClick={handleMapClick}
        style={{
          position: "relative",
          width: "500px",
          height: "350px",
          border: "1px solid black",
          cursor: "pointer",
        }}
      >
        <img
          src={floor === -1 ? "/basement.png" : `/floor${floor}.png`}
          alt="도면"
          style={{ width: "100%", height: "100%" }}
        />

        {rooms.map((room) => (
          <div
            key={room.id}
            onClick={(e) => {
              e.stopPropagation();
              handleRoomClick(room);
            }}
            style={{
              position: "absolute",
              left: room.x - 35,
              top: room.y - 25,
              width: 70,
              height: 50,
              backgroundColor: "transparent",
              cursor: "pointer",
            }}
          />
        ))}
      </div>

      {isModalOpen && (
        <div
          onClick={() => setIsModalOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              padding: 20,
              borderRadius: 10,
              width: 300,
            }}
          >
            <h2>{selectedRoom?.id}</h2>

            <p>컴퓨터: {selectedRoom?.computer ? "있음" : "없음"}</p>
            <p>빔프로젝터: {selectedRoom?.beam ? "있음" : "없음"}</p>
            <p>수용인원: {selectedRoom?.capacity}명</p>

            <button onClick={fetchEmptyRooms}>
              예약 가능 시간 조회
            </button>

            {showSchedule && (
              <div style={{ marginTop: 10 }}>
                <p>빈 강의실 데이터:</p>
                <pre>{JSON.stringify(emptyRooms, null, 2)}</pre>
              </div>
            )}

            <button onClick={() => setIsModalOpen(false)}>
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}