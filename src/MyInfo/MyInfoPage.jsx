import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyInfoPage.css";

function MyInfoPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: "",
    department: "",
    studentId: "",
    email: "",
  });

  useEffect(() => {
    const studentId = sessionStorage.getItem("studentId");

    if (!studentId) {
      navigate("/login");
      return;
    }

    setProfile({
      name: sessionStorage.getItem("name") || "-",
      department: sessionStorage.getItem("department") || "-",
      studentId,
      email: sessionStorage.getItem("email") || "-",
    });
  }, [navigate]);

  return (
    <div className="myinfo-page">
      <header className="myinfo-topbar">
        <div>
          <p className="myinfo-subtitle">Engineering College</p>
          <h1>내정보 보기</h1>
        </div>
        <button type="button" className="myinfo-back-btn" onClick={() => navigate("/")}>
          메인으로
        </button>
      </header>

      <section className="myinfo-card">
        <h2>내 프로필</h2>

        <div className="myinfo-grid">
          <article className="myinfo-item">
            <span>이름</span>
            <strong>{profile.name}</strong>
          </article>

          <article className="myinfo-item">
            <span>학과</span>
            <strong>{profile.department}</strong>
          </article>

          <article className="myinfo-item">
            <span>학번</span>
            <strong>{profile.studentId}</strong>
          </article>

          <article className="myinfo-item">
            <span>이메일</span>
            <strong>{profile.email}</strong>
          </article>
        </div>
      </section>
    </div>
  );
}

export default MyInfoPage;