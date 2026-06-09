import "./TimeTable.css";

const CAL_HEADERS = ["일", "월", "화", "수", "목", "금", "토"];

// 달력 그리드용 날짜 배열 (일요일 시작)
function getCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1).getDay(); // 0=일
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const padding = firstDay;
  const days = [];
  for (let i = 0; i < padding; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);
  return days;
}

// 선택한 날짜가 포함된 주의 월~금 Date 배열 반환
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

export default function MonthCalendar({
  currentMonth,
  selectedDate,
  today,
  onPrevMonth,
  onNextMonth,
  onDateClick,
}) {
  const { year, month } = currentMonth;
  const calDays = getCalendarDays(year, month);
  const weekDates = selectedDate ? getWeekDates(selectedDate) : null;

  const isSameWeek = (day) => {
    if (!weekDates || !day) return false;
    const date = new Date(year, month, day);
    return weekDates.some((wd) => wd.toDateString() === date.toDateString());
  };

  const isToday = (day) => {
    if (!day) return false;
    return new Date(year, month, day).toDateString() === today.toDateString();
  };

  const isSelectedDay = (day) => {
    if (!day || !selectedDate) return false;
    return new Date(year, month, day).toDateString() === selectedDate.toDateString();
  };

  const isWeekend = (day) => {
    if (!day) return false;
    const dow = new Date(year, month, day).getDay();
    return dow === 0 || dow === 6;
  };

  return (
    <div className="tt_calendar_wrap">
      <div className="tt_cal_nav">
        <button className="tt_cal_nav_btn" onClick={onPrevMonth}>〈</button>
        <span className="tt_cal_title">{year}년 {month + 1}월</span>
        <button className="tt_cal_nav_btn" onClick={onNextMonth}>〉</button>
      </div>
      <div className="tt_cal_grid">
        {CAL_HEADERS.map((d) => (
          <div
            key={d}
            className={`tt_cal_day_header ${d === "토" ? "tt_cal_sat" : d === "일" ? "tt_cal_sun" : ""}`}
          >
            {d}
          </div>
        ))}
        {calDays.map((day, idx) => (
          <div
            key={idx}
            className={[
              "tt_cal_cell",
              !day ? "tt_cal_empty" : "",
              isWeekend(day) ? "tt_cal_weekend" : "",
              isToday(day) ? "tt_cal_today" : "",
              isSelectedDay(day) ? "tt_cal_selected" : "",
              isSameWeek(day) && !isWeekend(day) && !isSelectedDay(day) ? "tt_cal_week" : "",
            ].join(" ")}
            onClick={() => onDateClick(day)}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
}
