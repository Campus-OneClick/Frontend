import "./TimeTable.css";

const DAY_KO = ["월", "화", "수", "목", "금"];
const DAY_MAP = { "월": "MON", "화": "TUE", "수": "WED", "목": "THU", "금": "FRI" };

export default function TimeTableGrid({
  weekDates,
  slots,
  schedule,
  pending,
  selected,
  effectiveDuration,
  onCellClick,
}) {
  const getLecture = (dayKo, slotIdx) => {
    const apiDay = DAY_MAP[dayKo];
    return schedule.find(
      (s) => s.day === apiDay && slotIdx >= s.startSlot && slotIdx < s.startSlot + s.durationSlots
    ) || null;
  };

  const isLectureStart = (dayKo, slotIdx) => {
    const apiDay = DAY_MAP[dayKo];
    return schedule.find((s) => s.day === apiDay && s.startSlot === slotIdx) || null;
  };

  const getPending = (dayKo, slotIdx) => {
    const apiDay = DAY_MAP[dayKo];
    return pending.find(
      (p) => p.day === apiDay && slotIdx >= p.startSlot && slotIdx < p.startSlot + p.durationSlots
    ) || null;
  };

  const isInRange = (dayKo, slotIdx) => {
    if (!selected || selected.day !== dayKo) return false;
    return slotIdx >= selected.slotIdx && slotIdx < selected.slotIdx + effectiveDuration;
  };

  const isStart = (dayKo, slotIdx) =>
    selected?.day === dayKo && selected?.slotIdx === slotIdx;

  return (
    <div className="tt_grid_wrap">
      <div className="tt_grid">

        <div className="tt_cell tt_head"></div>
        {DAY_KO.map((dayKo, i) => (
          <div key={dayKo} className="tt_cell tt_head">
            <div>{dayKo}</div>
            <div className="tt_head_date">
              {weekDates[i].getMonth() + 1}/{weekDates[i].getDate()}
            </div>
          </div>
        ))}

        {slots.map((slot, slotIdx) => {
          const isHalf = slot.endsWith(":30");
          return (
            <div key={slot} className="tt_row">
              <div className={`tt_cell tt_time ${isHalf ? "tt_half_time" : ""}`}>
                {!isHalf ? slot : ""}
              </div>
              {DAY_KO.map((dayKo) => {
                const lecture = getLecture(dayKo, slotIdx);
                const lectureStart = isLectureStart(dayKo, slotIdx);
                const pendingSlot = getPending(dayKo, slotIdx);
                const isPendingStart = pending.find(
                  (p) => p.day === DAY_MAP[dayKo] && p.startSlot === slotIdx
                );
                const inRange = isInRange(dayKo, slotIdx);
                const isStartCell = isStart(dayKo, slotIdx);

                return (
                  <div
                    key={dayKo + slot}
                    className={[
                      "tt_cell tt_block",
                      isHalf ? "tt_half_block" : "",
                      lecture ? "tt_lecture" : "",
                      pendingSlot ? "tt_pending" : "",
                      inRange ? (isStartCell ? "tt_selected_start" : "tt_selected") : "",
                    ].join(" ")}
                    onClick={() => onCellClick(dayKo, slotIdx)}
                    title={lecture?.subject || (pendingSlot ? "승인 대기중" : "")}
                  >
                    {lectureStart && (
                      <span className="tt_lecture_label">{lectureStart.subject}</span>
                    )}
                    {isPendingStart && !lecture && (
                      <span className="tt_pending_label">승인 대기</span>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}

      </div>
    </div>
  );
}
