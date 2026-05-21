import React from 'react';
import ReservationMain from './ReservationMain';
import AdminMain from './AdminMain';
import './Main.css';

export default function Main() {
  return (
    <div className="main-layout">
      {/* 왼쪽 섹션: 유저들의 예약 요청 처리 */}
      <div className="layout-side">
        <h2 className="title">예약 신청 승인</h2>
        <ReservationMain />
      </div>

      {/* 오른쪽 섹션: 기초 시간표 데이터 관리 */}
      <div className="layout-side">
        <h2 className="title">강의실 시간표 관리</h2>
        <AdminMain />
      </div>
    </div>
  );
}