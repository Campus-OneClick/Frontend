export const departments = [
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

export function getFirebaseAuthMessage(error, mode) {
  switch (error?.code) {
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
}
