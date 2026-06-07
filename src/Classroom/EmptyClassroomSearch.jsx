import React, { useState } from "react";
import httpClient from "../api/httpClient";

export default function EmptyClassroomSearch() {
  const [day, setDay] = useState("MON");
  const [time, setTime] = useState("13:00");
  const [rooms, setRooms] = useState([]);

  const search = async () => {
    const res = await httpClient.get(
      `/api/classrooms/empty?day=${day}&time=${time}`
    );
    setRooms(res.data);
  };

  return (
    <div>
      <h3>빈 강의실 조회</h3>

      <select onChange={(e) => setDay(e.target.value)}>
        <option value="MON">월</option>
        <option value="TUE">화</option>
      </select>

      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />

      <button onClick={search}>조회</button>

      <ul>
        {rooms.map((r) => (
          <li key={r.id}>
            {r.id} [{r.status}]
          </li>
        ))}
      </ul>
    </div>
  );
}