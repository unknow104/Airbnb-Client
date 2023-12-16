import { https } from "./axiosClient";

export let authService = {

  registerUser: async (values) => {
    const response = await https.post(`/api/v1/auth/register-customer`, values);
    return response.data
  },
  forgotPassword: async (email) => {
    const response = await https.post(`/api/v1/auth/forgot-password`, { email });
    return response.data;
  },
  registerOwner: async (values) => {
    const response = await https.post(`/api/v1/auth/register-owner`, values);
    return response.data
  },
  confirm: async (values) => {
    const response = await https.put(`/api/v1/auth/confirm`, values);
    return response.data
  },
  delete: async (values) => {
    const response = await https.delete(`/api/v1/auth/delete/${values}`);
    return response.data
  },
};
