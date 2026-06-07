import React, { useState } from 'react';

export default function LectureMain({
  data,
  Waiting,
  Processed,
  handleWaitingClick,
  handleProcessedClick,
  setStatus
}) {
  const [rejectingItem, setRejectingItem] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const handleRejectConfirm = () => {
    if (!rejectReason.trim()) {
      alert("거절 사유를 입력해주세요.");
      return;
    }
    setStatus(rejectingItem.num, 2, rejectReason.trim());
    setRejectingItem(null);
    setRejectReason("");
  };

  const handleRejectCancel = () => {
    setRejectingItem(null);
    setRejectReason("");
  };

  return (
    <div>
      <div className="tab-wrapper">
        <button className={`tab-item ${Waiting}`} onClick={handleWaitingClick}>
          대기중
        </button>
        <button className={`tab-item ${Processed}`} onClick={handleProcessedClick}>
          처리완료
        </button>
      </div>

      <div className='reservation-row header'>
        <div>번호</div>
        <div>신청자 / 장소</div>
        <div>시간 정보</div>
        <div>상태</div>
        <div>관리</div>
      </div>

      {data && data.map((item, index) => (
        <div className="reservation-row" key={item.num}>
          <span className="col-num">{index + 1}</span>

          <div className="col-user-room">
            <span className="user-name">{item.user}</span>
            <span className="room-name">{item.lecture}</span>
          </div>

          <div className="col-time-info">
            <span className="use-time">{item.date}({item.day}) {item.time}</span>
            <span className="log-time-stamp">신청: {item.requestedAt}</span>
            <span className="log-time-stamp">신청 사유: {item.memo || "-"}</span>
          </div>

          <span className="col-status status-0">대기중</span>

          <div className="col-actions">
            <button
              className="accept-btn"
              onClick={() => setStatus(item.num, 1)}
            >수락</button>
            <button
              className="reject-btn"
              onClick={() => setRejectingItem(item)}
            >거절</button>
          </div>
        </div>
      ))}

      {rejectingItem && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
        }}>
          <div style={{
            background: "#fff", borderRadius: "12px", padding: "28px",
            width: "400px", boxShadow: "0 8px 32px rgba(0,0,0,0.18)"
          }}>
            <h3 style={{ marginBottom: "8px" }}>예약 거절</h3>
            <p style={{ color: "#666", marginBottom: "16px", fontSize: "14px" }}>
              <strong>{rejectingItem.user}</strong> — {rejectingItem.lecture} ({rejectingItem.day} {rejectingItem.time})
            </p>
            <textarea
              placeholder="거절 사유를 입력하세요."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
              style={{
                width: "100%", padding: "10px", borderRadius: "8px",
                border: "1px solid #ddd", resize: "vertical", fontSize: "14px",
                boxSizing: "border-box"
              }}
            />
            <div style={{ display: "flex", gap: "8px", marginTop: "16px", justifyContent: "flex-end" }}>
              <button
                onClick={handleRejectCancel}
                style={{
                  padding: "8px 20px", borderRadius: "8px", border: "1px solid #ddd",
                  background: "#f5f5f5", cursor: "pointer"
                }}
              >취소</button>
              <button
                onClick={handleRejectConfirm}
                style={{
                  padding: "8px 20px", borderRadius: "8px", border: "none",
                  background: "#e53e3e", color: "#fff", cursor: "pointer"
                }}
              >거절 확정</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
