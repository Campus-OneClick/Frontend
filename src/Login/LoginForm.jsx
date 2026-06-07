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
    </>
  );
}

export default LoginForm;
