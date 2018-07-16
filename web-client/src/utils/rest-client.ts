import axios from "axios";
import config from "../cfg/env";
import { ErrorsUtils } from "../utils";

const axiosInstance = axios.create({
  baseURL: config.REACT_APP_API_BASE_URL,
  timeout: 100000,
  headers: {
    authorization: `Bearer: ${localStorage.getItem("idToken")}`
  }
});

function uploadFile(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return axiosInstance.post("/uploadHtml", formData).then(res => {
    console.log("success");
  });
}

function uploadFiles(files: FileList) {
  return Promise.all(Array.from(files).map(file => uploadFile(file)));
}

export default {
  uploadFiles
};
