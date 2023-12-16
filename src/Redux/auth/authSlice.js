import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { message } from 'antd';
import { https } from '../../services/axiosClient';
import { localStorageService } from '../../services/localStorageService';
import { openNotificationIcon } from '../../Components/NotificationIcon/NotificationIcon'
const initialState = {
  accessToken: null,
  isLoggedIn: !!localStorageService.get('USER'),
  registerSuccess: false,
  isRegisterAccountSuccess: false,
};

//LOGIN
export const loginUser = createAsyncThunk('auth/loginUser', async (user, thunkAPI) => {
  try {
    const res = await https.post(`/api/v1/auth/login`, user);
    localStorageService.set('accessToken', res.data.token);
    localStorageService.set('USER', res.data);
    openNotificationIcon('success', 'Thành công', 'Đăng nhập thành công!');
    console.log(res)
    return res.data;
  } catch (error) {
    if (error.response && error.response.status === 403) {
      message.error('Từ chối truy cập');
    } else if (error.response && error.response.status === 401) {
      message.error('Có lỗi khi xác thực người dùng');
    } else {
      message.error('Đăng nhập thất bại');
    }
    return thunkAPI.rejectWithValue(error.response.data);
  }
});
//FORGOT PASSWORD
export const forgotPassword = createAsyncThunk('auth/forgotPassword', async (email, thunkAPI) => {
  try {
    const res = await https.post('/api/v1/auth/forgot-password', { email });
    // Xử lý phản hồi thành công (nếu cần)
    return res.data;
  } catch (error) {
    // Xử lý lỗi
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

//LOGOUT
export const logoutUser = createAsyncThunk('auth/logoutUser', async (user, thunkAPI) => {
  try {
    localStorageService.remove('USER')
    localStorageService.remove('accessToken')
    openNotificationIcon('success', 'Thành công', 'Đăng xuất thành công!');
    return user;
  } catch (error) {
    openNotificationIcon('erorr', 'Lỗi', 'Đăng xuất bị lỗi!');
  }
});
export const registerUser = createAsyncThunk('auth/registerUser', async (infor, thunkAPI) => {
  try {
    const res = await https.post('/api/v1/auth/register-customer', infor);
    message.success('Đăng kí thành công');
    return res.data;
  } catch (error) {
    message.error('Đăng nhập thất bại');
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

//REGISTER

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      return {
        ...state,
        isLoading: false,
      };
    },
  },
  extraReducers: (builder) => {
    return builder
      .addCase(loginUser.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        return {
          ...state,
          isLoading: false,
          accessToken: payload.token,
          isLoggedIn: !!payload,
        };
      })
      .addCase(loginUser.rejected, (state, { payload }) => {
        return {
          ...state,
          isLoading: false,
          accessToken: payload.token,
          isLoggedIn: false,
        };
      })
      .addCase(logoutUser.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(logoutUser.fulfilled, (state, { payload }) => {
        return {
          ...state,
          isLoading: false,
          isLoggedIn: false,
        };
      })
      .addCase(registerUser.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(registerUser.fulfilled, (state, { payload }) => {
        return {
          ...state,
          isLoading: false,
          registerSuccess: true,
        };
      })
      .addCase(registerUser.rejected, (state, { payload }) => {
        return {
          ...state,
          isLoading: false,
          registerSuccess: false,
          isRegisterAccountSuccess: true,
        };
      })
      .addCase(forgotPassword.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(forgotPassword.fulfilled, (state, { payload }) => {
        // Xử lý phản hồi thành công (nếu cần)
        return {
          ...state,
          isLoading: false,
          forgotPasswordSuccess: true,
          // Cập nhật trạng thái hoặc dispatch các action cần thiết
        };
      })
      .addCase(forgotPassword.rejected, (state, { payload }) => {
        // Xử lý phản hồi thất bại
        return {
          ...state,
          isLoading: false,
          forgotPasswordSuccess: false,
          // Cập nhật trạng thái hoặc dispatch các action cần thiết
        };
      });

  },
});
// Action creators are generated for each case reducer function
export const { reset } = authSlice.actions;

export default authSlice.reducer;
