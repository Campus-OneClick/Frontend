import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8080", // 백엔드 주소로 변경
});