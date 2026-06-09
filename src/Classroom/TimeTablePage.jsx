import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import httpClient from "../api/httpClient";
import MonthCalendar from "./MonthCalendar";
import ReservationPanel from "./ReservationPanel";
import TimeTableGrid from "./TimeTableGrid";
import "./TimeTable.css";

const DAY_MAP = { "월": "MON", "화": "TUE", "수": "WED", "목": "THU", "금": "FRI" };
const DAY_KO_TO_EN = { "월": "MON", "화": "TUE", "수": "WED", "목": "THU", "금": "FRI" };
const MAX_RESERVATIONS_PER_WEEK = 2;

// 9:00 ~ 19:00, 30분 단위
const SLOTS = [];
for (let h = 9; h <= 19; h++) {
  SLOTS.push(`${h}:00`);
  if (h < 19) SLOTS.push(`${h}:30`);
}

function timeToSlot(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  return (h - 9) * 2 + (m >= 30 ? 1 : 0);
}

function getWeekDates(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(d);
  monday.setDate(d.getDate() + diff);
  return Array.from({ length: 5 }, (_, i) => {
    const dd = new Date(monday);
    dd.setDate(monday.getDate() + i);
    return dd;
  });
}

export default function TimeTablePage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const today = new Date();

  // 달력 state
  const [currentMonth, setCurrentMonth] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });
  const [selectedDate, setSelectedDate] = useState(null);

  // 시간표 state
  const [schedule, setSchedule] = useState([]);
  const [allPending, setAllPending] = useState([]);
  const [selected, setSelected] = useState(null);
  const [duration, setDuration] = useState(2);
  const [memo, setMemo] = useState("");

  // API 호출
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [scheduleRes, reservationRes] = await Promise.all([
          httpClient.get("/schedules"),
          httpClient.get(`/classrooms/${roomId}/reservations`),
        ]);

        const roomSchedules = scheduleRes.data
          .filter(s =>
            s.classroomEntity?.classroomId === roomId ||
            s.classroomEntity?.roomName === roomId
          )
          .map(s => ({
            day: s.day,
            startSlot: timeToSlot(s.startTime),
            durationSlots: timeToSlot(s.endTime) - timeToSlot(s.startTime),
            subject: s.subject,
          }));

        const roomReservations = reservationRes.data
          .filter(r => r.status === 0 || r.status === 1)
          .map(r => {
            const [startStr, endStr] = r.time.split(" ~ ");
            const startSlot = timeToSlot(startStr.trim());
            const endSlot = timeToSlot(endStr.trim());
            return {
              id: r.id,
              day: DAY_KO_TO_EN[r.day] || r.day,
              date: r.date,
              startSlot,
              durationSlots: endSlot - startSlot,
              subject: r.status === 0 ? "승인 대기" : "승인됨",
            };
          });

        setSchedule(roomSchedules);
        setAllPending(roomReservations);
      } catch (err) {
        console.error("시간표 로드 실패:", err);
      }
    };
    fetchData();
  }, [roomId]);

  // 달력 월 이동
  const prevMonth = () => setCurrentMonth(prev =>
    prev.month === 0
      ? { year: prev.year - 1, month: 11 }
      : { year: prev.year, month: prev.month - 1 }
  );

  const nextMonth = () => setCurrentMonth(prev =>
    prev.month === 11
      ? { year: prev.year + 1, month: 0 }
      : { year: prev.year, month: prev.month + 1 }
  );

  // 날짜 클릭 (주말 제외)
  const handleDateClick = (day) => {
    if (!day) return;
    const date = new Date(currentMonth.year, currentMonth.month, day);
    const dow = date.getDay();
    if (dow === 0 || dow === 6) return;
    setSelectedDate(date);
    setSelected(null);
    setMemo("");
  };

  // 시간표 셀 클릭
  const handleCellClick = (dayKo, slotIdx) => {
    const apiDay = DAY_MAP[dayKo];
    const hasLecture = schedule.find(
      s => s.day === apiDay && slotIdx >= s.startSlot && slotIdx < s.startSlot + s.durationSlots
    );
    const hasPending = pending.find(
      p => p.day === apiDay && slotIdx >= p.startSlot && slotIdx < p.startSlot + p.durationSlots
    );
    if (hasLecture || hasPending) return;

    if (selected?.day === dayKo && selected?.slotIdx === slotIdx) {
      setSelected(null);
      setMemo("");
    } else {
      setSelected({ day: dayKo, slotIdx });
      setMemo("");
    }
  };

  // 예약 신청
  const handleReserve = async () => {
    if (!selected) return;
    if (pending.length >= MAX_RESERVATIONS_PER_WEEK) {
      alert(`일주일에 최대 ${MAX_RESERVATIONS_PER_WEEK}개의 강의실만 예약 신청할 수 있습니다.`);
      return;
    }
    const apiDay = DAY_MAP[selected.day];
    const startTime = SLOTS[selected.slotIdx];
    const endTime = SLOTS[Math.min(selected.slotIdx + effectiveDuration, SLOTS.length - 1)];
    const studentId = sessionStorage.getItem("studentId");
    if (!studentId) {
      alert("로그인이 필요합니다.");
      return;
    }

    // 선택한 주의 실제 날짜 계산
    const DAY_KO_INDEX = { "월": 0, "화": 1, "수": 2, "목": 3, "금": 4 };
    const slotDate = weekDates[DAY_KO_INDEX[selected.day]];
    const dateStr = `${slotDate.getFullYear()}/${String(slotDate.getMonth() + 1).padStart(2, "0")}/${String(slotDate.getDate()).padStart(2, "0")}`;

    try {
      await httpClient.post("/classrooms/reserve", {
        roomId, day: apiDay, date: dateStr, startTime, endTime, studentId, memo,
      });
      setAllPending(prev => [
        ...prev,
        { day: apiDay, date: dateStr, startSlot: selected.slotIdx, durationSlots: effectiveDuration, subject: "승인 대기" },
      ]);
      setSelected(null);
      setMemo("");
      alert(`예약 신청이 완료되었습니다.\n${selected.day}요일 ${startTime} ~ ${endTime}\n\n관리자 승인 후 예약이 확정됩니다.`);
    } catch (err) {
      console.error(err);
      alert("예약 신청에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const weekDates = selectedDate ? getWeekDates(selectedDate) : null;

  // 선택한 주의 날짜 문자열 집합 ("yyyy/MM/dd" 형식)
  const weekDateStrings = weekDates
    ? new Set(weekDates.map(d => {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        return `${y}/${m}/${dd}`;
      }))
    : new Set();

  // 선택한 주에 해당하는 예약만 필터링
  const pending = allPending.filter(r => weekDateStrings.has(r.date));

  const maxDuration = selected ? SLOTS.length - selected.slotIdx : 6;
  const effectiveDuration = Math.min(duration, maxDuration);

  return (
    <div className="tt_container">

      {/* 헤더 */}
      <div className="tt_header">
        <div>
          <h2 className="tt_title">강의실 {roomId}</h2>
          <p className="tt_subtitle">날짜를 선택하면 해당 주 시간표가 표시됩니다</p>
        </div>
        <button className="tt_back_btn" onClick={() => navigate(-1)}>돌아가기</button>
      </div>

      {/* 달력 컴포넌트 */}
      <MonthCalendar
        currentMonth={currentMonth}
        selectedDate={selectedDate}
        today={today}
        onPrevMonth={prevMonth}
        onNextMonth={nextMonth}
        onDateClick={handleDateClick}
      />

      {/* 날짜 선택 후 */}
      {selectedDate && weekDates && (
        <>
          <div className="tt_week_label">
            {weekDates[0].getMonth() + 1}/{weekDates[0].getDate()}(월) ~ {weekDates[4].getMonth() + 1}/{weekDates[4].getDate()}(금) 시간표
          </div>

          <div className="tt_legend">
            <span className="tt_legend_item lecture">강의</span>
            <span className="tt_legend_item pending">승인 대기</span>
            <span className="tt_legend_item empty">빈 강의실</span>
          </div>

          {/* 예약 패널 컴포넌트 */}
          {selected && (
            <ReservationPanel
              selected={selected}
              duration={duration}
              setDuration={setDuration}
              memo={memo}
              setMemo={setMemo}
              effectiveDuration={effectiveDuration}
              maxDuration={maxDuration}
              pendingCount={pending.length}
              maxReservations={MAX_RESERVATIONS_PER_WEEK}
              slots={SLOTS}
              onReserve={handleReserve}
              onCancel={() => { setSelected(null); setMemo(""); }}
            />
          )}

          {/* 시간표 그리드 컴포넌트 */}
          <TimeTableGrid
            weekDates={weekDates}
            slots={SLOTS}
            schedule={schedule}
            pending={pending}
            selected={selected}
            effectiveDuration={effectiveDuration}
            onCellClick={handleCellClick}
          />
        </>
      )}

    </div>
  );
}
