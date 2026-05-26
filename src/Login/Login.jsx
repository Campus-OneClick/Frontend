import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import httpClient from "../api/httpClient";
import { app as firebaseApp } from "../firebase";
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

  const firebaseReady = Boolean(firebaseApp);

  const handleInputId = (e) => {
    setInputId(e.target.value);
  };

  const handleInputName = (e) => {
    setInputName(e.target.value);
  };

  const handleInputDepartment = (e) => {
    setInputDepartment(e.target.value);
  };

  const handleInputEmail = (e) => {
    setInputEmail(e.target.value);
  };

  const handleInputPassword = (e) => {
    setInputPassword(e.target.value);
  };

  const resetFields = () => {
    setInputId("");
    setInputName("");
    setInputDepartment("");
    setInputEmail("");
    setInputPassword("");
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
      alert("이메일과 비밀번호를 입력해주세요.");
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
        alert(res.data.message || "등록된 사용자 정보를 찾지 못했습니다.");
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

      if (user.role === "ADMIN") {
        navigate("/admin");
        return;
      }

      navigate("/");
    } catch (error) {
      console.error(error);
      const firebaseMessage = getFirebaseAuthMessage(error);

      if (firebaseMessage) {
        alert(firebaseMessage);
        return;
      }

      alert(error?.response?.data?.message || error?.message || "로그인에 실패했습니다.");
    }
  };

  const onClickSignup = async () => {
    if (
      inputId.trim() === "" ||
      inputName.trim() === "" ||
      inputDepartment.trim() === "" ||
      inputEmail.trim() === "" ||
      inputPassword.trim() === ""
    ) {
      alert("이메일, 비밀번호, 학번, 이름, 학과를 모두 입력해주세요.");
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
        alert(res.data.message || "회원가입에 실패했습니다.");
        return;
      }

      alert("회원가입이 완료되었습니다. 바로 로그인됩니다.");
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
        alert(firebaseMessage);
        return;
      }

      alert(error?.response?.data?.message || error?.message || "로그인 처리에 실패했습니다.");
    }
  };

  return (
    <div className="login-shell">
      <div className="login-ornament login-ornament-left" />
      <div className="login-ornament login-ornament-right" />
      <div className="login-gridline" />

      <div className="login-page">
        <section className="login-intro">
          <div className="hero-pill">Campus Oneclick</div>
          <h1>한 번의 로그인으로 좌석과 강의실을 바로 확인하세요.</h1>
          <p className="intro-copy">
            Firebase Auth로 인증하고, PostgreSQL에는 학번·학과·권한 같은 프로필을
            저장하는 구조입니다. 지금은 실제 서비스 느낌이 나도록 로그인 화면을
            더 또렷하고 깔끔하게 정리했습니다.
          </p>

          <div className="feature-grid">
            <article>
              <strong>Firebase 인증</strong>
              <span>이메일과 비밀번호로 로그인</span>
            </article>
            <article>
              <strong>학사 프로필</strong>
              <span>학번, 이름, 학과를 저장</span>
            </article>
            <article>
              <strong>관리자 구분</strong>
              <span>DB의 role로 /admin 분기</span>
            </article>
          </div>

          <div className="intro-footer">
            <span className="mini-dot" />
            <p>이미 Firebase 초기화와 백엔드 토큰 검증이 연결되어 있습니다.</p>
          </div>
        </section>

        <section className="login-card">
          <div className="card-topline">
            <div className="brand-mark">C</div>
            <div>
              <p className="card-kicker">Secure Access</p>
              <p className="card-kicker-sub">
                {firebaseReady ? "Firebase 연결 준비됨" : "Firebase 연결 대기중"}
              </p>
            </div>
            <span className={firebaseReady ? "status-dot ready" : "status-dot waiting"} />
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

          <h2>{mode === "login" ? "Firebase 로그인" : "학생 계정 만들기"}</h2>
          <p className="card-desc">
            {mode === "login"
              ? "학교 계정으로 로그인하면 백엔드가 토큰을 검증하고 사용자 정보를 불러옵니다."
              : "가입 시 Firebase Auth 계정과 PostgreSQL 프로필을 함께 만듭니다."}
          </p>

          {mode === "login" ? (
            <>
              <label className="field-label">
                이메일
                <input
                  type="email"
                  className="form-control"
                  placeholder="admin@campus-oneclick.com"
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
                  placeholder="비밀번호"
                  value={inputPassword}
                  onChange={handleInputPassword}
                  autoComplete="current-password"
                />
              </label>

              <button type="button" className="primary-button" onClick={onClickLogin}>
                로그인
              </button>

              <button type="button" className="secondary-button" disabled>
                Firebase 로그인은 설정 후 활성화됩니다
              </button>
            </>
          ) : (
            <>
              <label className="field-label">
                이메일
                <input
                  type="email"
                  className="form-control"
                  placeholder="school@email.com"
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
                  placeholder="8자 이상 권장"
                  value={inputPassword}
                  onChange={handleInputPassword}
                  autoComplete="new-password"
                />
              </label>

              <div className="field-row">
                <label className="field-label">
                  학번
                  <input
                    type="text"
                    className="form-control"
                    placeholder="20241234"
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
                    placeholder="홍길동"
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

              <button type="button" className="primary-button" onClick={onClickSignup}>
                회원가입
              </button>
            </>
          )}

          <p className="helper-text">
            {mode === "login"
              ? "로그인 성공 시 관리자 계정은 자동으로 /admin 으로 이동합니다."
              : "입력값은 Firebase Auth와 PostgreSQL에 역할별로 분리되어 저장됩니다."}
          </p>
        </section>
      </div>
    </div>
  );
}

export default Login;