import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getUser} from "@/services/user.service";
export const getAllUser:any = createAsyncThunk("users/getAllUser", getUser)
const userReducer = createSlice({
    name:"users",
    initialState:{
        users: [] 
    },
    reducers:{},
    extraReducers : (builder) => {
        builder 
        .addCase(getAllUser.fulfilled,(state,action)=>{
            state.users = action.payload;
        })
    }
})
export default userReducer.reducer;