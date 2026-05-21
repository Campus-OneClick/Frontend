import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import httpClient from "../api/httpClient";
import "./Mainpage.css";

function MainPage() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(false);
  const [name, setName] = useState("");
  const [seats, setSeats] = useState(0);

  useEffect(() => {
    const savedName = sessionStorage.getItem("name");
    const savedStudentId = sessionStorage.getItem("studentId");

    if (savedName) {
      setName(savedName);
      setIsLogin(true);
    }

    const loadSeats = async () => {
      try {
        const res = await httpClient.get("/seats", {
          params: savedStudentId ? { studentId: savedStudentId } : undefined,
        });
        setSeats(Number(res.data.availableSeats || 0));
      } catch (err) {
        console.error("좌석 정보를 불러오지 못했습니다.", err);
      }
    };

    loadSeats();
  }, []);

  return (
    <div className="main-page">
      <header className="top-bar">
        <div>
          <p className="sub-title">Engineering College</p>
          <h1>학습 공간 예약</h1>
        </div>

        {isLogin ? (
          <div className="profile-circle">
            {name ? name.charAt(0) : "?"}
          </div>
        ) : (
          <button
            className="login-btn"
            onClick={() => navigate("/login")}
          >
            로그인
          </button>
        )}
      </header>

      {!isLogin ? (
        <>
          <section className="hero-card">
            <p className="hero-label">
              Engineering College Study Space
            </p>

            <h2>
              공부할 자리를
              <br />
              쉽고 조용하게 예약하세요
            </h2>

            <p className="hero-desc">
              도서관 좌석, 빈 강의실, AI 혼잡도 예측,
              공부 기록 기능을 하나의 서비스에서 이용할 수 있습니다.
            </p>

            <button
              className="main-btn"
              onClick={() => navigate("/login")}
            >
              로그인 후 시작하기
            </button>
          </section>

          <section className="status-section">
            <div className="status-card">
              <span>서비스 기능</span>
              <strong>좌석 예약</strong>
              <p>로그인 후 이용 가능</p>
            </div>

            <div className="status-card">
              <span>AI 기능</span>
              <strong>혼잡도 예측</strong>
              <p>시간대별 예상 혼잡도 제공</p>
            </div>
          </section>
        </>
      ) : (
        <>
          <section className="hero-card">
            <p className="hero-label">Welcome Back</p>

            <h2>
              {name ? `${name}님,` : "학생님,"}
              <br />
              오늘도 공부하러 가볼까요?
            </h2>

            <p className="hero-desc">
              현재 도서관 혼잡도는 보통이며,
              오전 시간대 예약을 추천합니다.
            </p>

            <button className="main-btn" onClick={() => navigate("/floor1")}>
              내 예약 확인하기
            </button>
          </section>

          <section className="status-section">
            <div className="status-card">
              <span>도서관 혼잡도</span>
              <strong>보통</strong>
              <p>오후 2시 이후 혼잡 예상</p>
            </div>

            <div className="status-card">
              <span>예약 가능 좌석</span>
              <strong>{seats}석</strong>
              <p>전체 100석 기준</p>
            </div>
          </section>
        </>
      )}

      <section className="menu-section">
        <h3>주요 기능</h3>

        <div className="menu-list">
          <div className="menu-item" onClick={() => navigate("/floor1")}>
            <div className="icon-box">📚</div>
            <div>
              <h4>열람실 좌석 현황</h4>
              <p>좌석 상태를 확인하고 예약합니다.</p>
            </div>
            <span>›</span>
          </div>

          <div className="menu-item" onClick={() => navigate("/classrooms")}>
            <div className="icon-box">🏫</div>
            <div>
              <h4>빈 강의실 조회</h4>
              <p>사용 가능한 강의실을 찾습니다.</p>
            </div>
            <span>›</span>
          </div>

          <div className="menu-item" onClick={() => navigate("/admin")}>
            <div className="icon-box">📝</div>
            <div>
              <h4>공부 시간표</h4>
              <p>예약 시간에 맞춰 공부를 기록합니다.</p>
            </div>
            <span>›</span>
          </div>

          <div className="menu-item" onClick={() => navigate("/admin")}>
            <div className="icon-box">⚙️</div>
            <div>
              <h4>관리자 시간표 관리</h4>
              <p>시간표를 조회하고 수정합니다.</p>
            </div>
            <span>›</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default MainPage;