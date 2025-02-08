import axios from "axios";

const API = axios.create({
    baseURL: "https://gradyzebackend.onrender.com"
});

export default API;
