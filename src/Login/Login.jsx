import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import httpClient from "../api/httpClient";
import "./Login.css";

function Login() {
  const [mode, setMode] = useState("login");
  const [inputId, setInputId] = useState("");
  const [inputName, setInputName] = useState("");
  const navigate = useNavigate();

  const handleInputId = (e) => {
    setInputId(e.target.value);
  };

  const handleInputName = (e) => {
    setInputName(e.target.value);
  };

  const resetFields = () => {
    setInputId("");
    setInputName("");
  };

  const onClickLogin = async () => {
    if (inputId.trim() === "") {
      alert("학번을 입력해주세요.");
      return;
    }
    try {
      const res = await httpClient.post("/login", {
        studentId: inputId.trim(),
      });

      if (!res.data.success) {
        alert("학번이 일치하지 않습니다.");
        return;
      }

      const user = res.data.user;
      sessionStorage.setItem("studentId", user.studentId);
      sessionStorage.setItem("name", user.name);
      sessionStorage.setItem("role", user.role || "USER");

      if (user.role === "ADMIN") {
        navigate("/admin");
        return;
      }

      navigate("/");
    } catch (error) {
      console.error(error);
      alert("서버 연결에 실패했습니다.");
    }
  };

  const onClickSignup = async () => {
    if (inputId.trim() === "" || inputName.trim() === "") {
      alert("학번과 이름을 모두 입력해주세요.");
      return;
    }

    try {
      const res = await httpClient.post("/signup", {
        studentId: inputId.trim(),
        name: inputName.trim(),
      });

      if (!res.data.success) {
        alert(res.data.message || "회원가입에 실패했습니다.");
        return;
      }

      alert("회원가입이 완료되었습니다. 바로 로그인됩니다.");
      const user = res.data.user;
      sessionStorage.setItem("studentId", user.studentId);
      sessionStorage.setItem("name", user.name);
      sessionStorage.setItem("role", user.role || "USER");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "서버 연결에 실패했습니다.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <p className="login-label">Engineering College</p>
        <h2>{mode === "login" ? "로그인" : "회원가입"}</h2>

        <input
          type="text"
          className="form-control"
          placeholder="STUDENT ID"
          name="input_id"
          value={inputId}
          onChange={handleInputId}
        />

        {mode === "signup" && (
          <input
            type="text"
            className="form-control"
            placeholder="NAME"
            value={inputName}
            onChange={handleInputName}
          />
        )}

        {mode === "login" ? (
          <button type="button" onClick={onClickLogin}>
            로그인
          </button>
        ) : (
          <button type="button" onClick={onClickSignup}>
            회원가입
          </button>
        )}

        <button
          type="button"
          className="secondary-button"
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            resetFields();
          }}
        >
          {mode === "login" ? "회원가입으로 이동" : "로그인으로 돌아가기"}
        </button>
      </div>
    </div>
  );
}

export default Login;