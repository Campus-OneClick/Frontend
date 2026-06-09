import React from 'react';
import './Floor1.css';
import floor1Image from './img/floor1.jpg';

const LOUNGE_TOTAL = { center: 38, side: 40 };

function getCongestionColor(ratio) {
    if (ratio >= 0.71) return '#F44336';
    if (ratio >= 0.41) return '#FFC107';
    return '#4CAF50';
}

export function Floor1MainView({ centerData, sideData, onNavigate }) {
    const centerRatio = centerData.reservedSeats.length / LOUNGE_TOTAL.center;
    const sideRatio   = sideData.reservedSeats.length  / LOUNGE_TOTAL.side;

    return (
        <div className="f1_container">
            <div className="f1_header">
                <div>
                    <h1 className="f1_title">1층 시설 안내</h1>
                    <p className="f1_subtitle">이용하실 공간을 지도에서 선택해주세요.</p>
                </div>
                <button className="floor1_main_btn" onClick={() => onNavigate('/')}>
                    메인으로
                </button>
            </div>

            <div className="f1_card map_card">
                <div className="map_wrapper">
                    <img src={floor1Image} alt="1층 도면" className="floor_img" />
                    <button className="map_pin center_pin" onClick={() => onNavigate('/floor1/center')}>
                        중앙 라운지
                    </button>
                    <button className="map_pin side_pin" onClick={() => onNavigate('/floor1/side')}>
                        옆 라운지
                    </button>
                </div>
            </div>

            <div className="f1_list_container">
                <h2 className="list_title">빠른 이동</h2>

                <div className="f1_list_card" onClick={() => onNavigate('/floor1/center')}>
                    <div className="card_text">
                        <h3>중앙 라운지</h3>
                        <p>넓고 쾌적한 메인 휴식 공간</p>
                    </div>
                    <div className="card_congestion">
                        <div className="progress_bg">
                            <div className="progress_fill" style={{
                                width: `${Math.floor(centerRatio * 100)}%`,
                                backgroundColor: getCongestionColor(centerRatio),
                            }} />
                        </div>
                        <span className="card_congestion_count">
                            {centerData.reservedSeats.length} / {LOUNGE_TOTAL.center}석
                        </span>
                    </div>
                </div>

                <div className="f1_list_card" onClick={() => onNavigate('/floor1/side')}>
                    <div className="card_text">
                        <h3>옆 라운지</h3>
                        <p>조용하게 집중하기 좋은 공간</p>
                    </div>
                    <div className="card_congestion">
                        <div className="progress_bg">
                            <div className="progress_fill" style={{
                                width: `${Math.floor(sideRatio * 100)}%`,
                                backgroundColor: getCongestionColor(sideRatio),
                            }} />
                        </div>
                        <span className="card_congestion_count">
                            {sideData.reservedSeats.length} / {LOUNGE_TOTAL.side}석
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
