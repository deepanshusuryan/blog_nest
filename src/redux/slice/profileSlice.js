import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/services/axiosInstance";

export const updateProfile = createAsyncThunk(
    "profile/updateProfile",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.patch("/user/profile", formData);
            return response.data.user;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to update profile");
        }
    }
);

const profileSlice = createSlice({
    name: "profile",
    initialState: {
        data: null,
        loading: false,
        updating: false,
        error: null,
    },
    reducers: {
        clearProfile: (state) => {
            state.data = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateProfile.pending, (state) => {
                state.updating = true;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.updating = false;
                state.data = action.payload;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.updating = false;
                state.error = action.payload;
            });
    },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;