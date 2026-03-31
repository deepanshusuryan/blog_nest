import axiosInstance from "./axiosInstance";

export const loginWithEmailPassword = async (email, password) => {
  try {
    const response = await axiosInstance.post("/user/login", { email, password });
    return response.data;
  } catch (error) {
    return error.response?.data;
  }
};

export const loginWithOtp = async (mobile, otp) => {
  const response = await axiosInstance.post("user/login-otp", { mobile, otp });
  return response.data;
};

export const loginWithOAuth = async (provider, token) => {
  const response = await axiosInstance.post("/login-oauth", { provider, token });
  return response.data;
};

export const logoutService = async () => {
  try {
    const response = await axiosInstance.post("/user/logout");
    return response.data;
  } catch (error) {
    return error.response?.data;
  }
};