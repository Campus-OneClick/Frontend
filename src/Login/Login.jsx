import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import httpClient from "../api/httpClient";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";
import "./Login.css";

function Login() {
  const [mode, setMode] = useState("login");
  const [inputId, setInputId] = useState("");
  const [inputName, setInputName] = useState("");
  const [inputDepartment, setInputDepartment] = useState("");
  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [inputPasswordConfirm, setInputPasswordConfirm] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [emailCheckStatus, setEmailCheckStatus] = useState("idle");
  const [emailCheckMessage, setEmailCheckMessage] = useState("");
  const [passwordMatchMessage, setPasswordMatchMessage] = useState("");
  const navigate = useNavigate();

  const departments = [
    "토목공학과",
    "건축학과",
    "건축공학과",
    "전자공학과",
    "전기공학과",
    "컴퓨터공학과",
    "게임소프트웨어학과",
    "디지펜게임공학과",
    "교통공학과",
    "도시계획학과",
    "생태조경학과",
    "기계공학과",
    "모빌리티소프트웨어학과",
    "자동차공학과",
    "로봇공학과",
    "화학공학과",
    "신소재공학과",
    "산업공학과",
    "의용공학과",
    "환경공학과",
  ];

  const handleInputId = (e) => {
    setAuthMessage("");
    setInputId(e.target.value);
  };

  const handleInputName = (e) => {
    setAuthMessage("");
    setInputName(e.target.value);
  };

  const handleInputDepartment = (e) => {
    setAuthMessage("");
    setInputDepartment(e.target.value);
  };

  const handleInputEmail = (e) => {
    setAuthMessage("");
    setInputEmail(e.target.value);
    setEmailCheckStatus("idle");
    setEmailCheckMessage("");
  };

  const handleInputPassword = (e) => {
    setAuthMessage("");
    const nextPassword = e.target.value;
    setInputPassword(nextPassword);
    updatePasswordMatch(nextPassword, inputPasswordConfirm);
  };

  const handleInputPasswordConfirm = (e) => {
    setAuthMessage("");
    const nextConfirm = e.target.value;
    setInputPasswordConfirm(nextConfirm);
    updatePasswordMatch(inputPassword, nextConfirm);
  };

  const resetFields = () => {
    setInputId("");
    setInputName("");
    setInputDepartment("");
    setInputEmail("");
    setInputPassword("");
    setInputPasswordConfirm("");
    setAuthMessage("");
    setEmailCheckStatus("idle");
    setEmailCheckMessage("");
    setPasswordMatchMessage("");
  };

  const updatePasswordMatch = (password, confirm) => {
    if (confirm.trim() === "") {
      setPasswordMatchMessage("");
      return;
    }

    if (password === confirm) {
      setPasswordMatchMessage("비밀번호가 일치합니다.");
      return;
    }

    setPasswordMatchMessage("비밀번호가 일치하지 않습니다.");
  };

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

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
      const res = await httpClient.get("/users/check-email", {
        params: { email },
      });

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

  const getFirebaseAuthMessage = (error) => {
    const code = error?.code;

    switch (code) {
      case "auth/user-not-found":
        return "없는 이메일입니다.";
      case "auth/wrong-password":
        return "비밀번호가 틀렸습니다.";
      case "auth/invalid-email":
        return "이메일 형식이 올바르지 않습니다.";
      case "auth/email-already-in-use":
        return "이미 사용 중인 이메일입니다.";
      case "auth/weak-password":
        return "비밀번호가 너무 약합니다.";
      case "auth/too-many-requests":
        return "로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.";
      case "auth/network-request-failed":
        return "네트워크 연결을 확인해주세요.";
      case "auth/invalid-credential":
        return mode === "login"
          ? "이메일 또는 비밀번호가 올바르지 않습니다."
          : "입력한 계정 정보를 확인해주세요.";
      default:
        return null;
    }
  };

  const onClickLogin = async () => {
    if (inputEmail.trim() === "" || inputPassword.trim() === "") {
      setAuthMessage("이메일과 비밀번호를 입력해주세요.");
      return;
    }

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
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      if (!res.data.success) {
        await signOut(auth);
        setAuthMessage(res.data.message || "등록된 사용자 정보를 찾지 못했습니다.");
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
      const firebaseMessage = getFirebaseAuthMessage(error);

      if (firebaseMessage) {
        setAuthMessage(firebaseMessage);
        return;
      }

      setAuthMessage(error?.response?.data?.message || error?.message || "로그인에 실패했습니다.");
    }
  };

  const onClickSignup = async () => {
    if (
      inputId.trim() === "" ||
      inputName.trim() === "" ||
      inputDepartment.trim() === "" ||
      inputEmail.trim() === "" ||
      inputPassword.trim() === "" ||
      inputPasswordConfirm.trim() === ""
    ) {
      setAuthMessage("이메일, 비밀번호, 학번, 이름, 학과를 모두 입력해주세요.");
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

    try {
      let credential;

      try {
        credential = await createUserWithEmailAndPassword(
          auth,
          inputEmail.trim(),
          inputPassword
        );
      } catch (createError) {
        if (createError?.code === "auth/email-already-in-use") {
          // Existing Firebase accounts can still be linked to a new DB profile.
          credential = await signInWithEmailAndPassword(
            auth,
            inputEmail.trim(),
            inputPassword
          );
        } else {
          throw createError;
        }
      }

      const idToken = await credential.user.getIdToken();

      const res = await httpClient.post(
        "/signup",
        {
          studentId: inputId.trim(),
          name: inputName.trim(),
          department: inputDepartment.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      if (!res.data.success) {
        if (credential?.operationType === "signIn") {
          await signOut(auth);
        } else {
          try {
            await credential.user.delete();
          } catch (deleteError) {
            console.warn("Firebase 계정 정리 실패", deleteError);
          }
        }
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
      const firebaseMessage = getFirebaseAuthMessage(error);

      if (firebaseMessage) {
        setAuthMessage(firebaseMessage);
        return;
      }

      setAuthMessage(error?.response?.data?.message || error?.message || "로그인 처리에 실패했습니다.");
    }
  };

  const isSignupDisabled =
    !inputId.trim() ||
    !inputName.trim() ||
    !inputDepartment.trim() ||
    !inputEmail.trim() ||
    !inputPassword.trim() ||
    !inputPasswordConfirm.trim() ||
    emailCheckStatus !== "available" ||
    inputPassword !== inputPasswordConfirm;

  return (
    <div className="login-shell">
      <div className="login-ornament login-ornament-left" />
      <div className="login-ornament login-ornament-right" />
      <div className="login-gridline" />

      <div className="login-page">
        <section className="login-intro">
          <div className="hero-pill">좌석과 공간을 한 번에</div>
          <h1>Campus OneClick</h1>
          <p className="intro-lead">복잡한 학교 생활, 보다 간단하게</p>
          <p className="intro-copy">
            강의실 조회부터 열람실 예약까지, 필요한 기능만 깔끔하게 모았습니다.
          </p>

          <div className="intro-footer">
            <span className="mini-dot" />
            <p>지금 바로 시작해보세요.</p>
          </div>
        </section>

        <section className="login-card">
          <div className="card-topline">
            <div>
              <p className="card-kicker">Campus OneClick</p>
              <p className="card-kicker-sub">빠르게 시작하고 바로 이동</p>
            </div>
          </div>

          <div className="mode-switch">
            <button
              type="button"
              className={mode === "login" ? "mode-button active" : "mode-button"}
              onClick={() => {
                setMode("login");
                resetFields();
              }}
            >
              로그인
            </button>
            <button
              type="button"
              className={mode === "signup" ? "mode-button active" : "mode-button"}
              onClick={() => {
                setMode("signup");
                resetFields();
              }}
            >
              회원가입
            </button>
          </div>

          <h2>{mode === "login" ? "로그인" : "회원가입"}</h2>
          <p className="card-desc">
            {mode === "login"
              ? "이메일과 비밀번호를 입력해 로그인하세요."
              : "이메일과 비밀번호, 학번, 이름, 학과를 입력하세요."}
          </p>

          {authMessage ? <p className="auth-message">{authMessage}</p> : null}

          {mode === "login" ? (
            <>
              <label className="field-label">
                이메일
                <input
                  type="email"
                  className="form-control"
                  placeholder=""
                  value={inputEmail}
                  onChange={handleInputEmail}
                  autoComplete="email"
                />
              </label>

              <label className="field-label">
                비밀번호
                <input
                  type="password"
                  className="form-control"
                  placeholder=""
                  value={inputPassword}
                  onChange={handleInputPassword}
                  autoComplete="current-password"
                />
              </label>

              <button type="button" className="primary-button" onClick={onClickLogin}>
                로그인
              </button>
            </>
          ) : (
            <>
              <label className="field-label">
                이메일
                <div className="input-action-row">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="example@example.com"
                    value={inputEmail}
                    onChange={handleInputEmail}
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
                <p
                  className={`field-message ${
                    emailCheckStatus === "available" ? "success" : "error"
                  }`}
                >
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
                  onChange={handleInputPassword}
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
                  onChange={handleInputPasswordConfirm}
                  autoComplete="new-password"
                />
              </label>
              {passwordMatchMessage ? (
                <p
                  className={`field-message ${
                    inputPassword === inputPasswordConfirm ? "success" : "error"
                  }`}
                >
                  {passwordMatchMessage}
                </p>
              ) : null}

              <div className="field-row">
                <label className="field-label">
                  학번
                  <input
                    type="text"
                    className="form-control"
                    placeholder="학번"
                    value={inputId}
                    onChange={handleInputId}
                    autoComplete="username"
                  />
                </label>

                <label className="field-label">
                  이름
                  <input
                    type="text"
                    className="form-control"
                    placeholder="이름"
                    value={inputName}
                    onChange={handleInputName}
                    autoComplete="name"
                  />
                </label>
              </div>

              <label className="field-label">
                학과
                <select
                  className="form-control"
                  value={inputDepartment}
                  onChange={handleInputDepartment}
                  aria-label="학과 선택"
                >
                  <option value="">학과 선택</option>
                  {departments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </label>

              <button
                type="button"
                className="primary-button"
                onClick={onClickSignup}
                disabled={isSignupDisabled}
              >
                회원가입
              </button>
            </>
          )}

          <p className="helper-text">
            {mode === "login"
              ? "로그인 후 메인 화면으로 이동합니다."
              : "회원가입 후 바로 로그인 상태로 연결됩니다."}
          </p>
        </section>
      </div>
    </div>
  );
}

export default Login;