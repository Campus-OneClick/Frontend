import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import httpClient from "../api/httpClient";
import './Floor1.css';

import { LoungeDetailCenter } from './LoungeDetailCenter';
import { LoungeDetailSide } from './LoungeDetailSide';
import { Floor1MainView } from './Floor1MainView';

const LOUNGE_LABEL = { center: '중앙', side: '사이드' };

export function Floor1() {
    const navigate = useNavigate();
    const { lounge } = useParams(); // 'center' | 'side' | undefined

    const [loungeData, setLoungeData] = useState({
        center: { reservedSeats: [], myReservedSeat: null, bookingEndTime: null },
        side:   { reservedSeats: [], myReservedSeat: null, bookingEndTime: null },
    });

    const getStudentId = () => sessionStorage.getItem('studentId');

    const loadSeatState = useCallback(async () => {
        const studentId = getStudentId();
        if (!studentId) { navigate('/login'); return; }

        try {
            const res = await httpClient.get('/seats', { params: { studentId } });
            const mySeat = res.data.mySeat;

            setLoungeData({
                center: {
                    reservedSeats: res.data.centerSeats || [],
                    myReservedSeat: mySeat && mySeat.lounge === 'center' ? mySeat.seatId : null,
                    bookingEndTime: mySeat && mySeat.lounge === 'center' && mySeat.endTime
                        ? new Date(mySeat.endTime) : null,
                },
                side: {
                    reservedSeats: res.data.sideSeats || [],
                    myReservedSeat: mySeat && mySeat.lounge === 'side' ? mySeat.seatId : null,
                    bookingEndTime: mySeat && mySeat.lounge === 'side' && mySeat.endTime
                        ? new Date(mySeat.endTime) : null,
                },
            });
        } catch (err) {
            console.error('좌석 정보 불러오기 실패:', err);
        }
    }, [navigate]);

    useEffect(() => {
        loadSeatState();
    }, [loadSeatState]);

    // 예약
    const handleReserve = async (targetLounge, seatId) => {
        const studentId = getStudentId();
        if (!studentId) { alert('로그인이 필요합니다.'); navigate('/login'); return; }

        const otherLounge = targetLounge === 'center' ? 'side' : 'center';
        const otherSeat = loungeData[otherLounge].myReservedSeat;
        if (otherSeat !== null) {
            alert(`이미 ${LOUNGE_LABEL[otherLounge]} 라운지 ${otherSeat}번 좌석을 예약 중입니다.\n반납 후 이용해주세요.`);
            return;
        }

        try {
            const res = await httpClient.post('/seats/use', { seatId, lounge: targetLounge, studentId });
            alert(res.data.message || `${seatId}번 좌석 배정이 완료되었습니다!`);
            await loadSeatState();
        } catch (err) {
            alert(err.response && err.response.data ? err.response.data.message : '예약에 실패했습니다. 다시 시도해주세요.');
            await loadSeatState();
            console.error(err);
        }
    };

    // 반납
    const handleReturn = async (targetLounge) => {
        const studentId = getStudentId();
        if (!studentId) { alert('로그인이 필요합니다.'); navigate('/login'); return; }

        const { myReservedSeat } = loungeData[targetLounge];
        if (!window.confirm(`${myReservedSeat}번 좌석을 반납하시겠습니까?`)) return;

        try {
            const res = await httpClient.post('/seats/end', { seatId: myReservedSeat, lounge: targetLounge, studentId });
            alert(res.data.message || '반납이 완료되었습니다.');
            await loadSeatState();
        } catch (err) {
            alert(err.response && err.response.data ? err.response.data.message : '반납에 실패했습니다. 다시 시도해주세요.');
            await loadSeatState();
            console.error(err);
        }
    };

    // 연장
    const handleExtend = async (targetLounge) => {
        const studentId = getStudentId();
        if (!studentId) { alert('로그인이 필요합니다.'); navigate('/login'); return; }

        const { myReservedSeat, bookingEndTime } = loungeData[targetLounge];
        if (!bookingEndTime) return;

        const remaining = (bookingEndTime - new Date()) / 1000 / 60;
        if (remaining > 60) { alert('퇴실 1시간 전부터 연장이 가능합니다.'); return; }

        try {
            const res = await httpClient.post('/seats/extend', { seatId: myReservedSeat, lounge: targetLounge, studentId });
            alert(res.data.message || '이용 시간이 1시간 연장되었습니다!');
            await loadSeatState();
        } catch (err) {
            alert(err.response && err.response.data ? err.response.data.message : '연장에 실패했습니다. 다시 시도해주세요.');
            await loadSeatState();
            console.error(err);
        }
    };

    // 라운지 상세 뷰
    if (lounge === 'center') {
        const d = loungeData.center;
        return (
            <LoungeDetailCenter
                reservedSeats={d.reservedSeats}
                myReservedSeat={d.myReservedSeat}
                bookingEndTime={d.bookingEndTime}
                onReserve={(seatId) => handleReserve('center', seatId)}
                onReturn={() => handleReturn('center')}
                onExtend={() => handleExtend('center')}
                onBack={() => navigate('/floor1')}
            />
        );
    }

    if (lounge === 'side') {
        const d = loungeData.side;
        return (
            <LoungeDetailSide
                reservedSeats={d.reservedSeats}
                myReservedSeat={d.myReservedSeat}
                bookingEndTime={d.bookingEndTime}
                onReserve={(seatId) => handleReserve('side', seatId)}
                onReturn={() => handleReturn('side')}
                onExtend={() => handleExtend('side')}
                onBack={() => navigate('/floor1')}
            />
        );
    }

    // 메인 도면 뷰
    return (
        <Floor1MainView
            onNavigate={navigate}
        />
    );
}
