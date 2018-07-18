import axios from "axios";
import cfg from "../cfg/env";
import { ErrorsUtils } from "../utils";

const axiosInstance = axios.create({
  baseURL: cfg.REACT_APP_API_BASE_URL,
  timeout: 100000
});

const promiseSerial = funcs =>
  funcs.reduce(
    (promise, func) =>
      promise.then(result => func().then(Array.prototype.concat.bind(result))),
    Promise.resolve([])
  );

function uploadFile(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return axiosInstance.post("/uploadHtml", formData, {
    headers: {
      authorization: `Bearer: ${localStorage.getItem("idToken")}`
    }
  });
}

export default {
  uploadFile,
  promiseSerial
};
