import { useState } from "react";

export function useCalendar(today) {
    const [currentMonth, setCurrentMonth] = useState({
        year: today.getFullYear(),
        month: today.getMonth(),
    });
    const [selectedDate, setSelectedDate] = useState(null);

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

    return { currentMonth, selectedDate, setSelectedDate, prevMonth, nextMonth };
}
