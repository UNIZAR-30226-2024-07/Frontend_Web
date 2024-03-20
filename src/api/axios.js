import axios from "axios";
import constants from "../constants";

const instance = axios.create({
  baseURL: constants.dirApi + "/api",
  withCredentials: true,
});

export default instance;
