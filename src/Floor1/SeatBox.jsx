// SeatBox.jsx
import React from 'react';

export function SeatBox({ seatId, isReserved, onClick }) {
    return (
        <div 
            className={`seat ${isReserved ? 'reserved' : ''}`} 
            onClick={() => onClick(seatId)}
        >
            <span className="seat_number_text">{seatId}</span>
        </div>
    );
}