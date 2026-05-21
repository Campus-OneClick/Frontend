import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import httpClient from "../api/httpClient";
import './Floor1.css';
import floor1Image from './img/floor1.jpg';

import { LoungeDetail_center } from './LoungeDetail_center';
import { LoungeDetail_side } from './LoungeDetail_side';

export function Floor1() {
    const navigate = useNavigate();
    const [currentView, setCurrentView] = useState('map');

    const [centerReservedSeats, setCenterReservedSeats] = useState([]);
    const [centerMyReservedSeat, setCenterMyReservedSeat] = useState(null);
    const [centerBookingEndTime, setCenterBookingEndTime] = useState(null);

    const [sideReservedSeats, setSideReservedSeats] = useState([]);
    const [sideMyReservedSeat, setSideMyReservedSeat] = useState(null);
    const [sideBookingEndTime, setSideBookingEndTime] = useState(null);

    const getStudentId = () => sessionStorage.getItem('studentId');

    const loadSeatState = async () => {
        const studentId = getStudentId();

        if (!studentId) {
            navigate('/login');
            return;
        }

        try {
            const res = await httpClient.get('/seats', {
                params: { studentId },
            });

            setCenterReservedSeats(res.data.centerSeats ?? []);
            setSideReservedSeats(res.data.sideSeats ?? []);

            const mySeat = res.data.mySeat;
            if (mySeat?.lounge === 'center') {
                setCenterMyReservedSeat(mySeat.seatId ?? null);
                setCenterBookingEndTime(mySeat.endTime ? new Date(mySeat.endTime) : null);
                setSideMyReservedSeat(null);
                setSideBookingEndTime(null);
            } else if (mySeat?.lounge === 'side') {
                setSideMyReservedSeat(mySeat.seatId ?? null);
                setSideBookingEndTime(mySeat.endTime ? new Date(mySeat.endTime) : null);
                setCenterMyReservedSeat(null);
                setCenterBookingEndTime(null);
            } else {
                setCenterMyReservedSeat(null);
                setCenterBookingEndTime(null);
                setSideMyReservedSeat(null);
                setSideBookingEndTime(null);
            }
        } catch (err) {
            console.error('좌석 정보 불러오기 실패:', err);
        }
    };

    useEffect(() => {
        loadSeatState();
    }, []);

    const handleCenterReserve = async (seatId) => {
        const studentId = getStudentId();
        if (!studentId) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        if (sideMyReservedSeat !== null) {
            alert(`이미 사이드 라운지 ${sideMyReservedSeat}번 좌석을 예약 중입니다.\n반납 후 이용해주세요.`);
            return;
        }

        try {
            const res = await httpClient.post('/seats/use', {
                seatId,
                lounge: 'center',
                studentId,
            });

            alert(res.data.message || `${seatId}번 좌석 배정이 완료되었습니다!`);
            await loadSeatState();
        } catch (err) {
            alert(err.response?.data?.message || '예약에 실패했습니다. 다시 시도해주세요.');
            console.error(err);
        }
    };

    const handleCenterReturn = async () => {
        const studentId = getStudentId();
        if (!studentId) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        if (!window.confirm(`${centerMyReservedSeat}번 좌석을 반납하시겠습니까?`)) return;

        try {
            const res = await httpClient.post('/seats/end', {
                seatId: centerMyReservedSeat,
                lounge: 'center',
                studentId,
            });

            alert(res.data.message || '반납이 완료되었습니다.');
            await loadSeatState();
        } catch (err) {
            alert(err.response?.data?.message || '반납에 실패했습니다. 다시 시도해주세요.');
            console.error(err);
        }
    };

    const handleCenterExtend = async () => {
        const studentId = getStudentId();
        if (!studentId) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        if (!centerBookingEndTime) return;

        try {
            const res = await httpClient.post('/seats/extend', {
                seatId: centerMyReservedSeat,
                lounge: 'center',
                studentId,
            });

            alert(res.data.message || '이용 시간이 1시간 연장되었습니다!');
            await loadSeatState();
        } catch (err) {
            alert(err.response?.data?.message || '연장에 실패했습니다. 다시 시도해주세요.');
            console.error(err);
        }
    };

    const handleSideReserve = async (seatId) => {
        const studentId = getStudentId();
        if (!studentId) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        if (centerMyReservedSeat !== null) {
            alert(`이미 중앙 라운지 ${centerMyReservedSeat}번 좌석을 예약 중입니다.\n반납 후 이용해주세요.`);
            return;
        }

        try {
            const res = await httpClient.post('/seats/use', {
                seatId,
                lounge: 'side',
                studentId,
            });

            alert(res.data.message || `${seatId}번 좌석 배정이 완료되었습니다!`);
            await loadSeatState();
        } catch (err) {
            alert(err.response?.data?.message || '예약에 실패했습니다. 다시 시도해주세요.');
            console.error(err);
        }
    };

    const handleSideReturn = async () => {
        const studentId = getStudentId();
        if (!studentId) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        if (!window.confirm(`${sideMyReservedSeat}번 좌석을 반납하시겠습니까?`)) return;

        try {
            const res = await httpClient.post('/seats/end', {
                seatId: sideMyReservedSeat,
                lounge: 'side',
                studentId,
            });

            alert(res.data.message || '반납이 완료되었습니다.');
            await loadSeatState();
        } catch (err) {
            alert(err.response?.data?.message || '반납에 실패했습니다. 다시 시도해주세요.');
            console.error(err);
        }
    };

    const handleSideExtend = async () => {
        const studentId = getStudentId();
        if (!studentId) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        if (!sideBookingEndTime) return;

        try {
            const res = await httpClient.post('/seats/extend', {
                seatId: sideMyReservedSeat,
                lounge: 'side',
                studentId,
            });

            alert(res.data.message || '이용 시간이 1시간 연장되었습니다!');
            await loadSeatState();
        } catch (err) {
            alert(err.response?.data?.message || '연장에 실패했습니다. 다시 시도해주세요.');
            console.error(err);
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