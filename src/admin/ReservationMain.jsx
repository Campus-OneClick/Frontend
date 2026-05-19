import React, { useState } from 'react';
import LectureMain from './LectureMain';
import LoungeMain from './LoungeMain';
import ProcessedMain from './ProcessedMain';
import './ReservationMain.css';

export default function Reservation() {
  const [mode, setMode] = useState('lecture'); // 'lecture' 또는 'lounge'
  const [subTab, setSubTab] = useState('waiting'); // 'waiting'(대기중) 또는 'processed'(처리완료)

  const [selectedNums, setSelectedNums] = useState([]);  // 체크된 아이템들의 num을 담아둘 바구니 생성

  function ToggleMode() { setMode(mode === 'lecture' ? 'lounge' : 'lecture'); } // 러운지 강의실 토글
  // 강의실 / 라운지 대기중  css
  function lecActive() { return mode === 'lecture' ? 'active' : ''; } // 강의실 활설화
  function louActive() { return mode === 'lounge' ? 'active' : ''; } // 라운지 활설화
  // 대기중 / 처리완료 토글 
  function handleWaitingClick() { setSubTab('waiting'); } // 대기중 상태로 변경
  function handleProcessedClick() { setSubTab('processed'); } // 처리완료 상태로 변경
  // 대기중 / 처리완료 css
  function Wating() { return subTab === 'waiting' ? 'active' : ''; } // 대기중 활설화
  function Processed() { return subTab === 'processed' ? 'active' : ''; } // 처리완료 활설화

  const [reservations, setReservations] = useState([
    {
      type: 'lecture',

      num: 1,
      user: '5711111',
      lecture: '공1201',

      date: '2026/05/10',
      day: '월',
      time: '13:00 ~ 14:00',

      status: 0,
      requestedAt: '05/19 14:22',
      processedAt: null
    },
    {
      type: 'lecture',

      num: 2,
      user: '5633333',
      lecture: '공1202',

      date: '2026/05/11',
      day: '수',
      time: '14:00 ~ 15:30',

      status: 0,
      requestedAt: '05/19 15:10',
      processedAt: null
    },
    {
      type: 'lounge',
      num: 1,
      user: '5755555',
      desknum: '10',

      date: '2026/05/10',
      day: '월',
      time: '13:00 ~ 14:00',

      status: 0,
      requestedAt: '05/19 13:00',
      processedAt: null
    },
  ]);
  
  function setStatus(num, newStatus) {
    // 🌟 1. [수락/거절] 버튼을 누른 바로 '지금' 이 순간의 날짜와 시간 구하기
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    // 예: '05/19 13:00' 형태로 가공
    const currentTimeString = `${month}/${date} ${hours}:${minutes}`;

    setReservations(prevList =>
      prevList.map(item => {
        // 🌟 버그 방지: num과 함께 현재 활성화된 모드(type)도 일치하는지 정확히 검사!
        const isTarget = item.num === num && item.type === mode;

        return isTarget 
          ? { 
              ...item, 
              status: newStatus,             // 1(수락) 또는 2(거절)로 변경
              processedAt: currentTimeString // 🌟 null 자리에 시간 도장 쾅!
            } 
          : item;
      })
    );
  }

  // 데이터 필터링 구역
  const filteredData = reservations.filter(item => {
    const matchType = item.type === mode;
    const matchTab = subTab === 'waiting' ? item.status === 0 : item.status !== 0;
    return matchType && matchTab;
  });

  function deleteReservation(num, type) {
    setReservations(prevList => 
      prevList.filter(item => !(item.num === num && item.type === type))
    );
    // 선택 목록에서도 num과 type이 일치하는 것만 제거
    setSelectedNums(prev => prev.filter(n => !(n.num === num && n.type === type)));
  }

  function deleteSelectedReservations() {
    if (selectedNums.length === 0) {
      alert("선택된 내역이 없습니다!");
      return;
    }
    if (window.confirm("선택한 내역을 전부 삭제하시겠습니까?")) {
      setReservations(prevList => 
        prevList.filter(item => 
          !selectedNums.some(s => s.num === item.num && s.type === item.type)
        )
      );
      setSelectedNums([]); // 삭제 후 바구니 비우기
    }
  }

  /* 4. 체크박스 토글 함수 (체크하면 넣고, 해제하면 빼고) */
  function handleSelectToggle(num, type) {
  setSelectedNums(prev => {
    const isSelected = prev.some(item => item.num === num && item.type === type);
    return isSelected 
      ? prev.filter(item => !(item.num === num && item.type === type)) 
      : [...prev, { num, type }];
  });
}
  return (
    <div>
      <div>※수정해야할 일※</div>
      <div>일괄적으로 다듬기 // 여 썰고 저 썰고 하기</div>
      <div className="admin-header">
        <h2 className="admin-title">
          {mode === 'lecture' ? '강의실' : '라운지'}
        </h2>

        {/* 슬라이드 토글 버튼 구역 */}
        <div className="mode-toggle-container" onClick={ToggleMode}>
          <div className={`toggle-background ${mode}`}></div>
          <button className={`toggle-btn ${lecActive()}`} type="button">
            강의실
          </button>
          <button className={`toggle-btn ${louActive()}`} type="button">
            라운지
          </button>
        </div>
      </div>

      {/* 서브 탭과 선택 모드에 따른 조건부 렌더링 영역 */}
      <div>
        {subTab === 'waiting' ? (
          mode === 'lecture' ? (
            <LectureMain
              Wating={Wating()}
              Processed={Processed()}
              handleWaitingClick={handleWaitingClick}
              handleProcessedClick={handleProcessedClick}
              setStatus={setStatus}
              data={filteredData} />
          ) : (
            <LoungeMain
              Wating={Wating()}
              Processed={Processed()}
              handleWaitingClick={handleWaitingClick}
              handleProcessedClick={handleProcessedClick}
              setStatus={setStatus}
              data={filteredData} />
          )
        ) : (
          <ProcessedMain
            mode={mode}
            data={filteredData}
            Wating={Wating()}
            Processed={Processed()}
            handleWaitingClick={handleWaitingClick}
            handleProcessedClick={handleProcessedClick}
            setStatus={setStatus}

            deleteReservation={deleteReservation}
            deleteSelectedReservations={deleteSelectedReservations}
            handleSelectToggle={handleSelectToggle}
            selectedNums={selectedNums} />
        )}
      </div>
    </div>
  );
}