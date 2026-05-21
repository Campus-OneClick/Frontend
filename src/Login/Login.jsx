import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [inputId, setInputId] = useState("");
  const navigate = useNavigate();

  const handleInputId = (e) => {
    setInputId(e.target.value);
  };

  const onClickLogin = () => {
    if (inputId.trim() === "") {
      alert("학번을 입력해주세요.");
      return;
    }
//테스트용
    const fakeUser = {
      studentId: "0000000",
      name: "홍길동",
    };

    if (inputId.trim() !== fakeUser.studentId) {
      alert("학번이 일치하지 않습니다.");
      return;
    }

    sessionStorage.setItem("studentId", fakeUser.studentId);
    sessionStorage.setItem("name", fakeUser.name);

    navigate("/");
  };

  /*
  // 실제 백엔드 로그인 API 연결 예정
  const onClickLogin = () => {
    if (inputId.trim() === "") {
      alert("학번을 입력해주세요.");
      return;
    }

    axios
      .post("http://127.0.0.1:8080/login", {
        studentId: inputId,
      })
      .then((res) => {
        if (res.data.success) {
          const user = res.data.user;

          sessionStorage.setItem("studentId", user.studentId);
          sessionStorage.setItem("name", user.name);

          navigate("/");
        } else {
          alert("학번이 일치하지 않습니다.");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("서버 연결에 실패했습니다.");
      });
  };
  */

  return (
    <div className="login-page">
      <div className="login-card">
        <p className="login-label">Engineering College</p>
        <h2>로그인</h2>

        <input
          type="text"
          className="form-control"
          placeholder="STUDENT ID"
          name="input_id"
          value={inputId}
          onChange={handleInputId}
        />

        <button type="button" onClick={onClickLogin}>
          확인
        </button>
      </div>
    </div>
  );
}

export default Login;