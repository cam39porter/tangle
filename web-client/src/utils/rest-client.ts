import axios from "axios";
import config from "../cfg/env";

const axiosInstance = axios.create({
  baseURL: config.REACT_APP_API_BASE_URL,
  timeout: 100000,
  headers: {
    authorization: `Bearer: ${localStorage.getItem("idToken")}`,
    "Content-Type": "multipart/form-data"
  }
});

export function uploadFile(data: FormData) {
  axiosInstance
    .post("/uploadHtml", data)
    .then(response => {
      console.log("success");
    })
    .catch(error => {
      console.error(error);
    });
}
