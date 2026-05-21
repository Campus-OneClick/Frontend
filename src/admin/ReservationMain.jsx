import React, { useEffect, useState } from 'react';
import httpClient from '../api/httpClient';
import LectureMain from './LectureMain';
import LoungeMain from './LoungeMain';
import ProcessedMain from './ProcessedMain';
import './ReservationMain.css';

export default function Reservation() {
  const [mode, setMode] = useState('lecture'); // 'lecture' 또는 'lounge'
  const [subTab, setSubTab] = useState('waiting'); // 'waiting'(대기중) 또는 'processed'(처리완료)

  const [selectedNums, setSelectedNums] = useState([]);

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

  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    loadReservations();
  }, []);

  async function loadReservations() {
    try {
      const res = await httpClient.get('/reservations');
      setReservations(res.data || []);
    } catch (error) {
      console.error('예약 목록을 불러오지 못했습니다.', error);
    }
  }

  async function setStatus(num, newStatus) {
    try {
      await httpClient.put(`/reservations/${mode}/${num}`, { status: newStatus });
      await loadReservations();
    } catch (error) {
      alert(error.response?.data?.message || '처리에 실패했습니다.');
      console.error(error);
    }
  }

  // 데이터 필터링 구역
  const filteredData = reservations.filter(item => {
    const matchType = item.type === mode;
    const matchTab = subTab === 'waiting' ? item.status === 0 : item.status !== 0;
    return matchType && matchTab;
  });

  async function deleteReservation(num, type) {
    try {
      await httpClient.delete(`/reservations/${type}/${num}`);
      setSelectedNums(prev => prev.filter(n => !(n.num === num && n.type === type)));
      await loadReservations();
    } catch (error) {
      alert(error.response?.data?.message || '삭제에 실패했습니다.');
      console.error(error);
    }
  }

  async function deleteSelectedReservations() {
    if (selectedNums.length === 0) {
      alert("선택된 내역이 없습니다!");
      return;
    }
    if (window.confirm("선택한 내역을 전부 삭제하시겠습니까?")) {
      try {
        await Promise.all(selectedNums.map((item) => httpClient.delete(`/reservations/${item.type}/${item.num}`)));
        setSelectedNums([]);
        await loadReservations();
      } catch (error) {
        alert(error.response?.data?.message || '삭제에 실패했습니다.');
        console.error(error);
      }
    }
  }

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