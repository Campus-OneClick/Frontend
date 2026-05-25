import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

import './Main.css';

import ReservationMain from './ReservationMain';
import AdminMain from './AdminMain';


export default function Main() {
  const navigate = useNavigate();
  // 🌟 새로 추가: 로그인한 사람이 관리자인가?"를 체크하는 것
  useEffect(() => {
    const userRole = localStorage.getItem('userRole'); 

    if (userRole !== 'admin') {
      alert('권한이 없습니다!');
      navigate('/'); // 메인으로 보내버리기
    }
  }, [navigate]);

  const userRole = localStorage.getItem('userRole');
  if (userRole !== 'admin') {
    return null; // 관리자가 아니면 아예 아무것도 안 보여줌
  }
  /* f12 > application > local stroage > http://localhost:3000 
  key = userRole
  value = admin
  했을 시 로그인 화면이 나오는거 까지 확인 
  */
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