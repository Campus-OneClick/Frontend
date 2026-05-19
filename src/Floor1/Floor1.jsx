import React, { useState, useEffect } from "react";
import './Floor1.css';
import floor1Image from './img/floor1.jpg'; 

import { LoungeDetail_center } from './LoungeDetail_center';
import { LoungeDetail_side } from './LoungeDetail_side';

export function Floor1(){
    const [currentView, setCurrentView] = useState('map');

    // 중앙 라운지 전용 상태
    const [centerReservedSeats, setCenterReservedSeats] = useState([]);
    const [centerMyReservedSeat, setCenterMyReservedSeat] = useState(null);
    const [centerBookingEndTime, setCenterBookingEndTime] = useState(null);

    // 사이드 라운지 전용 상태
    const [sideReservedSeats, setSideReservedSeats] = useState([]);
    const [sideMyReservedSeat, setSideMyReservedSeat] = useState(null);
    const [sideBookingEndTime, setSideBookingEndTime] = useState(null);

    // ──────────────────────────────────────────
    // 백엔드 구조가 정확히 어떻게 되어있는지 몰라서 일단 간단하게 구조만 만들어놨습니다.
    // 예상 응답 예시: { "centerSeats": [1, 3], "sideSeats": [2] }
    // 실제 응답 구조 확인 후 data.centerSeats, data.sideSeats 필드명 수정 필요
    // [API 1] GET /seats -> 앱 시작 시 전체 좌석 상태 불러오기
    useEffect(() => {
        fetch('/seats')
            .then(res => res.json())
            .then(data => {
                setCenterReservedSeats(data.centerSeats ?? []);
                setSideReservedSeats(data.sideSeats ?? []);
            })
            .catch(err => console.error('좌석 정보 불러오기 실패:', err));
    }, []);

    // [API 2] POST /seats/use
    const handleCenterReserve = async (seatId) => {
        if (sideMyReservedSeat !== null) {
            alert(`이미 사이드 라운지 ${sideMyReservedSeat}번 좌석을 예약 중입니다.\n반납 후 이용해주세요.`);
            return;
        }
        try {
            const res = await fetch('/seats/use', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ seatId, lounge: 'center' }),
            });
            if (!res.ok) throw new Error('예약 실패');

            setCenterReservedSeats(prev => [...prev, seatId]);
            setCenterMyReservedSeat(seatId);
            const endTime = new Date();
            endTime.setHours(endTime.getHours() + 2);
            setCenterBookingEndTime(endTime);
            alert(`${seatId}번 좌석 배정이 완료되었습니다!`);
        } catch (err) {
            alert('예약에 실패했습니다. 다시 시도해주세요.');
            console.error(err);
        }
    };

    // [API 3] POST /seats/end
    const handleCenterReturn = async () => {
        if (!window.confirm(`${centerMyReservedSeat}번 좌석을 반납하시겠습니까?`)) return;
        try {
            const res = await fetch('/seats/end', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ seatId: centerMyReservedSeat, lounge: 'center' }),
            });
            if (!res.ok) throw new Error('반납 실패');

            setCenterReservedSeats(prev => prev.filter(id => id !== centerMyReservedSeat));
            setCenterMyReservedSeat(null);
            setCenterBookingEndTime(null);
            alert('반납이 완료되었습니다.');
        } catch (err) {
            alert('반납에 실패했습니다. 다시 시도해주세요.');
            console.error(err);
        }
    };

    const handleCenterExtend = () => {
        if (!centerBookingEndTime) return;
        const now = new Date();
        const timeDiffMin = (centerBookingEndTime - now) / (1000 * 60);
        if (timeDiffMin > 60) {
            alert(`아직 이용 시간이 많이 남았습니다.\n퇴실 1시간 전부터 연장이 가능합니다.\n(남은 시간: ${Math.floor(timeDiffMin)}분)`);
        } else {
            setCenterBookingEndTime(new Date(centerBookingEndTime.getTime() + 60 * 60 * 1000));
            alert('이용 시간이 1시간 연장되었습니다!');
        }
    };

    // ── 사이드 라운지 핸들러 ──

    // [API 2] POST /seats/use
    const handleSideReserve = async (seatId) => {
        if (centerMyReservedSeat !== null) {
            alert(`이미 중앙 라운지 ${centerMyReservedSeat}번 좌석을 예약 중입니다.\n반납 후 이용해주세요.`);
            return;
        }
        try {
            const res = await fetch('/seats/use', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // seatId, lounge 필드명 백엔드 명세 확인 후 수정 필요
                body: JSON.stringify({ seatId, lounge: 'side' }),
            });
            if (!res.ok) throw new Error('예약 실패');

            setSideReservedSeats(prev => [...prev, seatId]);
            setSideMyReservedSeat(seatId);
            const endTime = new Date();
            endTime.setHours(endTime.getHours() + 2);
            setSideBookingEndTime(endTime);
            alert(`${seatId}번 좌석 배정이 완료되었습니다!`);
        } catch (err) {
            alert('예약에 실패했습니다. 다시 시도해주세요.');
            console.error(err);
        }
    };

    // [API 3] POST /seats/end
    const handleSideReturn = async () => {
        if (!window.confirm(`${sideMyReservedSeat}번 좌석을 반납하시겠습니까?`)) return;
        try {
            const res = await fetch('/seats/end', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ seatId: sideMyReservedSeat, lounge: 'side' }),
            });
            if (!res.ok) throw new Error('반납 실패');

            setSideReservedSeats(prev => prev.filter(id => id !== sideMyReservedSeat));
            setSideMyReservedSeat(null);
            setSideBookingEndTime(null);
            alert('반납이 완료되었습니다.');
        } catch (err) {
            alert('반납에 실패했습니다. 다시 시도해주세요.');
            console.error(err);
        }
    };

    const handleSideExtend = () => {
        if (!sideBookingEndTime) return;
        const now = new Date();
        const timeDiffMin = (sideBookingEndTime - now) / (1000 * 60);
        if (timeDiffMin > 60) {
            alert(`아직 이용 시간이 많이 남았습니다.\n퇴실 1시간 전부터 연장이 가능합니다.\n(남은 시간: ${Math.floor(timeDiffMin)}분)`);
        } else {
            setSideBookingEndTime(new Date(sideBookingEndTime.getTime() + 60 * 60 * 1000));
            alert('이용 시간이 1시간 연장되었습니다!');
        }
    };

    if (currentView === 'center_lounge') {
        return (
            <LoungeDetail_center 
                reservedSeats={centerReservedSeats}
                myReservedSeat={centerMyReservedSeat}
                bookingEndTime={centerBookingEndTime}
                onReserve={handleCenterReserve}
                onReturn={handleCenterReturn}
                onExtend={handleCenterExtend}
                onBack={() => setCurrentView('map')} 
            />
        );
    }

    if (currentView === 'side_lounge') {
        return (
            <LoungeDetail_side 
                reservedSeats={sideReservedSeats}
                myReservedSeat={sideMyReservedSeat}
                bookingEndTime={sideBookingEndTime}
                onReserve={handleSideReserve}
                onReturn={handleSideReturn}
                onExtend={handleSideExtend}
                onBack={() => setCurrentView('map')} 
            />
        );
    }

    return (
        <div className="toss_container">
            
            <div className="toss_header">
                <h1 className="toss_title">1층 시설 안내</h1>
                <p className="toss_subtitle">이용하실 공간을 지도에서 선택해주세요.</p>
            </div>

            <div className="toss_card map_card">
                <div className="map_wrapper"> 
                    <img src={floor1Image} alt="1층 도면" className="floor_img" />
                    
                    <button 
                        className="toss_pin center_pin"
                        onClick={() => setCurrentView('center_lounge')}
                    >
                        중앙 라운지
                    </button>

                    <button 
                        className="toss_pin side_pin"
                        onClick={() => setCurrentView('side_lounge')}
                    >
                        옆 라운지
                    </button>
                </div>
            </div>

            <div className="toss_list_container">
                <h2 className="list_title">빠른 이동</h2>
                
                <div className="toss_list_card" onClick={() => setCurrentView('center_lounge')}>
                    <div className="card_text">
                        <h3>중앙 라운지</h3>
                        <p>넓고 쾌적한 메인 휴식 공간</p>
                    </div>
                    <div className="card_icon">🛋️</div>
                </div>

                <div className="toss_list_card" onClick={() => setCurrentView('side_lounge')}>
                    <div className="card_text">
                        <h3>옆 라운지</h3>
                        <p>조용하게 집중하기 좋은 공간</p>
                    </div>
                    <div className="card_icon">📚</div>
                </div>
            </div>

        </div>
    );
}