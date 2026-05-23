import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import httpClient from "../api/httpClient";
import "./Mainpage.css";

function MainPage() {
  const navigate = useNavigate();

  const TOTAL_SEATS = 78;

  const [isLogin, setIsLogin] = useState(false);
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [seats, setSeats] = useState(0); //남은 좌석 수

  const isAdmin = role === "ADMIN";

  const occupiedSeats = TOTAL_SEATS - seats;
  const occupiedRate = Math.round((occupiedSeats / TOTAL_SEATS) * 100);

  useEffect(() => {
    const savedName = sessionStorage.getItem("name");
    const savedStudentId = sessionStorage.getItem("studentId");
    const savedRole = sessionStorage.getItem("role");

    if (savedName) {
      setName(savedName);
      setIsLogin(true);
      setRole(savedRole || "USER");
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
          <h1>{isAdmin ? "관리자 페이지" : "학습 공간 예약"}</h1>
        </div>

        {isLogin ? (
          <div className="profile-circle">
            {name ? name.charAt(0) : "?"}
          </div>
        ) : (
          <button className="login-btn" onClick={() => navigate("/login")}>
            로그인
          </button>
        )}
      </header>

      {!isLogin ? (
        <>
          <section className="hero-card">
            <p className="hero-label">Engineering College Study Space</p>

            <h2>
              공부할 자리를
              <br />
              쉽고 조용하게 예약하세요
            </h2>

            <p className="hero-desc">
              도서관 좌석, 빈 강의실, 공부 기록 기능을 하나의 서비스에서
              이용할 수 있습니다.
            </p>

            <button className="main-btn" onClick={() => navigate("/login")}>
              로그인 후 시작하기
            </button>
          </section>

          <section className="status-section">
            <div className="status-card">
              <span>서비스 안내</span>
              <strong>원클릭 예약</strong>
              <p>
                로그인 후 도서관 좌석과 강의실을 쉽게 예약하고, 예약 내역을
                관리할 수 있습니다.
              </p>
            </div>

            <div className="status-card">
              <span>현재 좌석 점유율</span>
              <strong>{occupiedRate}%</strong>
              <p>전체 {TOTAL_SEATS}석 중 {occupiedSeats}석 사용 중</p>
            </div>
          </section>
        </>
      ) : isAdmin ? (
        <>
          <section className="hero-card">
            <p className="hero-label">Admin Mode</p>

            <h2>
              {name ? `${name} 관리자님,` : "관리자님,"}
              <br />
              학습 공간을 관리하세요
            </h2>

            <p className="hero-desc">
              좌석 현황, 강의실 시간표, 예약 요청을 확인하고 관리할 수
              있습니다.
            </p>

            <button className="main-btn" onClick={() => navigate("/admin")}>
              관리자 페이지 이동
            </button>
          </section>

          <section className="status-section">
            <div className="status-card">
              <span>좌석 점유율</span>
              <strong>{occupiedRate}%</strong>
              <p>전체 {TOTAL_SEATS}석 중 {occupiedSeats}석 사용 중</p>
            </div>

            <div className="status-card">
              <span>예약 가능 좌석</span>
              <strong>{seats}석</strong>
              <p>좌석 상태 관리 가능</p>
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
              현재 전체 좌석 중 {occupiedRate}%가 사용 중입니다.
            </p>

            <button className="main-btn" onClick={() => navigate("/floor1")}>
              내 예약 확인하기
            </button>
          </section>

          <section className="status-section">
            <div className="status-card">
              <span>내 예약 상태</span>
              <strong>예약 없음</strong>
              <p>현재 진행 중인 예약이 없습니다.</p>
            </div>

            <div className="status-card">
              <span>예약 가능 좌석</span>
              <strong>{seats}석</strong>
              <p>전체 {TOTAL_SEATS}석 기준</p>
            </div>
          </section>
        </>
      )}

      <section className="menu-section">
        <h3>{isAdmin ? "관리자 기능" : "주요 기능"}</h3>

        <div className="menu-list">
          {isAdmin ? (
            <>
              <div className="menu-item" onClick={() => navigate("/admin")}>
                <div className="icon-box">⚙️</div>
                <div>
                  <h4>관리자 시간표 관리</h4>
                  <p>강의실 시간표를 조회하고 수정합니다.</p>
                </div>
                <span>›</span>
              </div>

              <div className="menu-item" onClick={() => navigate("/admin")}>
                <div className="icon-box">📋</div>
                <div>
                  <h4>예약 요청 관리</h4>
                  <p>학생 예약 요청과 좌석 상태를 관리합니다.</p>
                </div>
                <span>›</span>
              </div>

              <div className="menu-item" onClick={() => navigate("/classrooms")}>
                <div className="icon-box">🏫</div>
                <div>
                  <h4>강의실 현황 관리</h4>
                  <p>사용 가능한 강의실 정보를 확인합니다.</p>
                </div>
                <span>›</span>
              </div>
            </>
          ) : (
            <>
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

            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default MainPage;