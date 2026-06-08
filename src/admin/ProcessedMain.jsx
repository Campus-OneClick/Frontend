import React from 'react';
import './ProcessedMain.css';

export default function ProcessedMain({
  data,
  Waiting,
  Processed,
  handleWaitingClick,
  handleProcessedClick,
  setStatus,
  deleteReservation,
  deleteSelectedReservations,
  handleSelectToggle,
  selectedNums,
}) {

  // [핵심] 이제 num이 아니라 {num, type} 객체들로 비교합니다.
  const isAllSelected = data && data.length > 0 && data.every(item => 
    selectedNums.some(s => s.num === item.num && s.type === item.type)
  );

  const handleHeaderCheckboxChange = () => {
    if (isAllSelected) {
      data.forEach(item => {
        if (selectedNums.some(s => s.num === item.num && s.type === item.type)) {
          handleSelectToggle(item.num, item.type);
        }
      });
    } else {
      data.forEach(item => {
        if (!selectedNums.some(s => s.num === item.num && s.type === item.type)) {
          handleSelectToggle(item.num, item.type);
        }
      });
    }
  };

  return (
    <div>
      <div className="tab-wrapper">
        <button className={`tab-item ${Waiting}`} onClick={handleWaitingClick}>대기중</button>
        <button className={`tab-item ${Processed}`} onClick={handleProcessedClick}>처리완료</button>
      </div>

      <div style={{
        margin: '8px 0 4px',
        padding: '8px 12px',
        background: '#fffbeb',
        border: '1px solid #fcd34d',
        borderRadius: '8px',
        fontSize: '13px',
        color: '#92400e',
      }}>
        처리 완료 후 <strong>7일</strong>이 지난 내역은 자동으로 삭제됩니다.
      </div>

      <div className="checkbox-wrapper">
        <span>총 개수: {data ? data.length : 0}</span>
        <span>선택 된 개수: {selectedNums.length}</span>
        <button className="delete-btn" onClick={deleteSelectedReservations}>삭제</button>
      </div>

      <div className='process-reservation-row header'>
        <input
          type="checkbox"
          checked={isAllSelected}
          onChange={handleHeaderCheckboxChange}
          style={{ cursor: 'pointer' }}
        />
        <div className="table-text-align">번호</div>
        <div>신청자 / 장소</div>
        <div>시간 정보</div>
        <div className="table-text-align">결과</div>
        <div className="table-text-align">
          <span className="table-text-align-bigo">비고</span>
        </div>
      </div>

      {data && data.map((item, index) => (
        // key도 타입과 번호를 조합해서 유니크하게 만듭니다.
        <div className="process-reservation-row" key={`${item.type}-${item.num}`}>
          <input
            type="checkbox"
            // 체크 상태를 객체 비교로 확인
            checked={selectedNums.some(s => s.num === item.num && s.type === item.type)}
            onChange={() => handleSelectToggle(item.num, item.type)}
            style={{ cursor: 'pointer' }}
          />

          <span className="col-num">{index + 1}</span>

          <div className="col-user-room">
            <span className="user-name">{item.user}</span>
            <span className="room-name">{item.classroomId}</span>
          </div>

          <div className="col-time-info">
            <span className="use-time">{item.date}({item.day}) {item.time}</span>
            <div>
              <span className="log-time-stamp">신청: {item.requestedAt}</span>
              {item.processedAt && (
                <span className="processed-time-stamp"> / 처리: {item.processedAt}</span>
              )}
            </div>
          </div>

          <span className={`col-status status-${item.status}`}>
            {item.status === 1 ? '수락완료' : '거절완료'}
          </span>

          <div className="col-actions">
            {item.status === 1 && (
              <button
                className="edit-btn"
                onClick={() => setStatus(item.num, 0, item.type)}
              >
                승인 취소
              </button>
            )}
            <button
              className="delete-btn"
              onClick={() => deleteReservation(item.num, item.type)}
            >
              삭제
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}