import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import httpClient from "../api/httpClient";
import './Floor1.css';
import floor1Image from './img/floor1.jpg';

import { LoungeDetailCenter } from './LoungeDetailCenter';
import { LoungeDetailSide } from './LoungeDetailSide';

export function Floor1() {
    const navigate = useNavigate();
    const { lounge } = useParams(); // 'center' | 'side' | undefined

    const [centerReservedSeats, setCenterReservedSeats] = useState([]);
    const [centerMyReservedSeat, setCenterMyReservedSeat] = useState(null);
    const [centerBookingEndTime, setCenterBookingEndTime] = useState(null);

    const [sideReservedSeats, setSideReservedSeats] = useState([]);
    const [sideMyReservedSeat, setSideMyReservedSeat] = useState(null);
    const [sideBookingEndTime, setSideBookingEndTime] = useState(null);

    const getStudentId = () => sessionStorage.getItem('studentId');

const loadSeatState = useCallback(async () => {
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
            setCenterBookingEndTime(
                mySeat.endTime ? new Date(mySeat.endTime) : null
            );

            setSideMyReservedSeat(null);
            setSideBookingEndTime(null);

        } else if (mySeat?.lounge === 'side') {

            setSideMyReservedSeat(mySeat.seatId ?? null);
            setSideBookingEndTime(
                mySeat.endTime ? new Date(mySeat.endTime) : null
            );

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
}, [navigate]);

    useEffect(() => {
        loadSeatState();
    }, [loadSeatState]);

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

        const remaining = (centerBookingEndTime - new Date()) / 1000 / 60; // 분 단위
        if (remaining > 60) {
            alert('퇴실 1시간 전부터 연장이 가능합니다.');
            return;
        }

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

        const remaining = (sideBookingEndTime - new Date()) / 1000 / 60; // 분 단위
        if (remaining > 60) {
            alert('퇴실 1시간 전부터 연장이 가능합니다.');
            return;
        }

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

    if (lounge === 'center') {
        return (
            <LoungeDetailCenter
                reservedSeats={centerReservedSeats}
                myReservedSeat={centerMyReservedSeat}
                bookingEndTime={centerBookingEndTime}
                onReserve={handleCenterReserve}
                onReturn={handleCenterReturn}
                onExtend={handleCenterExtend}
                onBack={() => navigate('/floor1')}
            />
        );
    }

    if (lounge === 'side') {
        return (
            <LoungeDetailSide
                reservedSeats={sideReservedSeats}
                myReservedSeat={sideMyReservedSeat}
                bookingEndTime={sideBookingEndTime}
                onReserve={handleSideReserve}
                onReturn={handleSideReturn}
                onExtend={handleSideExtend}
                onBack={() => navigate('/floor1')}
            />
        );
    }

    return (
        <div className="f1_container">
            <div className="f1_header">
                <div>
                    <h1 className="f1_title">1층 시설 안내</h1>
                    <p className="f1_subtitle">이용하실 공간을 지도에서 선택해주세요.</p>
                </div>
                <button className="floor1_main_btn" onClick={() => navigate('/')}>
                    메인으로
                </button>
            </div>

            <div className="f1_card map_card">
                <div className="map_wrapper">
                    <img src={floor1Image} alt="1층 도면" className="floor_img" />

                    <button
                        className="map_pin center_pin"
                        onClick={() => navigate('/floor1/center')}
                    >
                        중앙 라운지
                    </button>

                    <button
                        className="map_pin side_pin"
                        onClick={() => navigate('/floor1/side')}
                    >
                        옆 라운지
                    </button>
                </div>
            </div>

            <div className="f1_list_container">
                <h2 className="list_title">빠른 이동</h2>

                <div className="f1_list_card" onClick={() => navigate('/floor1/center')}>
                    <div className="card_text">
                        <h3>중앙 라운지</h3>
                        <p>넓고 쾌적한 메인 휴식 공간</p>
                    </div>
                    <div className="card_congestion">
                        <div className="progress_bg">
                            <div className="progress_fill" style={{
                                width: `${Math.floor((centerReservedSeats.length / 38) * 100)}%`,
                                backgroundColor: centerReservedSeats.length / 38 >= 0.71 ? '#F44336' : centerReservedSeats.length / 38 >= 0.41 ? '#FFC107' : '#4CAF50'
                            }} />
                        </div>
                        <span className="card_congestion_count">{centerReservedSeats.length} / 38석</span>
                    </div>
                </div>

                <div className="f1_list_card" onClick={() => navigate('/floor1/side')}>
                    <div className="card_text">
                        <h3>옆 라운지</h3>
                        <p>조용하게 집중하기 좋은 공간</p>
                    </div>
                    <div className="card_congestion">
                        <div className="progress_bg">
                            <div className="progress_fill" style={{
                                width: `${Math.floor((sideReservedSeats.length / 40) * 100)}%`,
                                backgroundColor: sideReservedSeats.length / 40 >= 0.71 ? '#F44336' : sideReservedSeats.length / 40 >= 0.41 ? '#FFC107' : '#4CAF50'
                            }} />
                        </div>
                        <span className="card_congestion_count">{sideReservedSeats.length} / 40석</span>
                    </div>
                </div>
            </div>
        </div>
    );
}