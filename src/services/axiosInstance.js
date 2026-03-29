import axios from "axios";

const api_base_url="http://localhost:8000/api"

const axiosInstance=axios.create({
    baseURL: api_base_url
})

export default axiosInstance;