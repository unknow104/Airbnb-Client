import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { message } from "antd";
import { https } from "../../services/axiosClient";
/** State **/
const initialState = {
  allRoom: [],
  isfetching: false,
};

export const getRoomList = createAsyncThunk("room/list", async () => {
  try {
    const res = await https.get("/api/v1/rooms");
    return res.data;
  } catch (error) {
    message.error(error.response.data.message);
    console.log(error);
  }
});

const listRoomSlice = createSlice({
  name: "room/list",
  initialState,
  reducers: {
    reset: (state) => {
      return {
        ...state,
        allRoom: [],
        isfetching: false,
      };
    },
  },
  extraReducers: (builder) => {
    return builder
      .addCase(getRoomList.pending, (state) => {
        return {
          ...state,
          allRoom: null,
          isfetching: true,
        };
      })
      .addCase(getRoomList.fulfilled, (state, { payload }) => {
        return {
          ...state,
          isfetching: false,
          allRoom: payload,
        };
      });
  },
});

export const { reset } = listRoomSlice.actions;
export default listRoomSlice.reducer;
