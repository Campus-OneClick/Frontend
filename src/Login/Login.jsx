import React, { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import RecoveryForm from "./RecoveryForm";
import "./Login.css";

function Login() {
  const [mode, setMode] = useState("login");

  const changeMode = (nextMode) => setMode(nextMode);

  return (
    <div className="login-shell">
      <div className="login-ornament login-ornament-left" />
      <div className="login-ornament login-ornament-right" />
      <div className="login-gridline" />

      <div className="login-page">
        <section className="login-intro">
          <div className="hero-pill">좌석과 공간을 한 번에</div>
          <h1>Campus OneClick</h1>
          <p className="intro-lead">복잡한 학교 생활, 더 간단하게</p>
          <p className="intro-copy">
            강의실 조회부터 열람실 예약까지 필요한 기능을 한 곳에서 사용할 수 있습니다.
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
              onClick={() => changeMode("login")}
            >
              로그인
            </button>
            <button
              type="button"
              className={mode === "signup" ? "mode-button active" : "mode-button"}
              onClick={() => changeMode("signup")}
            >
              회원가입
            </button>
            <button
              type="button"
              className={mode === "recovery" ? "mode-button active" : "mode-button"}
              onClick={() => changeMode("recovery")}
            >
              계정 찾기
            </button>
          </div>

          <h2>
            {mode === "login" ? "로그인" : mode === "signup" ? "회원가입" : "계정 찾기"}
          </h2>
          <p className="card-desc">
            {mode === "login"
              ? "이메일과 비밀번호를 입력해 로그인하세요."
              : mode === "signup"
                ? "이메일, 비밀번호, 학번, 이름, 학과를 입력하세요."
                : "학번과 이름으로 가입 이메일을 찾고 비밀번호를 재설정할 수 있습니다."}
          </p>

          {mode === "login" && <LoginForm key="login" />}
          {mode === "signup" && <SignupForm key="signup" />}
          {mode === "recovery" && <RecoveryForm key="recovery" />}

          <p className="helper-text">
            {mode === "login"
              ? "회원가입이 필요하면 회원가입 탭으로 이동하세요."
              : mode === "signup"
                ? "이메일과 학번 중복확인을 마치면 회원가입할 수 있습니다."
                : "이메일을 찾은 뒤 비밀번호 재설정 메일을 발송하세요."}
          </p>
        </section>
      </div>
    </div>
  );
}

export default Login;
