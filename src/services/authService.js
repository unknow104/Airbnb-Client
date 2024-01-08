import { https } from "./axiosClient";

export let authService = {
  registerUser: async (values) => {
    const response = await https.post(`/api/v1/auth/register-customer`, values);
    return response.data;
  },
  sendOTPForPasswordReset: async (email) => {
    const response = await https.post(`/api/v1/auth/send-otp-for-password-reset`, { email });
    return response.data;
  },
  verifyOTPForPasswordReset: async (email, otpCode) => {
    const requestBody = {
      email,
      otpCode,
    };
    const response = await https.post(`/api/v1/auth/verify-otp-for-password-reset`, requestBody);
    return response.data;
  },
  resetPasswordWithOTP: async (email, otpCode, newPassword) => {
    const requestBody = {
      email,
      otpCode,
      newPassword,
    };
    const response = await https.post(`/api/v1/auth/reset-password-with-otp`, requestBody);
    return response.data;
  },
  registerOwner: async (values) => {
    const response = await https.post(`/api/v1/auth/register-owner`, values);
    return response.data;
  },
  confirm: async (values) => {
    const response = await https.put(`/api/v1/auth/confirm`, values);
    return response.data;
  },
  delete: async (email) => {
    const response = await https.delete(`/api/v1/auth/delete/${email}`);
    return response.data;
  },
};
