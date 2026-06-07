import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BasementMap from "./maps/BasementMap";
import Floor2Map from "./maps/Floor2Map";
import Floor3Map from "./maps/Floor3Map";
import Floor4Map from "./maps/Floor4Map";
import "./ClassroomReservationPage.css";

export default function ClassroomReservationPage() {
  const [floor, setFloor] = useState("B1");
  const navigate = useNavigate();

  const tabs = [
    { key: "B1", label: "지하" },
    { key: "2F", label: "2층" },
    { key: "3F", label: "3층" },
    { key: "4F", label: "4층" },
  ];

  return (
    <div className="cr_container">
      <div className="cr_header">
        <div>
          <h1 className="cr_title">강의실 예약</h1>
          <p className="cr_subtitle">도면에서 강의실을 선택하세요.</p>
        </div>
        <button className="cr_main_btn" onClick={() => navigate("/")}>
          메인으로
        </button>
      </div>

      <div className="cr_tabs">
        {tabs.map((t) => (
          <button
            key={t.key}
            className={`cr_tab ${floor === t.key ? "active" : ""}`}
            onClick={() => setFloor(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="cr_card">
        {floor === "B1" && <BasementMap />}
        {floor === "2F" && <Floor2Map />}
        {floor === "3F" && <Floor3Map />}
        {floor === "4F" && <Floor4Map />}
      </div>
    </div>
  );
}
