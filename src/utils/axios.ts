import axios from "axios";

export const axiosBase = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
})