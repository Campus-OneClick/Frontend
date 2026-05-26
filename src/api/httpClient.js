import axios from "axios";

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

if (!apiBaseUrl) {
  throw new Error("REACT_APP_API_BASE_URL is not set.");
}

const httpClient = axios.create({
  baseURL: apiBaseUrl,
});

export default httpClient;