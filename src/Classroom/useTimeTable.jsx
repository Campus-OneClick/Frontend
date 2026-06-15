import { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import httpClient from "../api/httpClient";
import {
    DAY_MAP, DAY_KO_TO_EN, MAX_RESERVATIONS_PER_WEEK,
    SLOTS, timeToSlot, getWeekDates
} from "./timeTableUtils";

export function useTimeTable(selectedDate) {
    const { roomId } = useParams();

    const [schedule, setSchedule] = useState([]);
    const [allPending, setAllPending] = useState([]);
    const [selected, setSelected] = useState(null);
    const [duration, setDuration] = useState(4);
    const [memo, setMemo] = useState("");

    const fetchData = useCallback(async () => {
        try {
            const results = await Promise.all([
                httpClient.get("/schedules"),
                httpClient.get(`/classrooms/${roomId}/reservations`),
            ]);
            const scheduleRes = results[0];
            const reservationRes = results[1];

            // 시간표에서 수업시간표를 추가하기 위함
            const roomSchedules = scheduleRes.data
                .filter(s =>
                    s.classroomEntity && (
                        s.classroomEntity.classroomId === roomId ||
                        s.classroomEntity.roomName === roomId
                    )
                )
                .map(s => ({
                    day: s.day,
                    startSlot: timeToSlot(s.startTime),
                    durationSlots: timeToSlot(s.endTime) - timeToSlot(s.startTime),
                    subject: s.subject,
                }));

            // 다른  사용자가 예약 대기나 예약된 상태를 저장
            const roomReservations = reservationRes.data
                .filter(r => r.status === 0 || r.status === 1)
                .map(r => {
                    const [startStr, endStr] = r.time.split(" ~ ");
                    const startSlot = timeToSlot(startStr.trim());
                    const endSlot = timeToSlot(endStr.trim());
                    return {
                        id: r.id,
                        type: r.type,
                        num: r.num,
                        user: r.user,
                        day: DAY_KO_TO_EN[r.day] || r.day,
                        date: r.date,
                        startSlot,
                        durationSlots: endSlot - startSlot,
                        subject: r.status === 0 ? "승인 대기" : "승인됨",
                        isPending: r.status === 0,
                    };
                });

            setSchedule(roomSchedules);
            setAllPending(roomReservations);
        } catch (err) {
            console.error("시간표 로드 실패:", err);
        }
    }, [roomId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // 선택한 주 날짜 계산
    const weekDates = selectedDate ? getWeekDates(selectedDate) : null;

    // 날짜 스플릿해서 각각 넣기
    const weekDateStrings = weekDates
        ? new Set(weekDates.map(d => {
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, "0");
            const dd = String(d.getDate()).padStart(2, "0");
            return `${y}/${m}/${dd}`;
        }))
        : new Set();

    // 그 주에 해당하는 예약만 필터링
    const pending = allPending.filter(r => weekDateStrings.has(r.date));

    // 선택한 슬롯이 시간표 끝을 넘어가는 것을 막음 (7시 이후까지 예약이 넘어가는 것을 막음)
    const maxDuration = selected ? SLOTS.length - selected.slotIdx : 12;
    const effectiveDuration = Math.min(duration, maxDuration);

    const DAY_KO_INDEX = { "월": 0, "화": 1, "수": 2, "목": 3, "금": 4 };

    // 클릭한 셀에 대해서 유효한지 확인
    const handleCellClick = (dayKo, slotIdx) => {
        const slotDate = weekDates[DAY_KO_INDEX[dayKo]];
        const [h, m] = SLOTS[slotIdx].split(":").map(Number);
        const slotDateTime = new Date(slotDate);
        slotDateTime.setHours(h, m, 0, 0);
        // 지난 날짜의 시간인지 check
        if (slotDateTime < new Date()) return;

        // schedule에서 같은 요일이면서 클릭한 스롨 인덱스가 강의 시작, 끝 범위에 있는지 확인
        const apiDay = DAY_MAP[dayKo];
        // 강의시간표와 비교하여 겹치는 시간이 있는지 확인 (선택 범위 전체 체크)
        const hasLecture = schedule.find(
            s => s.day === apiDay &&
                slotIdx < s.startSlot + s.durationSlots &&
                endSlotIdx > s.startSlot
        );
        // 다른 사용자가 예약한 슬롯이랑 겹치는지 확인 (클릭한 시작 슬롯 + duration 범위 전체 체크)
        const endSlotIdx = slotIdx + effectiveDuration;
        const hasPending = pending.find(
            p => p.day === apiDay &&
                slotIdx < p.startSlot + p.durationSlots &&
                endSlotIdx > p.startSlot
        );

        // 겹치면 리턴하여 클릭 안되겠끔
        if (hasLecture || hasPending) return;

        // 선택한 슬롯이 기존에 선택한 시간이면 취소 / 아니면 교체
        if (selected && selected.day === dayKo && selected.slotIdx === slotIdx) {
            setSelected(null);
            setMemo("");
        } else {
            setSelected({ day: dayKo, slotIdx });
            setMemo("");
        }
    };

    const handleReserve = async () => {
        if (!selected) return;
        if (pending.length >= MAX_RESERVATIONS_PER_WEEK) {
            alert(`일주일에 최대 ${MAX_RESERVATIONS_PER_WEEK}개의 강의실만 예약 신청할 수 있습니다.`);
            return;
        }
        // 서버에 넣을 값들을 정렬
        const apiDay = DAY_MAP[selected.day];
        const startTime = SLOTS[selected.slotIdx];
        const endTime = SLOTS[Math.min(selected.slotIdx + effectiveDuration, SLOTS.length - 1)];
        const studentId = sessionStorage.getItem("studentId");
        if (!studentId) {
            alert("로그인이 필요합니다.");
            return;
        }

        // 요일의 실제 날짜 객체를 꺼내서 "2026/07/07"과 같은 문자열로 만들어버림
        const DAY_KO_INDEX = { "월": 0, "화": 1, "수": 2, "목": 3, "금": 4 };
        const slotDate = weekDates[DAY_KO_INDEX[selected.day]];
        const dateStr = `${slotDate.getFullYear()}/${String(slotDate.getMonth() + 1).padStart(2, "0")}/${String(slotDate.getDate()).padStart(2, "0")}`;

        // 서버로 데이터 전달 (POST)
        try {
            await httpClient.post("/classrooms/reserve", {
                roomId, day: apiDay, date: dateStr, startTime, endTime, studentId, memo,
            });
            await fetchData();
            setSelected(null);
            setMemo("");
            alert(`예약 신청이 완료되었습니다.\n${selected.day}요일 ${startTime} ~ ${endTime}\n\n관리자 승인 후 예약이 확정됩니다.`);
        } catch (err) {
            console.error(err);
            alert("예약 신청에 실패했습니다. 다시 시도해주세요.");
        }
    };

    const handleCancelReservation = async (pendingItem) => {
        if (!pendingItem.isPending) return;
        if (!pendingItem.type || pendingItem.num == null) {
            alert("예약 정보를 불러올 수 없습니다. 페이지를 새로고침 후 시도해주세요.");
            return;
        }
        const studentId = sessionStorage.getItem("studentId");
        // 사용자 여부 판단
        if (pendingItem.user !== studentId) {
            alert("이미 다른 학생이 신청한 시간대입니다.");
            return;
        }
        // 예약 취소
        if (!window.confirm("승인 대기중인 예약을 취소하시겠습니까?")) return;
        try {
            await httpClient.delete(`/reservations/${pendingItem.type}/${pendingItem.num}`);
            setAllPending(prev => prev.filter(p => p.id !== pendingItem.id));
            alert("예약이 취소되었습니다.");
        } catch (err) {
            console.error(err);
            alert("예약 취소에 실패했습니다. 다시 시도해주세요.");
        }
    };

    return {
        roomId,
        schedule,
        pending,
        selected, setSelected,
        duration, setDuration,
        memo, setMemo,
        weekDates,
        maxDuration,
        effectiveDuration,
        handleCellClick,
        handleReserve,
        handleCancelReservation,
    };
}
