export const DAY_MAP = { "월": "MON", "화": "TUE", "수": "WED", "목": "THU", "금": "FRI" };
export const DAY_KO_TO_EN = { "월": "MON", "화": "TUE", "수": "WED", "목": "THU", "금": "FRI" };
export const MAX_RESERVATIONS_PER_WEEK = 2;

export const SLOTS = [];
for (let h = 9; h <= 19; h++) {
    SLOTS.push(`${h}:00`);
    if (h < 19) {
        SLOTS.push(`${h}:15`);
        SLOTS.push(`${h}:30`);
        SLOTS.push(`${h}:45`);
    }
}

// 타임슬롯 시작, 끝의 슬롯 칸 만들기
export function timeToSlot(timeStr) {
    const [h, m] = timeStr.split(":").map(Number);
    return (h - 9) * 4 + Math.floor(m / 15);
}

// 선택한 날짜의 주 보여주기
export function getWeekDates(date) {
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
