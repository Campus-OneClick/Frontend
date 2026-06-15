import React from 'react';
import './LoungeDetailSide.css';
import { LoungeDetail } from './LoungeDetail';

export function LoungeDetailSide(props) {
    const renderLayout = (renderSeats) => (
        <div className="main_section">
            <div className="side_column">{renderSeats(1, 8)}</div>
            <div className="center_column">
                <div className="grid_3x2">{renderSeats(9, 6)}</div>
                <div className="grid_3x2">{renderSeats(15, 6)}</div>
            </div>
            <div className="center_column">
                <div className="grid_3x2">{renderSeats(21, 6)}</div>
                <div className="grid_3x2">{renderSeats(27, 6)}</div>
            </div>
            <div className="side_column">{renderSeats(33, 8)}</div>
        </div>
    );

    return (
        <LoungeDetail
            {...props}
            totalSeats={40}
            title="옆 라운지 예약"
            loungeName="옆 라운지"
            containerClass="lounge_side_container"
            renderLayout={renderLayout}
        />
    );
}
