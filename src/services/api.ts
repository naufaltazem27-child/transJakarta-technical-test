import axios from "axios";

const API_BASE_URL = "https://api-v3.mbta.com/";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/vnd.api+json",
  },
});
