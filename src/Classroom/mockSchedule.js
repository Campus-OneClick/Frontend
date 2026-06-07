// mockSchedule.js
// 슬롯 인덱스 기준: 0=9:00, 1=9:30, 2=10:00, 3=10:30, ...
// 나중에 이 함수만 API 호출로 교체하면 됩니다.

const MOCK_SCHEDULE = {
  "B101": [
    { day: "MON", startSlot: 2,  durationSlots: 4, subject: "운영체제" },
    { day: "WED", startSlot: 2,  durationSlots: 4, subject: "운영체제" },
    { day: "FRI", startSlot: 8,  durationSlots: 2, subject: "실험" },
  ],
  "B102": [
    { day: "TUE", startSlot: 4,  durationSlots: 3, subject: "자료구조" },
    { day: "THU", startSlot: 4,  durationSlots: 3, subject: "자료구조" },
    { day: "MON", startSlot: 10, durationSlots: 2, subject: "알고리즘" },
  ],
  "B103": [
    { day: "MON", startSlot: 0,  durationSlots: 4, subject: "컴퓨터네트워크" },
    { day: "WED", startSlot: 0,  durationSlots: 4, subject: "컴퓨터네트워크" },
  ],
  "201호": [
    { day: "TUE", startSlot: 2,  durationSlots: 4, subject: "데이터베이스" },
    { day: "THU", startSlot: 2,  durationSlots: 4, subject: "데이터베이스" },
    { day: "MON", startSlot: 6,  durationSlots: 2, subject: "세미나" },
  ],
  "202호": [
    { day: "MON", startSlot: 4,  durationSlots: 3, subject: "소프트웨어공학" },
    { day: "WED", startSlot: 4,  durationSlots: 3, subject: "소프트웨어공학" },
  ],
};

/**
 * 강의실 시간표 조회
 * TODO: 아래 주석을 해제하고 mock 데이터를 지우면 실제 DB 연동으로 교체됩니다.
 *
 * import httpClient from "../api/httpClient";
 * export async function fetchRoomSchedule(roomId) {
 *   const res = await httpClient.get(`/classrooms/${roomId}/schedule`);
 *   return res.data;
 * }
 */
export async function fetchRoomSchedule(roomId) {
  // mock delay (실제 API 호출처럼 보이도록)
  await new Promise((r) => setTimeout(r, 100));
  return MOCK_SCHEDULE[roomId] || [];
}
