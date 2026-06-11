import "./TimeTable.css";

const DURATION_OPTIONS = [
  { label: "30분",       slots: 2  },
  { label: "1시간",      slots: 4  },
  { label: "1시간 30분", slots: 6  },
  { label: "2시간",      slots: 8  },
  { label: "2시간 30분", slots: 10 },
  { label: "3시간",      slots: 12 },
];

export default function ReservationPanel({
  selected,
  duration,
  setDuration,
  memo,
  setMemo,
  effectiveDuration,
  maxDuration,
  pendingCount,
  maxReservations,
  slots,
  onReserve,
  onCancel,
}) {
  return (
    <div className="tt_panel">
      <div className="tt_panel_info">
        <span className="tt_panel_badge">{selected.day}요일</span>
        <span className="tt_panel_time">
          {slots[selected.slotIdx]} ~ {slots[Math.min(selected.slotIdx + effectiveDuration, slots.length - 1)]}
        </span>
      </div>

      <div className="tt_duration_row">
        {DURATION_OPTIONS.map((d) => (
          <button
            key={d.slots}
            className={`tt_dur_btn ${effectiveDuration === d.slots ? "active" : ""}`}
            onClick={() => setDuration(d.slots)}
            disabled={d.slots > maxDuration}
          >
            {d.label}
          </button>
        ))}
      </div>

      <textarea
        className="tt_memo_input"
        placeholder="사용 사유를 간단히 입력해주세요. (선택)"
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        rows={2}
      />

      {pendingCount >= maxReservations && (
        <p className="tt_limit_msg">
          이번 주 예약 신청 횟수({maxReservations}회)를 모두 사용했습니다.
        </p>
      )}

      <div className="tt_panel_actions">
        <button className="tt_cancel_btn" onClick={onCancel}>취소</button>
        <button
          className="tt_confirm_btn"
          onClick={onReserve}
          disabled={pendingCount >= maxReservations}
        >
          예약하기
        </button>
      </div>
    </div>
  );
}
