import React from 'react';
import './Floor1.css';
import floor1Image from './img/floor1.jpg';

export function Floor1MainView({ onNavigate }) {
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
        </div>
    );
}
