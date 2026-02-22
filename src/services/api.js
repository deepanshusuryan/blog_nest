import axios from "axios";

const baseUri=`${process.env.NEXT_PUBLIC_API_URL}/api`

const api=axios.create({
    baseURL: baseUri,
})

export default api;