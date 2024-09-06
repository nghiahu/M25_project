import { getUser } from "@/services/user.service";
import { configureStore, createSlice } from "@reduxjs/toolkit";

const initialState: any[] = [];
const userReducer: any = createSlice({
    name: "users",
    initialState: {
        users: initialState,
        user: {}
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(getUser.fulfilled, (state, action) => {
            state.users = action.payload;
        })
    }
});
export default userReducer.reducer;