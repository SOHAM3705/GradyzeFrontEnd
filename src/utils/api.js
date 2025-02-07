import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000", // Change this when deploying
});

export default API;
