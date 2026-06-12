import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import httpClient from "../api/httpClient";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import "./Mainpage.css";
import { CongestionBar } from "../Floor1/CongestionBar";

const LOUNGE_TOTAL = { center: 38, side: 40 };

function MainPage() {
  const navigate = useNavigate();

  const TOTAL_SEATS = 78;

  const [isLogin, setIsLogin] = useState(false);
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [seats, setSeats] = useState(0); //남은 좌석 수
  const [centerSeats, setCenterSeats] = useState([]);
  const [sideSeats, setSideSeats] = useState([]);
  const [mySeat, setMySeat] = useState(null);
  const [myClassroomReservations, setMyClassroomReservations] = useState([]);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);

  const isAdmin = role === "ADMIN";
  const hasReservation = Boolean(mySeat) || myClassroomReservations.length > 0;

  const occupiedSeats = TOTAL_SEATS - seats;
  const occupiedRate = Math.round((occupiedSeats / TOTAL_SEATS) * 100);
  const myLoungeName = mySeat?.lounge === "center" ? "중앙 라운지" : "옆 라운지";

  const formatDateTime = (value) => {
    if (!value) {
      return "-";
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString("ko-KR", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
        const [seatRes, reservationRes] = await Promise.all([
          httpClient.get("/seats", {
            params: savedStudentId ? { studentId: savedStudentId } : undefined,
          }),
          savedStudentId
            ? httpClient.get("/reservations")
            : Promise.resolve({ data: [] }),
        ]);

        setSeats(Number(seatRes.data.availableSeats || 0));
        setCenterSeats(seatRes.data.centerSeats ?? []);
        setSideSeats(seatRes.data.sideSeats ?? []);
        setMySeat(seatRes.data.mySeat || null);
        setMyClassroomReservations(
          reservationRes.data.filter(
            (reservation) =>
              reservation.type === "lecture" &&
              reservation.user === savedStudentId &&
              (reservation.status === 0 || reservation.status === 1)
          )
        );
      } catch (err) {
        console.error("예약 정보를 불러오지 못했습니다.", err);
      }
    };

    loadSeats();
  }, []);

  const handleLogout = async () => {
    try {
      if (sessionStorage.getItem("authProvider") === "firebase") {
        await signOut(auth);
      }
    } catch (err) {
      console.error("Firebase 로그아웃 실패", err);
    } finally {
      sessionStorage.clear();
      setIsLogin(false);
      setRole("");
      setName("");
      setMySeat(null);
      setMyClassroomReservations([]);
      setIsReservationModalOpen(false);
      navigate("/login");
    }
  };

  const handleMyReservationClick = () => {
    if (hasReservation) {
      setIsReservationModalOpen(true);
      return;
    }

    navigate("/floor1");
  };

  const handleMoveToReservedLounge = () => {
    if (!mySeat?.lounge) {
      return;
    }

    setIsReservationModalOpen(false);
    navigate(`/floor1/${mySeat.lounge}`);
  };

  const handleMoveToClassrooms = () => {
    setIsReservationModalOpen(false);
    navigate("/classrooms");
  };

  return (
    <div className="main-page">
      <header className="top-bar">
        <div>
          <p className="sub-title">Engineering College</p>
          <h1>{isAdmin ? "관리자 페이지" : "학습 공간 예약"}</h1>
        </div>

        {isLogin ? (
          <div className="profile-menu-wrap">
            <div className="profile-actions">
              <button
                className="profile-action-btn"
                type="button"
                onClick={() => navigate("/my-info")}
              >
                내정보 보기
              </button>
              <button
                className="profile-action-btn logout"
                type="button"
                onClick={handleLogout}
              >
                로그아웃
              </button>
            </div>
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
              현재 전체 좌석 중 {occupiedRate}%가 사용 중이며, 예약 가능 좌석은 {seats}석입니다.
            </p>

            <button className="main-btn" onClick={handleMyReservationClick}>
              내 예약 확인하기
            </button>
          </section>
        </>
      )}

      {isLogin && (
        <section className="lounge-section">
          <h3>라운지 현황</h3>
          <div className="lounge-cards">
            <CongestionBar total={LOUNGE_TOTAL.center} reserved={centerSeats.length} title="중앙 라운지" />
            <CongestionBar total={LOUNGE_TOTAL.side}   reserved={sideSeats.length}   title="옆 라운지" />
          </div>
        </section>
      )}

      <section className="menu-section">
        <h3>{isAdmin ? "관리자 기능" : "주요 기능"}</h3>

        <div className={isAdmin ? "menu-list admin-menu-list" : "menu-list"}>
          {isAdmin ? (
            <>
              <div className="menu-item" onClick={() => navigate("/admin")}>
                <div className="icon-box">📋</div>
                <div>
                  <h4>예약 요청 관리</h4>
                  <p>학생 예약 요청과 좌석 상태를 관리합니다.</p>
                </div>
                <span>›</span>
              </div>

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

      {isReservationModalOpen && hasReservation && (
        <div
          className="reservation-modal-overlay"
          onClick={() => setIsReservationModalOpen(false)}
        >
          <div
            className="reservation-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="reservation-modal-header">
              <span>내 예약 상태</span>
              <button
                className="reservation-modal-close"
                type="button"
                onClick={() => setIsReservationModalOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="reservation-modal-sections">
              {mySeat && (
                <section className="reservation-modal-section">
                  <strong className="reservation-modal-title">
                    {myLoungeName} {mySeat.seatId}번
                  </strong>

                  <div className="reservation-modal-info">
                    <div>
                      <span>예약 유형</span>
                      <p>라운지 좌석</p>
                    </div>
                    <div>
                      <span>좌석 번호</span>
                      <p>{mySeat.seatId}번</p>
                    </div>
                    <div>
                      <span>시작 시간</span>
                      <p>{formatDateTime(mySeat.startTime)}</p>
                    </div>
                    <div>
                      <span>종료 시간</span>
                      <p>{formatDateTime(mySeat.endTime)}</p>
                    </div>
                  </div>
                </section>
              )}

              {myClassroomReservations.length > 0 && (
                <section className="reservation-modal-section">
                  <strong className="reservation-modal-subtitle">
                    강의실 예약
                  </strong>

                  <div className="classroom-reservation-list">
                    {myClassroomReservations.map((reservation) => (
                      <div
                        className="classroom-reservation-item"
                        key={`${reservation.type}-${reservation.num}`}
                      >
                        <div>
                          <strong>{reservation.lecture}</strong>
                          <p>
                            {reservation.date}({reservation.day}) {reservation.time}
                          </p>
                        </div>
                        <span className={`classroom-reservation-status status-${reservation.status}`}>
                          {reservation.status === 1 ? "승인됨" : "승인 대기"}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <div className="reservation-modal-actions">
              <button
                className="reservation-modal-secondary"
                type="button"
                onClick={() => setIsReservationModalOpen(false)}
              >
                닫기
              </button>
              {mySeat && (
                <button
                  className="reservation-modal-primary"
                  type="button"
                  onClick={handleMoveToReservedLounge}
                >
                  라운지로 이동
                </button>
              )}
              {myClassroomReservations.length > 0 && (
                <button
                  className="reservation-modal-primary classroom"
                  type="button"
                  onClick={handleMoveToClassrooms}
                >
                  강의실 예약 보기
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainPage;
