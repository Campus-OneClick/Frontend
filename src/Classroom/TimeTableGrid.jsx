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
  onPendingClick,
  studentId,
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

        {/* ── 헤더 행 (row 1) ── */}
        <div className="tt_cell tt_head" style={{ gridRow: 1, gridColumn: 1 }} />
        {DAY_KO.map((dayKo, i) => (
          <div key={dayKo} className="tt_cell tt_head" style={{ gridRow: 1, gridColumn: i + 2 }}>
            <div>{dayKo}</div>
            <div className="tt_head_date">
              {weekDates[i].getMonth() + 1}/{weekDates[i].getDate()}
            </div>
          </div>
        ))}

        {/* ── 시간 열: 시간당 1셀 (4행 병합) ── */}
        {slots
          .filter(slot => slot.endsWith(":00"))
          .map((slot, hourIdx) => {
            const slotIdx    = hourIdx * 4;           // :00 슬롯의 배열 인덱스
            const gridRow    = slotIdx + 2;           // 헤더가 row 1이므로 +2
            const isLastHour = slotIdx + 4 >= slots.length; // 19:00는 단독
            return (
              <div
                key={"time-" + slot}
                className="tt_cell tt_time tt_time_hour"
                style={{
                  gridRow: `${gridRow} / span ${isLastHour ? 1 : 4}`,
                  gridColumn: 1,
                }}
              >
                {slot}
              </div>
            );
          })}

        {/* ── 요일별 데이터 셀 ── */}
        {slots.flatMap((slot, slotIdx) => {
          const isHour    = slot.endsWith(":00");
          const isHalf    = slot.endsWith(":30");
          const isQuarter = slot.endsWith(":15") || slot.endsWith(":45");
          const gridRow   = slotIdx + 2;

          return DAY_KO.map((dayKo, dayIdx) => {
            const lecture        = getLecture(dayKo, slotIdx);
            const lectureStart   = isLectureStart(dayKo, slotIdx);
            const pendingSlot    = getPending(dayKo, slotIdx);
            const isPendingStart = pending.find(
              (p) => p.day === DAY_MAP[dayKo] && p.startSlot === slotIdx
            );

            const isMyPending      = !!(pendingSlot?.isPending && pendingSlot?.user === studentId);
            const isPendingCont    = !!(pendingSlot && pendingSlot.startSlot !== slotIdx);
            const isPendingLast    = !!(pendingSlot && slotIdx === pendingSlot.startSlot + pendingSlot.durationSlots - 1);
            const isLectureCont    = !!(lecture && !lectureStart);
            const isLectureLast    = !!(lecture && slotIdx === lecture.startSlot + lecture.durationSlots - 1);

            const inRange     = isInRange(dayKo, slotIdx);
            const isStartCell = isStart(dayKo, slotIdx);

            return (
              <div
                key={dayKo + slot}
                className={[
                  "tt_cell tt_block",
                  isHour    ? "tt_hour_block"      : "",
                  isHalf    ? "tt_half_block"      : "",
                  isQuarter ? "tt_quarter_block"   : "",
                  lecture                                                                  ? "tt_lecture"           : "",
                  isLectureCont                                                            ? "tt_lecture_cont"      : "",
                  isLectureLast                                                            ? "tt_lecture_last"      : "",
                  isMyPending                                                              ? "tt_my_pending"        : "",
                  pendingSlot && pendingSlot.isPending && pendingSlot.user !== studentId   ? "tt_others_pending"    : "",
                  pendingSlot && !pendingSlot.isPending                                    ? "tt_approved"          : "",
                  isPendingCont                                                            ? "tt_pending_cont"      : "",
                  isPendingLast                                                            ? "tt_pending_last"      : "",
                  isMyPending && !lecture                                               ? "tt_pending_clickable": "",
                  inRange ? (isStartCell ? "tt_selected_start" : "tt_selected") : "",
                ].join(" ")}
                style={{ gridRow, gridColumn: dayIdx + 2 }}
                onClick={() => {
                  if (isMyPending && !lecture) {
                    onPendingClick && onPendingClick(pendingSlot);
                  } else if (!lecture && !pendingSlot) {
                    onCellClick(dayKo, slotIdx);
                  }
                }}
                title={
                  lecture?.subject ||
                  (pendingSlot?.isPending && pendingSlot.user === studentId
                    ? "클릭하여 예약 취소"
                    : pendingSlot?.isPending
                      ? "다른 사람이 신청한 예약입니다"
                      : pendingSlot
                        ? "예약 완료된 시간입니다"
                        : "")
                }
              >
                {lectureStart && (
                  <span className="tt_lecture_label">{lectureStart.subject}</span>
                )}
                {isPendingStart && !lecture && (
                  <span className="tt_pending_label">
                    {isPendingStart.isPending
                      ? (isPendingStart.user === studentId ? "내 신청" : "승인 대기")
                      : (isPendingStart.user === studentId ? "내 예약" : "예약됨")}
                  </span>
                )}
              </div>
            );
          });
        })}

      </div>
    </div>
  );
}
