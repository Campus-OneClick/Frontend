import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import httpClient from "../api/httpClient";
import { departments, getFirebaseAuthMessage } from "./authHelpers";

function SignupForm() {
  const [inputId, setInputId] = useState("");
  const [inputName, setInputName] = useState("");
  const [inputDepartment, setInputDepartment] = useState("");
  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [inputPasswordConfirm, setInputPasswordConfirm] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [emailCheckStatus, setEmailCheckStatus] = useState("idle");
  const [emailCheckMessage, setEmailCheckMessage] = useState("");
  const [studentIdCheckStatus, setStudentIdCheckStatus] = useState("idle");
  const [studentIdCheckMessage, setStudentIdCheckMessage] = useState("");
  const [passwordMatchMessage, setPasswordMatchMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const updatePasswordMatch = (password, confirm) => {
    if (!confirm.trim()) { setPasswordMatchMessage(""); return; }
    setPasswordMatchMessage(
      password === confirm ? "비밀번호가 일치합니다." : "비밀번호가 일치하지 않습니다."
    );
  };

  const handleCheckEmail = async () => {
    const email = inputEmail.trim();
    if (!email) {
      setEmailCheckStatus("invalid");
      setEmailCheckMessage("이메일을 입력해주세요.");
      return;
    }
    if (!isValidEmail(email)) {
      setEmailCheckStatus("invalid");
      setEmailCheckMessage("이메일 형식으로 입력해주세요.");
      return;
    }
    try {
      const res = await httpClient.get("/users/check-email", { params: { email } });
      if (!res.data?.success) {
        setEmailCheckStatus("invalid");
        setEmailCheckMessage(res.data?.message || "이메일 확인에 실패했습니다.");
        return;
      }
      if (res.data?.exists) {
        setEmailCheckStatus("taken");
        setEmailCheckMessage("중복되는 이메일이 있습니다.");
        return;
      }
      setEmailCheckStatus("available");
      setEmailCheckMessage("사용 가능한 이메일입니다.");
    } catch (error) {
      console.error(error);
      setEmailCheckStatus("invalid");
      setEmailCheckMessage("이메일 확인에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleCheckStudentId = async () => {
    const studentId = inputId.trim();
    if (!studentId) {
      setStudentIdCheckStatus("invalid");
      setStudentIdCheckMessage("학번을 입력해주세요.");
      return;
    }
    try {
      const res = await httpClient.get("/users/check-student-id", { params: { studentId } });
      if (!res.data?.success) {
        setStudentIdCheckStatus("invalid");
        setStudentIdCheckMessage(res.data?.message || "학번 확인에 실패했습니다.");
        return;
      }
      if (res.data?.exists) {
        setStudentIdCheckStatus("taken");
        setStudentIdCheckMessage("이미 등록된 학번입니다.");
        return;
      }
      setStudentIdCheckStatus("available");
      setStudentIdCheckMessage("사용 가능한 학번입니다.");
    } catch (error) {
      console.error(error);
      setStudentIdCheckStatus("invalid");
      setStudentIdCheckMessage("학번 확인에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleSignup = async () => {
    if (!inputId.trim() || !inputName.trim() || !inputDepartment.trim() ||
        !inputEmail.trim() || !inputPassword.trim() || !inputPasswordConfirm.trim()) {
      setAuthMessage("이메일, 비밀번호, 학번, 이름, 학과를 모두 입력해주세요.");
      return;
    }
    if (studentIdCheckStatus !== "available") {
      setStudentIdCheckStatus("invalid");
      setStudentIdCheckMessage("학번 중복확인을 해주세요.");
      return;
    }
    if (emailCheckStatus !== "available") {
      setEmailCheckStatus("invalid");
      setEmailCheckMessage("이메일 중복확인을 해주세요.");
      return;
    }
    if (inputPassword !== inputPasswordConfirm) {
      setPasswordMatchMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsLoading(true);
    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        inputEmail.trim(),
        inputPassword
      );
      const idToken = await credential.user.getIdToken();

      const res = await httpClient.post(
        "/signup",
        {
          studentId: inputId.trim(),
          name: inputName.trim(),
          department: inputDepartment.trim(),
        },
        { headers: { Authorization: `Bearer ${idToken}` } }
      );

      if (!res.data.success) {
        try { await credential.user.delete(); } catch {}
        setAuthMessage(res.data.message || "회원가입에 실패했습니다.");
        return;
      }

      const user = res.data.user;
      sessionStorage.setItem("studentId", user.studentId);
      sessionStorage.setItem("name", user.name);
      sessionStorage.setItem("email", user.email || inputEmail.trim());
      sessionStorage.setItem("department", user.department || inputDepartment.trim());
      sessionStorage.setItem("firebaseUid", user.firebaseUid || credential.user.uid);
      sessionStorage.setItem("role", user.role || "USER");
      sessionStorage.setItem("authProvider", "firebase");
      navigate("/");
    } catch (error) {
      console.error(error);
      setAuthMessage(
        getFirebaseAuthMessage(error) ||
          error?.response?.data?.message ||
          error?.message ||
          "회원가입 처리에 실패했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const isSignupDisabled =
    !inputId.trim() || !inputName.trim() || !inputDepartment.trim() ||
    !inputEmail.trim() || !inputPassword.trim() || !inputPasswordConfirm.trim() ||
    studentIdCheckStatus !== "available" ||
    emailCheckStatus !== "available" ||
    inputPassword !== inputPasswordConfirm;

  return (
    <>
      {authMessage ? <p className="auth-message">{authMessage}</p> : null}

      <label className="field-label">
        이메일
        <div className="input-action-row">
          <input
            type="email"
            className="form-control"
            placeholder="example@example.com"
            value={inputEmail}
            onChange={(e) => { setAuthMessage(""); setInputEmail(e.target.value); setEmailCheckStatus("idle"); setEmailCheckMessage(""); }}
            autoComplete="email"
          />
          <button
            type="button"
            className="inline-button"
            onClick={handleCheckEmail}
            disabled={!inputEmail.trim()}
          >
            중복확인
          </button>
        </div>
      </label>
      {emailCheckMessage ? (
        <p className={`field-message ${emailCheckStatus === "available" ? "success" : "error"}`}>
          {emailCheckMessage}
        </p>
      ) : null}

      <label className="field-label">
        비밀번호
        <input
          type="password"
          className="form-control"
          placeholder="8자 이상 입력해주세요"
          value={inputPassword}
          onChange={(e) => { setAuthMessage(""); const v = e.target.value; setInputPassword(v); updatePasswordMatch(v, inputPasswordConfirm); }}
          autoComplete="new-password"
        />
      </label>

      <label className="field-label">
        비밀번호 확인
        <input
          type="password"
          className="form-control"
          placeholder="비밀번호를 다시 입력해주세요"
          value={inputPasswordConfirm}
          onChange={(e) => { setAuthMessage(""); const v = e.target.value; setInputPasswordConfirm(v); updatePasswordMatch(inputPassword, v); }}
          autoComplete="new-password"
        />
      </label>
      {passwordMatchMessage ? (
        <p className={`field-message ${inputPassword === inputPasswordConfirm ? "success" : "error"}`}>
          {passwordMatchMessage}
        </p>
      ) : null}

      <label className="field-label">
        학번
        <div className="input-action-row">
          <input
            type="text"
            className="form-control"
            placeholder="학번"
            value={inputId}
            onChange={(e) => { setAuthMessage(""); setInputId(e.target.value); setStudentIdCheckStatus("idle"); setStudentIdCheckMessage(""); }}
            autoComplete="username"
          />
          <button
            type="button"
            className="inline-button"
            onClick={handleCheckStudentId}
            disabled={!inputId.trim()}
          >
            중복확인
          </button>
        </div>
      </label>
      {studentIdCheckMessage ? (
        <p className={`field-message ${studentIdCheckStatus === "available" ? "success" : "error"}`}>
          {studentIdCheckMessage}
        </p>
      ) : null}

      <div className="field-row">
        <label className="field-label">
          이름
          <input
            type="text"
            className="form-control"
            placeholder="이름"
            value={inputName}
            onChange={(e) => { setAuthMessage(""); setInputName(e.target.value); }}
            autoComplete="name"
          />
        </label>

        <label className="field-label">
          학과
          <select
            className="form-control"
            value={inputDepartment}
            onChange={(e) => { setAuthMessage(""); setInputDepartment(e.target.value); }}
            aria-label="학과 선택"
          >
            <option value="">학과 선택</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </label>
      </div>

      <button
        type="button"
        className="primary-button"
        onClick={handleSignup}
        disabled={isSignupDisabled || isLoading}
      >
        {isLoading ? "처리 중..." : "회원가입"}
      </button>
    </>
  );
}

export default SignupForm;
