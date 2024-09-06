import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios"
export const getUser = createAsyncThunk('users/getUser',
   async () => {
    const response = await axios.get("http://localhost:8080/users")
    return response.data;
}
)