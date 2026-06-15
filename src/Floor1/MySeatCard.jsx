// MySeatCard.jsx
import React, { useState, useEffect } from 'react';
import './CongestionBar.css';

export function MySeatCard({ myReservedSeat, bookingEndTime, onReturn, onExtend }) {
    if (myReservedSeat === null) return null;

    const [tick, setTick] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setTick((t) => t + 1);
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    const formatRemaining = (date) => {
        if (!date) return '';
        const ms = date - new Date();
        if (ms <= 0) return '만료';
        const totalMinutes = Math.floor(ms / 1000 / 60);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return hours > 0 ? `${hours}시간 ${minutes}분` : `${minutes}분`;
    };

    return (
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
    );
}
