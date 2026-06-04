import { useParams } from "react-router-dom";

export default function RoomDetailPage() {
  const { roomId } = useParams();

  const startUsage = async (status) => {
    try {
      await fetch("/room-usage/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomId,
          status,
        }),
      });

      alert("상태 등록 완료");
    } catch (e) {
      alert("오류");
    }
  };

  const endUsage = async () => {
    try {
      await fetch("/room-usage/end", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomId,
        }),
      });

      alert("사용 종료됨");
    } catch (e) {
      alert("오류");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>{roomId} 강의실 상태</h2>

      <button onClick={() => startUsage("STUDY")}>공부중</button>
      <button onClick={() => startUsage("REST")}>휴식중</button>
      <button onClick={() => startUsage("TEAM")}>팀플중</button>

      <hr />

      <button onClick={endUsage}>사용 종료</button>
    </div>
  );
}