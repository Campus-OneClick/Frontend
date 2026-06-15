import { useNavigate } from "react-router-dom";
import MonthCalendar from "./MonthCalendar";
import ReservationPanel from "./ReservationPanel";
import TimeTableGrid from "./TimeTableGrid";
import { useCalendar } from "./useCalendar";
import { useTimeTable } from "./useTimeTable";
import { SLOTS, MAX_RESERVATIONS_PER_WEEK } from "./timeTableUtils";
import "./TimeTable.css";

export default function TimeTablePage() {
    const navigate = useNavigate();
    const today = new Date();

    const { currentMonth, selectedDate, setSelectedDate, prevMonth, nextMonth } = useCalendar(today);

    const {
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
    } = useTimeTable(selectedDate);

    const handleDateClick = (day) => {
        if (!day) return;
        // 날짜 대한 정보를 가져옴.
        const date = new Date(currentMonth.year, currentMonth.month, day);
        // 요일만 꺼내서 보고
        const dow = date.getDay();
        // 토,일이면 리턴
        if (dow === 0 || dow === 6) return;
        // 토,일이 아니면 그 data에 대한 시간표를 보여주고, 
        // 이전에 선택했던 슬롯에 대한 정보 지우기
        setSelectedDate(date);
        setSelected(null);
        setMemo("");
    };

    return (
        <div className="tt_container">

            <div className="tt_header">
                <div>
                    <h2 className="tt_title">강의실 {roomId}</h2>
                    <p className="tt_subtitle">날짜를 선택하면 해당 주 시간표가 표시됩니다</p>
                </div>
                <button className="tt_back_btn" onClick={() => navigate(-1)}>돌아가기</button>
            </div>

            <MonthCalendar
                currentMonth={currentMonth}
                selectedDate={selectedDate}
                today={today}
                onPrevMonth={prevMonth}
                onNextMonth={nextMonth}
                onDateClick={handleDateClick}
            />

            {selectedDate && weekDates && (
                <>
                    <div className="tt_week_label">
                        {weekDates[0].getMonth() + 1}/{weekDates[0].getDate()}(월) ~ {weekDates[4].getMonth() + 1}/{weekDates[4].getDate()}(금) 시간표
                    </div>

                    <div className="tt_legend">
                        <span className="tt_legend_item lecture">강의</span>
                        <span className="tt_legend_item my_pending">내 신청</span>
                        <span className="tt_legend_item others_pending">타인 신청</span>
                        <span className="tt_legend_item approved">예약 완료</span>
                        <span className="tt_legend_item empty">빈 강의실</span>
                    </div>

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

                    <TimeTableGrid
                        weekDates={weekDates}
                        slots={SLOTS}
                        schedule={schedule}
                        pending={pending}
                        selected={selected}
                        effectiveDuration={effectiveDuration}
                        onCellClick={handleCellClick}
                        onPendingClick={handleCancelReservation}
                        studentId={sessionStorage.getItem("studentId")}
                    />
                </>
            )}

        </div>
    );
}
