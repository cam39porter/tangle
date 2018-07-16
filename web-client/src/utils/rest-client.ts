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
  axiosInstance
    .post("/uploadHtml", formData)
    .then(res => {
      console.log("success");
    })
    .catch(error => {
      ErrorsUtils.errorHandler.report(error.message, error.stack);
    });
}

function uploadFiles(files: FileList) {
  Array.from(files).forEach(file => {
    uploadFile(file);
  });
}

export default {
  uploadFiles
};
