import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import httpClient from "../api/httpClient";
import "./ClassroomPage.css";

export default function ClassroomPage() {
  const navigate = useNavigate();
  const [classrooms, setClassrooms] = useState([]);

  useEffect(() => {
    const loadClassrooms = async () => {
      try {
        const res = await httpClient.get("/classrooms");
        setClassrooms(res.data || []);
      } catch (error) {
        console.error("강의실 정보를 불러오지 못했습니다.", error);
      }
    };

    loadClassrooms();
  }, []);

  return (
    <div className="classroom-page">
      <div className="classroom-header">
        <button className="back-button" onClick={() => navigate("/")}>← 메인으로</button>
        <div>
          <p className="classroom-label">Engineering College</p>
          <h1>강의실 조회</h1>
        </div>
      </div>

      <div className="classroom-grid">
        {classrooms.length === 0 ? (
          <div className="classroom-empty">등록된 강의실이 없습니다.</div>
        ) : (
          classrooms.map((room) => (
            <div className="classroom-card" key={room.classroomId}>
              <span>{room.classroomId}</span>
              <strong>{room.roomName}</strong>
            </div>
          ))
        )}
      </div>
    </div>
  );
}