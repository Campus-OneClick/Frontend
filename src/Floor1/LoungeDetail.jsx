import React, { useState } from 'react';
import { CongestionBar } from './CongestionBar';
import { MySeatCard } from './MySeatCard';
import { SeatBox } from './SeatBox';

export function LoungeDetail({
    reservedSeats,
    myReservedSeat,
    bookingEndTime,
    onReserve,
    onReturn,
    onExtend,
    onBack,
    totalSeats,
    title,
    loungeName,
    containerClass,
    renderLayout
}) {
    const [selectedSeat, setSelectedSeat] = useState(null);

    const getAvailableTime = () => {
        const now = new Date();
        const startHours = String(now.getHours()).padStart(2, '0');
        const startMinutes = String(now.getMinutes()).padStart(2, '0');

        now.setHours(now.getHours() + 2);
        const endHours = String(now.getHours()).padStart(2, '0');
        const endMinutes = String(now.getMinutes()).padStart(2, '0');

        return `${startHours}:${startMinutes} ~ ${endHours}:${endMinutes}`;
    };

    const handleSeatClick = (seatId) => {
        const isReserved = reservedSeats.includes(seatId);

        if (isReserved) {
            alert('이미 예약된 좌석입니다');
        } else if (myReservedSeat !== null) {
            alert(`이미 ${myReservedSeat}번 좌석을 예약했습니다.`);
        } else {
            setSelectedSeat(seatId);
        }
    };

    const renderSeats = (startId, count) => {
        return Array.from({ length: count }).map((_, index) => {
            const seatId = startId + index;
            const isReserved = reservedSeats.includes(seatId);

            return (
                <SeatBox
                    key={seatId}
                    seatId={seatId}
                    isReserved={isReserved}
                    onClick={handleSeatClick}
                />
            );
        });
    };

    const handleConfirmReserve = () => {
        if (selectedSeat !== null) {
            onReserve(selectedSeat);
            setSelectedSeat(null);
        }
    };

    return (
        <div className={containerClass}>
            <button className="back_btn" onClick={onBack}>
                ⬅ 도면으로 돌아가기
            </button>
            <h2 className="title">{title}</h2>

            <div className="layout_wrapper">
                <div className="room_box">
                    {renderLayout(renderSeats)}
                </div>

                <div className="congestion_sidebar">
                    <CongestionBar
                        total={totalSeats}
                        reserved={reservedSeats.length}
                        title={`${loungeName} 혼잡도`}
                    />
                    <MySeatCard
                        myReservedSeat={myReservedSeat}
                        bookingEndTime={bookingEndTime}
                        onReturn={onReturn}
                        onExtend={onExtend}
                    />
                </div>
            </div>

            {selectedSeat !== null && (
                <div className="modal_overlay" onClick={() => setSelectedSeat(null)}>
                    <div className="modal_content" onClick={(e) => e.stopPropagation()}>

                        <div className="modern_badge">No.{selectedSeat}</div>

                        <div className="modal_header">
                            <p className="room_name">{loungeName}</p>
                            <h3 className="seat_number">좌석 배정</h3>
                            <div className="time_badge">
                                <span>이용 시간</span>
                                <p className="available_time">{getAvailableTime()}</p>
                            </div>
                        </div>

                        <div className="modal_buttons_row">
                            <button className="close_btn" onClick={() => setSelectedSeat(null)}>취소</button>
                            <button className="assign_btn" onClick={handleConfirmReserve}>배정하기</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
