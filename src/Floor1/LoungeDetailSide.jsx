import React, { useState } from 'react';
import './LoungeDetailSide.css';
import { CongestionBar } from './CongestionBar';
import { SeatBox } from './SeatBox';

export function LoungeDetailSide({
    reservedSeats,
    myReservedSeat,
    bookingEndTime,
    onReserve,
    onReturn,
    onExtend,
    onBack
}) {
    const [selectedSeat, setSelectedSeat] = useState(null);

    // 좌석 구성:
    // 왼쪽 열: 8석 (1~8)
    // 중앙 왼쪽 상단 3x2: 9~14
    // 중앙 왼쪽 하단 3x2: 15~20
    // 중앙 오른쪽 상단 3x2: 21~26
    // 중앙 오른쪽 하단 3x2: 27~32
    // 오른쪽 열: 8석 (33~40)
    const TOTAL_SEATS = 40;

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
        <div className="lounge_side_container">
            <button className="back_btn" onClick={onBack}>
                ⬅ 도면으로 돌아가기
            </button>
            <h2 className="title">옆 라운지 예약</h2>

            <div className="layout_wrapper">
                <div className="room_box">
                    <div className="main_section">

                        {/* 왼쪽 열: 8석 (1~8) */}
                        <div className="side_column">
                            {renderSeats(1, 8)}
                        </div>

                        {/* 중앙 왼쪽: 3x2 블록 2개 */}
                        <div className="center_column">
                            <div className="grid_3x2">{renderSeats(9, 6)}</div>
                            <div className="grid_3x2">{renderSeats(15, 6)}</div>
                        </div>

                        {/* 중앙 오른쪽: 3x2 블록 2개 */}
                        <div className="center_column">
                            <div className="grid_3x2">{renderSeats(21, 6)}</div>
                            <div className="grid_3x2">{renderSeats(27, 6)}</div>
                        </div>

                        {/* 오른쪽 열: 8석 (33~40) */}
                        <div className="side_column">
                            {renderSeats(33, 8)}
                        </div>

                    </div>
                </div>

                <CongestionBar
                    total={TOTAL_SEATS}
                    reserved={reservedSeats.length}
                    title="옆 라운지 혼잡도"
                    myReservedSeat={myReservedSeat}
                    bookingEndTime={bookingEndTime}
                    onReturn={onReturn}
                    onExtend={onExtend}
                />
            </div>

            {selectedSeat !== null && (
                <div className="modal_overlay" onClick={() => setSelectedSeat(null)}>
                    <div className="modal_content" onClick={(e) => e.stopPropagation()}>
                        
                        <div className="modern_badge">No.{selectedSeat}</div>
                        
                        <div className="modal_header">
                            <p className="room_name">옆 라운지</p>
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