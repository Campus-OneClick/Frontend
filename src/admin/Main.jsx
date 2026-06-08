import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Main.css';

import ReservationMain from './ReservationMain';
import AdminMain from './AdminMain';

export default function Main() {
  const navigate = useNavigate();
  const [reservationList, setReservationList] = useState([]); // 실시간 데이터를 담을 상태

  useEffect(() => {
    const userRole = sessionStorage.getItem('role');
    if (userRole !== 'ADMIN') {
      alert('권한이 없습니다!');
      navigate('/');
    } else {
      fetchReservations(); // 관리자면 백엔드에서 유저 신청 목록 가져오기
    }
  }, [navigate]);

  // 1. 🌟 데이터 가져오는 곳 주소
  const fetchReservations = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/reservations`);
      setReservationList(response.data);
    } catch (error) {
      console.error("데이터 가져오기 실패:", error);
    }
  };

  // 2. 🌟 수락/거절 상태 처리 주소
  const setStatus = async (num, status, type, rejectionReason) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_BASE_URL}/reservations/${type}/${num}`, {
        status,
        rejectionReason: rejectionReason || null,
      });
      alert(status === 1 ? "신청을 수락했습니다." : "신청을 거절했습니다.");
      fetchReservations();
    } catch (error) {
      console.error("상태 처리 실패:", error);
    }
  };

  // 3. 🌟 삭제 처리 주소 수정
  const deleteReservation = async (num, type) => {
    if (!window.confirm("해당 내역을 완전히 삭제하시겠습니까?")) return;
    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/reservations/${type}/${num}`);
      fetchReservations();
    } catch (error) {
      console.error("삭제 실패:", error);
    }
  };

  const userRole = sessionStorage.getItem('role');
  if (userRole !== 'ADMIN') { return null; }

  return (
    <div className="admin-page-wrapper">
      <div className="admin-topbar">
        <span className="admin-topbar-title">관리자 페이지</span>
        <button className="admin-topbar-btn" onClick={() => navigate('/')}>메인으로</button>
      </div>
      <div className="main-layout">
        <div className="layout-side">
          <h2 className="title">강의실 예약 신청 & 라운지 사용 현황 관리</h2>
          <ReservationMain
            reservationList={reservationList}
            setStatus={setStatus}
            deleteReservation={deleteReservation}
          />
        </div>
        <div className="layout-side">
          <h2 className="title">강의실 시간표 관리</h2>
          <AdminMain />
        </div>
      </div>
    </div>
  );
}