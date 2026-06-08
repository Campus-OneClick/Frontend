import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import httpClient from "../api/httpClient";
import "./TimeTable.css";

const DAY_MAP = { "월": "MON", "화": "TUE", "수": "WED", "목": "THU", "금": "FRI" };
const DAY_KO_TO_EN = { "월": "MON", "화": "TUE", "수": "WED", "목": "THU", "금": "FRI" };

const DURATION_OPTIONS = [
  { label: "1시간",       slots: 2 },
  { label: "1시간 30분",  slots: 3 },
  { label: "2시간",       slots: 4 },
  { label: "2시간 30분",  slots: 5 },
  { label: "3시간",       slots: 6 },
];

// 9:00 ~ 19:00, 30분 단위 (21슬롯)
const SLOTS = [];
for (let h = 9; h <= 19; h++) {
  SLOTS.push(`${h}:00`);
  if (h < 19) SLOTS.push(`${h}:30`);
}

function timeToSlot(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  return (h - 9) * 2 + (m >= 30 ? 1 : 0);
}

export default function TimeTablePage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const days = ["월", "화", "수", "목", "금"];

  const [schedule, setSchedule] = useState([]);
  const [pending, setPending] = useState([]);
  const [selected, setSelected] = useState(null);
  const [duration, setDuration] = useState(2);
  const [memo, setMemo] = useState("");

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
              startSlot,
              durationSlots: endSlot - startSlot,
              subject: r.status === 0 ? "승인 대기" : "승인됨",
            };
          });

        setSchedule(roomSchedules);
        setPending(roomReservations);
      } catch (err) {
        console.error("시간표 로드 실패:", err);
      }
    };

    fetchData();
  }, [roomId]);

  // 해당 슬롯에 대기중 예약이 있는지 확인
  const getPending = (day, slotIdx) => {
    const apiDay = DAY_MAP[day];
    return pending.find(
      (p) => p.day === apiDay &&
             slotIdx >= p.startSlot &&
             slotIdx < p.startSlot + p.durationSlots
    ) || null;
  };

  // 해당 슬롯에 강의가 있는지 확인 → { subject } or null
  const getLecture = (day, slotIdx) => {
    const apiDay = DAY_MAP[day];
    const found = schedule.find(
      (s) => s.day === apiDay &&
             slotIdx >= s.startSlot &&
             slotIdx < s.startSlot + s.durationSlots
    );
    return found || null;
  };

  const isLectureStart = (day, slotIdx) => {
    const apiDay = DAY_MAP[day];
    return schedule.find((s) => s.day === apiDay && s.startSlot === slotIdx) || null;
  };

  const isInRange = (day, slotIdx) => {
    if (!selected || selected.day !== day) return false;
    return slotIdx >= selected.slotIdx && slotIdx < selected.slotIdx + effectiveDuration;
  };

  const isStart = (day, slotIdx) =>
    selected?.day === day && selected?.slotIdx === slotIdx;

  const maxDuration = selected ? SLOTS.length - selected.slotIdx : 6;
  const effectiveDuration = Math.min(duration, maxDuration);

  const handleCellClick = (day, slotIdx) => {
    // 강의 또는 대기중 예약이 있는 슬롯은 클릭 불가
    if (getLecture(day, slotIdx) || getPending(day, slotIdx)) return;

    if (isStart(day, slotIdx)) {
      setSelected(null);
      setMemo("");
    } else {
      setSelected({ day, slotIdx });
      setMemo("");
    }
  };

  const MAX_RESERVATIONS_PER_WEEK = 2;

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

    try {
      await httpClient.post("/classrooms/reserve", {
        roomId, day: apiDay, startTime, endTime, studentId, memo,
      });

      setPending((prev) => [
        ...prev,
        {
          day: apiDay,
          startSlot: selected.slotIdx,
          durationSlots: effectiveDuration,
          subject: "승인 대기",
        },
      ]);
      setSelected(null);
      setMemo("");
      alert(`예약 신청이 완료되었습니다.\n${selected.day}요일 ${startTime} ~ ${endTime}\n\n관리자 승인 후 예약이 확정됩니다.`);
    } catch (err) {
      console.error(err);
      alert("예약 신청에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="tt_container">

      {/* 헤더 */}
      <div className="tt_header">
        <div>
          <h2 className="tt_title">강의실 {roomId}</h2>
          <p className="tt_subtitle">빈 칸을 클릭해 예약 시간을 선택하세요</p>
        </div>
        <button className="tt_back_btn" onClick={() => navigate(-1)}>돌아가기</button>
      </div>

      <div className="tt_legend">
        <span className="tt_legend_item lecture">강의</span>
        <span className="tt_legend_item pending">승인 대기</span>
        <span className="tt_legend_item empty">빈 강의실</span>
      </div>

      {selected && (
        <div className="tt_panel">
          <div className="tt_panel_info">
            <span className="tt_panel_badge">{selected.day}요일</span>
            <span className="tt_panel_time">
              {SLOTS[selected.slotIdx]} ~ {SLOTS[Math.min(selected.slotIdx + effectiveDuration, SLOTS.length - 1)]}
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
          {pending.length >= MAX_RESERVATIONS_PER_WEEK && (
            <p className="tt_limit_msg">이번 주 예약 신청 횟수({MAX_RESERVATIONS_PER_WEEK}회)를 모두 사용했습니다.</p>
          )}
          <div className="tt_panel_actions">
            <button className="tt_cancel_btn" onClick={() => { setSelected(null); setMemo(""); }}>취소</button>
            <button
              className="tt_confirm_btn"
              onClick={handleReserve}
              disabled={pending.length >= MAX_RESERVATIONS_PER_WEEK}
            >
              예약하기
            </button>
          </div>
        </div>
      )}

      <div className="tt_grid_wrap">
        <div className="tt_grid">

          <div className="tt_cell tt_head"></div>
          {days.map((day) => (
            <div key={day} className="tt_cell tt_head">{day}</div>
          ))}

          {SLOTS.map((slot, slotIdx) => {
            const isHalf = slot.endsWith(":30");
            return (
              <div key={slot} className="tt_row">
                <div className={`tt_cell tt_time ${isHalf ? "tt_half_time" : ""}`}>
                  {!isHalf ? slot : ""}
                </div>
                {days.map((day) => {
                  const lecture = getLecture(day, slotIdx);
                  const lectureStart = isLectureStart(day, slotIdx);
                  const pendingSlot = getPending(day, slotIdx);
                  const isPendingStart = pending.find(
                    (p) => p.day === DAY_MAP[day] && p.startSlot === slotIdx
                  );
                  const inRange = isInRange(day, slotIdx);
                  const isStartCell = isStart(day, slotIdx);

                  return (
                    <div
                      key={day + slot}
                      className={[
                        "tt_cell tt_block",
                        isHalf ? "tt_half_block" : "",
                        lecture ? "tt_lecture" : "",
                        pendingSlot ? "tt_pending" : "",
                        inRange ? (isStartCell ? "tt_selected_start" : "tt_selected") : "",
                      ].join(" ")}
                      onClick={() => handleCellClick(day, slotIdx)}
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
    </div>
  );
}
