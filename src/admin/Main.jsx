import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import './Main.css';

import ReservationMain from './ReservationMain';
import AdminMain from './AdminMain';

export default function Main() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    // 관리자가 아니면 메인으로 튕겨내기
    if (userRole !== 'ADMIN' && userRole !== 'admin') {
      alert('관리자 권한이 없습니다.');
      navigate('/');
    }
  }, [userRole, navigate]); // userRole이 바뀔 때도 체크하도록 설정

  // 관리자가 아니면 아무것도 표시하지 않음
  if (userRole !== 'ADMIN' && userRole !== 'admin') {
    return null;
  }

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