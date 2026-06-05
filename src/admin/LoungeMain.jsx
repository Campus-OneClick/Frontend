import React from 'react';

export default function LoungeMain({
  data,
  Waiting,
  Processed,
  handleWaitingClick,
  handleProcessedClick,
  setStatus,
}) {
  return (
    <div className="admin-container">
      {/* 상단 서브 탭 */}
      <div className="tab-wrapper">
        <button className={`tab-item ${Waiting}`} onClick={handleWaitingClick}>
          대기중
        </button>
        <button className={`tab-item ${Processed}`} onClick={handleProcessedClick}>
          처리완료
        </button>
      </div>

      {/* 테이블 헤더 */}
      <div className='reservation-row header'>
        <div>번호</div>
        <div>신청자 / 장소</div>
        <div>시간 정보</div>
        <div>상태</div>
        <div>관리</div>
      </div>

      {/* 리스트 출력 */}
      {data && data.map((item, index) => (
        <div className="reservation-row" key={item.num}>
          <span className="col-num">{index + 1}</span>

          <div className="col-user-room">
            <span className="user-name">{item.user}</span>
            <span className="room-name">라운지 {item.desknum}번</span>
          </div>

          <div className="col-time-info">
            <span className="use-time">{item.date}({item.day}) {item.time}</span>
            <span className="log-time-stamp">신청: {item.requestedAt}</span>
          </div>

          <span className="col-status status-0">대기중</span>

          <div className="col-actions">
            <button
              className="accept-btn"
              onClick={() => setStatus(item.num, 1)}
            >수락</button>
            <button
              className="reject-btn"
              onClick={() => setStatus(item.num, 2)}
            >거절</button>
          </div>
        </div>
      ))}
    </div>
  );
}