import React from 'react';
import './LoungeDetail.css'; // ⭐️ 분리한 CSS 파일 불러오기

export function LoungeDetail({ title, onBack }) {
    return (
        <div className="lounge_detail_container">
            <h2 className="lounge_detail_title">{title} 예약 화면입니다 🛋️</h2>
            
            <p className="lounge_detail_desc">
                (이곳에 나중에 CSS Grid를 이용해 세부 좌석들을 만들 예정입니다.)
            </p>
            
            {/* 뒤로 가기 버튼 */}
            <button 
                className="lounge_detail_back_btn" 
                onClick={onBack}
            >
                ⬅️ 다시 도면으로 돌아가기
            </button>
        </div>
    );
}