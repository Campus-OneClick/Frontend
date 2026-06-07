import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import httpClient from "../api/httpClient";
import { getFirebaseAuthMessage } from "./authHelpers";

function RecoveryForm() {
  const [recoveryStudentId, setRecoveryStudentId] = useState("");
  const [recoveryName, setRecoveryName] = useState("");
  const [foundEmail, setFoundEmail] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFindEmail = async () => {
    const studentId = recoveryStudentId.trim();
    const name = recoveryName.trim();

    if (!studentId || !name) {
      setAuthMessage("학번과 이름을 모두 입력해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await httpClient.get("/users/find-email", {
        params: { studentId, name },
      });

      if (!res.data?.success) {
        setFoundEmail("");
        setAuthMessage(res.data?.message || "일치하는 사용자를 찾을 수 없습니다.");
        return;
      }

      setAuthMessage("");
      setFoundEmail(res.data.email);
    } catch (error) {
      console.error(error);
      setFoundEmail("");
      setAuthMessage(error?.response?.data?.message || "이메일 찾기에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendPasswordReset = async () => {
    if (!foundEmail) {
      setAuthMessage("먼저 학번과 이름으로 이메일을 찾아주세요.");
      return;
    }

    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, foundEmail);
      setAuthMessage("비밀번호 재설정 메일을 발송했습니다. 이메일을 확인해주세요.");
    } catch (error) {
      console.error(error);
      setAuthMessage(
        getFirebaseAuthMessage(error) ||
          error?.message ||
          "비밀번호 재설정 메일 발송에 실패했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !foundEmail) handleFindEmail();
  };

  return (
    <>
      {authMessage ? <p className="auth-message">{authMessage}</p> : null}

      <div className="field-row">
        <label className="field-label">
          학번
          <input
            type="text"
            className="form-control"
            value={recoveryStudentId}
            onChange={(e) => { setAuthMessage(""); setFoundEmail(""); setRecoveryStudentId(e.target.value); }}
            onKeyDown={handleKeyDown}
            autoComplete="username"
          />
        </label>

        <label className="field-label">
          이름
          <input
            type="text"
            className="form-control"
            value={recoveryName}
            onChange={(e) => { setAuthMessage(""); setFoundEmail(""); setRecoveryName(e.target.value); }}
            onKeyDown={handleKeyDown}
            autoComplete="name"
          />
        </label>
      </div>

      <button
        type="button"
        className="secondary-button"
        onClick={handleFindEmail}
        disabled={isLoading}
      >
        {isLoading && !foundEmail ? "찾는 중..." : "이메일 찾기"}
      </button>

      {foundEmail ? (
        <div className="recovery-result">
          <span>가입 이메일</span>
          <strong>{foundEmail}</strong>
        </div>
      ) : null}

      <button
        type="button"
        className="primary-button"
        onClick={handleSendPasswordReset}
        disabled={!foundEmail || isLoading}
      >
        비밀번호 재설정 메일 보내기
      </button>
    </>
  );
}

export default RecoveryForm;
