// CongestionBar.jsx
import React from 'react';
import './CongestionBar.css';

export function CongestionBar({ total, reserved, title = '혼잡도', showMySeat = true, myReservedSeat, bookingEndTime, onReturn, onExtend }) {
    const percent = Math.floor((reserved / total) * 100);

    // 혼잡도 색상 계산
    let barColor = '#4CAF50'; // 초록
    if (percent >= 41 && percent <= 70) barColor = '#FFC107'; // 노랑
    if (percent >= 71) barColor = '#F44336'; // 빨강

    const formatRemaining = (date) => {
        if (!date) return '';
        const ms = date - new Date();
        if (ms <= 0) return '만료';
        const totalMinutes = Math.floor(ms / 60000);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return hours > 0 ? `${hours}시간 ${minutes}분` : `${minutes}분`;
    };

    return (
        <div className="congestion_sidebar">
            {/* 1. 혼잡도 지표 영역 (가로형 프로그레스 바) */}
            <div className="status_card">
                <h3 className="card_title">{title}</h3>
                <div className="progress_container">
                    <div 
                        className="progress_fill" 
                        style={{ width: `${percent}%`, backgroundColor: barColor }}
                    ></div>
                </div>
                <div className="status_txt_row">
                    <span className="percent_text" style={{ color: barColor }}>{percent}%</span>
                    <span className="count_text">{reserved} / {total}석</span>
                </div>
            </div>

            {/* 2. 내 좌석 관리 영역 (showMySeat이 true이고 예약이 있을 때만) */}
            {showMySeat && myReservedSeat !== null && (
                <div className="my_seat_card">
                    <h4 className="card_title">내 이용 정보</h4>
                    <p className="my_seat_info">
                        이용 좌석: <strong>{myReservedSeat}번</strong>
                    </p>
                    <p className="my_seat_info">
                        남은 시간: <span className="time_txt">{formatRemaining(bookingEndTime)}</span>
                    </p>
                    <div className="sidebar_btn_group">
                        <button className="extend_btn" onClick={onExtend}>시간 연장</button>
                        <button className="return_btn" onClick={onReturn}>좌석 반납</button>
                    </div>
                </div>
            )}
        </div>
    );
}
