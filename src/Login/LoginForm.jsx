import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase";
import httpClient from "../api/httpClient";
import { getFirebaseAuthMessage } from "./authHelpers";

function LoginForm() {
  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rejectedItems, setRejectedItems] = useState([]);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!inputEmail.trim() || !inputPassword.trim()) {
      setAuthMessage("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        inputEmail.trim(),
        inputPassword
      );
      const idToken = await credential.user.getIdToken();

      const res = await httpClient.post(
        "/login",
        {},
        { headers: { Authorization: `Bearer ${idToken}` } }
      );

      if (!res.data.success) {
        await signOut(auth);
        setAuthMessage(res.data.message || "등록된 사용자 정보를 찾을 수 없습니다.");
        return;
      }

      const user = res.data.user;
      sessionStorage.setItem("studentId", user.studentId);
      sessionStorage.setItem("name", user.name);
      sessionStorage.setItem("email", user.email || inputEmail.trim());
      sessionStorage.setItem("department", user.department || "");
      sessionStorage.setItem("firebaseUid", user.firebaseUid || credential.user.uid);
      sessionStorage.setItem("role", user.role || "USER");
      sessionStorage.setItem("authProvider", "firebase");

      // 거절된 예약 확인 (처음 보는 것만)
      try {
        const seenKey = `seenRejections_${user.studentId}`;
        const seenIds = JSON.parse(localStorage.getItem(seenKey) || "[]");
        const rejRes = await httpClient.get(`/reservations/rejected/${user.studentId}`);
        const unseen = rejRes.data.filter(r => !seenIds.includes(r.id));
        if (unseen.length > 0) {
          localStorage.setItem(seenKey, JSON.stringify([...seenIds, ...unseen.map(r => r.id)]));
          setRejectedItems(unseen);
          return; // 팝업 표시, 아직 이동 안 함
        }
      } catch (_) {
        // 알림 조회 실패는 무시하고 정상 이동
      }

      navigate("/");
    } catch (error) {
      console.error(error);
      setAuthMessage(
        getFirebaseAuthMessage(error, "login") ||
          error?.response?.data?.message ||
          error?.message ||
          "로그인에 실패했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  if (rejectedItems.length > 0) {
    return (
      <div style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999
      }}>
        <div style={{
          background: "#fff", borderRadius: "16px", padding: "32px",
          width: "440px", maxWidth: "90vw", boxShadow: "0 12px 40px rgba(0,0,0,0.2)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <span style={{ fontSize: "22px" }}>🔔</span>
            <h3 style={{ margin: 0, fontSize: "18px" }}>예약 거절 알림</h3>
          </div>
          <p style={{ color: "#666", fontSize: "14px", marginBottom: "20px" }}>
            다음 강의실 예약 신청이 거절되었습니다.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
            {rejectedItems.map(r => (
              <div key={r.id} style={{
                background: "#fff5f5", border: "1px solid #fed7d7",
                borderRadius: "10px", padding: "14px"
              }}>
                <div style={{ fontWeight: "600", marginBottom: "4px" }}>
                  {r.lecture} &nbsp;<span style={{ color: "#888", fontWeight: 400, fontSize: "13px" }}>({r.day} {r.time})</span>
                </div>
                <div style={{ fontSize: "14px", color: "#c53030" }}>
                  거절 사유: {r.rejectionReason || "사유 없음"}
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => { setRejectedItems([]); navigate("/"); }}
            style={{
              width: "100%", padding: "12px", borderRadius: "10px",
              border: "none", background: "#3182ce", color: "#fff",
              fontSize: "15px", fontWeight: "600", cursor: "pointer"
            }}
          >
            확인
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {authMessage ? <p className="auth-message">{authMessage}</p> : null}

      <label className="field-label">
        이메일
        <input
          type="email"
          className="form-control"
          value={inputEmail}
          onChange={(e) => { setAuthMessage(""); setInputEmail(e.target.value); }}
          onKeyDown={handleKeyDown}
          autoComplete="email"
        />
      </label>

      <label className="field-label">
        비밀번호
        <input
          type="password"
          className="form-control"
          value={inputPassword}
          onChange={(e) => { setAuthMessage(""); setInputPassword(e.target.value); }}
          onKeyDown={handleKeyDown}
          autoComplete="current-password"
        />
      </label>

      <button
        type="button"
        className="primary-button"
        onClick={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? "로그인 중..." : "로그인"}
      </button>

      <button
        type="button"
        className="secondary-button"
        onClick={() => navigate("/")}
      >
        메인으로
      </button>
    </>
  );
}

export default LoginForm;
