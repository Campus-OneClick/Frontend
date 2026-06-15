import React from 'react';
import './LoungeDetailCenter.css';
import { LoungeDetail } from './LoungeDetail';

export function LoungeDetailCenter(props) {
    const renderLayout = (renderSeats) => (
        <>
            <div className="top_section">
                <div className="top_group">{renderSeats(1, 2)}</div>
                <div className="top_group">{renderSeats(3, 2)}</div>
                <div className="top_group">{renderSeats(5, 2)}</div>
            </div>
            <div className="main_section">
                <div className="side_column">{renderSeats(7, 4)}</div>
                <div className="center_column">
                    <div className="grid_2x3">{renderSeats(11, 6)}</div>
                    <div className="grid_2x3">{renderSeats(17, 6)}</div>
                </div>
                <div className="center_column">
                    <div className="grid_2x3">{renderSeats(23, 6)}</div>
                    <div className="grid_2x3">{renderSeats(29, 6)}</div>
                </div>
                <div className="side_column">{renderSeats(35, 4)}</div>
            </div>
        </>
    );

    return (
        <LoungeDetail
            {...props}
            totalSeats={38}
            title="중앙 라운지 예약"
            loungeName="중앙 라운지"
            containerClass="lounge_center_container"
            renderLayout={renderLayout}
        />
    );
}
