
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

const axiosBuyer = axios.create({
    baseURL: API_BASE,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

export default axiosBuyer;
