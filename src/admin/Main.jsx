import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import './Main.css';

import ReservationMain from './ReservationMain';
import AdminMain from './AdminMain';

export default function Main() {
  const navigate = useNavigate();

  // 사용자 권한 가져오기
  const userRole = localStorage.getItem('userRole');

  // 관리자 여부 판별
  const isAdmin =
    userRole === 'ADMIN' || userRole === 'admin';

  // alert 중복 방지
  const hasAlerted = useRef(false);

  useEffect(() => {
    if (!isAdmin) {
      if (!hasAlerted.current) {
        alert('관리자 권한이 없습니다.');
        hasAlerted.current = true;
      }

      navigate('/', { replace: true });
    }
  }, [isAdmin, navigate]);

  // 관리자 아니면 렌더링 차단
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="main-layout">
      <div className="layout-side">
        <h2 className="title">예약 신청 승인</h2>
        <ReservationMain />
      </div>

      <div className="layout-side">
        <h2 className="title">강의실 시간표 관리</h2>
        <AdminMain />
      </div>
    </div>
  );
}
