import React, { useState } from 'react';
import LectureMain from './LectureMain';
import LoungeMain from './LoungeMain';
import ProcessedMain from './ProcessedMain';
import './ReservationMain.css';

// 부모(Main.jsx)로부터 실시간 데이터와 제어 함수를 안전하게 전달받습니다.
export default function ReservationMain({ reservationList, setStatus, deleteReservation }) {
  const [mode, setMode] = useState('lecture'); // 'lecture' 또는 'lounge'
  const [subTab, setSubTab] = useState('waiting'); // 'waiting'(대기중) 또는 'processed'(처리완료)
  const [selectedNums, setSelectedNums] = useState([]);

  // 🎨 css 슬라이더와 100% 매칭되는 오리지널 함수들
  function ToggleMode() { setMode(mode === 'lecture' ? 'lounge' : 'lecture'); }
  function lecActive() { return mode === 'lecture' ? 'active' : ''; }
  function louActive() { return mode === 'lounge' ? 'active' : ''; }
  function handleWaitingClick() { setSubTab('waiting'); }
  function handleProcessedClick() { setSubTab('processed'); }
  function Waiting() { return subTab === 'waiting' ? 'active' : ''; }
  function Processed() { return subTab === 'processed' ? 'active' : ''; }

  // 체크박스 핸들러
  const handleSelectToggle = (num, type) => {
    const isExist = selectedNums.some(s => s.num === num && s.type === type);
    if (isExist) {
      setSelectedNums(selectedNums.filter(s => !(s.num === num && s.type === type)));
    } else {
      setSelectedNums([...selectedNums, { num, type }]);
    }
  };

  const deleteSelectedReservations = () => {
    if (selectedNums.length === 0) {
      alert("선택된 내역이 없습니다!");
      return;
    }
    if (window.confirm("선택한 내역을 전부 삭제하시겠습니까?")) {
      selectedNums.forEach(({ num, type }) => {
        deleteReservation(num, type);
      });
      setSelectedNums([]);
    }
  };

  // 🌟 백엔드 실시간 데이터를 화면 조건(강의실/라운지, 대기중/처리완료)에 맞춰 정밀 필터링
  const filteredData = reservationList.filter(item => {
    const isSubTabMatch = subTab === 'waiting' ? item.status === 0 : (item.status === 1 || item.status === 2);
    const isModeMatch = item.type === mode;
    return isSubTabMatch && isModeMatch;
  });

  return (
    <div className="admin-container">

      <div className="admin-header">
        {/* 현재 mode가 lecture면 '강의실', lounge면 '라운지'라고 큰 글씨가 동적으로 바뀝니다 */}
        <h1 className="admin-title">
          {mode === 'lecture' ? '강의실' : '라운지'}
        </h1>

        {/* 슬라이드 토글 버튼 우측 배치 */}
        <div className="mode-toggle-container" onClick={ToggleMode}>
          <div className={`toggle-background ${mode}`} />
          <button className={`toggle-btn ${lecActive()}`} type="button">
            강의실
          </button>
          <button className={`toggle-btn ${louActive()}`} type="button">
            라운지
          </button>
        </div>
      </div>

      {/* 대기중/처리완료 서브탭 및 강의실/라운지에 따른 데이터 출력 화면 */}
      <div>
        {subTab === 'waiting' ? (
          mode === 'lecture' ? (
            <LectureMain
              Waiting={Waiting()}
              Processed={Processed()}
              handleWaitingClick={handleWaitingClick}
              handleProcessedClick={handleProcessedClick}
              setStatus={(num, status) => setStatus(num, status, 'lecture')}
              data={filteredData} />
          ) : (
            <LoungeMain
              Waiting={Waiting()}
              Processed={Processed()}
              handleWaitingClick={handleWaitingClick}
              handleProcessedClick={handleProcessedClick}
              setStatus={(num, status) => setStatus(num, status, 'lounge')}
              data={filteredData} />
          )
        ) : (
          <ProcessedMain
            mode={mode}
            data={filteredData}
            Waiting={Waiting()}
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
