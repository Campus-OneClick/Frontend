import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import httpClient from "../api/httpClient";
import { deleteUser, signOut } from "firebase/auth";
import { auth } from "../firebase";
import "./MyInfoPage.css";

function MyInfoPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: "",
    department: "",
    studentId: "",
    email: "",
  });
  const [actionMessage, setActionMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [withdrawEmail, setWithdrawEmail] = useState("");
  const [withdrawMessage, setWithdrawMessage] = useState("");

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

  const clearSessionAndNavigate = async (target = "/login") => {
    try {
      if (sessionStorage.getItem("authProvider") === "firebase") {
        await signOut(auth);
      }
    } catch (err) {
      console.error("Firebase 로그아웃 실패", err);
    } finally {
      sessionStorage.clear();
      navigate(target);
    }
  };

  const handleLogout = async () => {
    await clearSessionAndNavigate("/login");
  };

  const handleWithdraw = () => {
    setWithdrawEmail("");
    setWithdrawMessage("");
    setIsWithdrawOpen(true);
  };

  const handleWithdrawSubmit = async () => {
    if (isProcessing) {
      return;
    }

    const studentId = sessionStorage.getItem("studentId");
    const savedEmail = (sessionStorage.getItem("email") || "").trim();
    const normalizedEmail = withdrawEmail.trim().toLowerCase();
    const normalizedSavedEmail = savedEmail.toLowerCase();

    if (!studentId) {
      await clearSessionAndNavigate("/login");
      return;
    }

    if (!normalizedSavedEmail || normalizedEmail !== normalizedSavedEmail) {
      setWithdrawMessage("이메일이 일치하지 않습니다.");
      return;
    }

    setIsProcessing(true);
    setActionMessage("");
    setWithdrawMessage("");

    let firebaseDeleted = false;

    try {
      if (sessionStorage.getItem("authProvider") === "firebase") {
        if (!auth.currentUser) {
          setActionMessage("Firebase 로그인 정보를 찾을 수 없습니다.");
          return;
        }

        await deleteUser(auth.currentUser);
        firebaseDeleted = true;
      }

      await httpClient.delete(`/users/${studentId}`);

      await clearSessionAndNavigate("/login");
    } catch (err) {
      console.error("회원탈퇴 실패", err);
      const code = err?.code;

      if (code === "auth/requires-recent-login") {
        setActionMessage("보안을 위해 다시 로그인한 뒤 탈퇴를 진행해주세요.");
        return;
      }

      if (firebaseDeleted) {
        setActionMessage("서버 탈퇴 처리에 실패했습니다. 관리자에게 문의해주세요.");
        await clearSessionAndNavigate("/login");
        return;
      }

      setActionMessage("회원탈퇴에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWithdrawClose = () => {
    if (isProcessing) {
      return;
    }

    setIsWithdrawOpen(false);
    setWithdrawEmail("");
    setWithdrawMessage("");
  };

  const savedEmailLabel = profile.email && profile.email !== "-" ? profile.email : "";
  const isWithdrawEnabled =
    savedEmailLabel &&
    withdrawEmail.trim().toLowerCase() === savedEmailLabel.trim().toLowerCase();

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

      <section className="myinfo-actions">
        {actionMessage && <p className="myinfo-message">{actionMessage}</p>}
        <div className="myinfo-actions-row">
          <button
            type="button"
            className="myinfo-action-btn"
            onClick={handleLogout}
            disabled={isProcessing}
          >
            로그아웃
          </button>
          <button
            type="button"
            className="myinfo-action-btn danger"
            onClick={handleWithdraw}
            disabled={isProcessing}
          >
            회원탈퇴
          </button>
        </div>
      </section>

      {isWithdrawOpen && (
        <div className="myinfo-modal-backdrop">
          <div className="myinfo-modal" role="dialog" aria-modal="true">
            <h3>회원탈퇴 확인</h3>
            <p>
              안전을 위해 이메일을 다시 입력해주세요. 입력한 이메일이 일치하면 탈퇴
              버튼이 활성화됩니다.
            </p>
            <div className="myinfo-modal-input">
              <label htmlFor="withdraw-email">이메일</label>
              <input
                id="withdraw-email"
                type="email"
                value={withdrawEmail}
                onChange={(e) => setWithdrawEmail(e.target.value)}
                placeholder={savedEmailLabel || "이메일 정보를 찾을 수 없습니다."}
                disabled={isProcessing}
              />
            </div>
            {withdrawMessage && <p className="myinfo-message">{withdrawMessage}</p>}
            {!savedEmailLabel && (
              <p className="myinfo-message">이메일 정보가 없어 탈퇴를 진행할 수 없습니다.</p>
            )}
            <div className="myinfo-modal-actions">
              <button
                type="button"
                className="myinfo-action-btn ghost"
                onClick={handleWithdrawClose}
                disabled={isProcessing}
              >
                취소
              </button>
              <button
                type="button"
                className="myinfo-action-btn danger"
                onClick={handleWithdrawSubmit}
                disabled={!isWithdrawEnabled || isProcessing}
              >
                회원탈퇴
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyInfoPage;