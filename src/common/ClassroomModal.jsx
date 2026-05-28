import "../../styles/modal.css";

export default function ClassroomModal({ roomId, onClose }) {
  if (!roomId) return null;

  const roomInfo = {
    공1201: { computer: true, projector: true },
    공1202: { computer: false, projector: true },
  };

  const info = roomInfo[roomId];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{roomId}</h2>

        <p>컴퓨터: {info?.computer ? "있음" : "없음"}</p>
        <p>빔프로젝터: {info?.projector ? "있음" : "없음"}</p>

        <button>예약하기</button>
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
}