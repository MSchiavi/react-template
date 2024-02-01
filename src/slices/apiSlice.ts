import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { AxiosError, CancelToken } from "axios";
import ApiService from "../service/service/ApiService";

export interface IApiError {
    error: string;
}

export interface IApiState {
    loading: boolean;
    error?: string;
}

const initialState = {
    loading: false,
    error: undefined,
} as IApiState;

export const apiExample = createAsyncThunk("api/", async (params: any, _thunkApi) => {
    const apiService: ApiService = ApiService.getInstance();
    try {
        const response = await apiService.get(`api/`, params.cancelToken, params.jwt);
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("No error but status wasn't 200");
        }
    } catch (err: any) {
        const error: AxiosError = err;
        throw new Error((error?.response?.data as IApiError).error);
    }
});

export const apiSlice = createSlice({
    name: "api",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(apiExample.pending, (state) => {
                state.loading = true;
            })
            .addCase(apiExample.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(apiExample.rejected, (state, action) => {
                state.loading = false;
            });
    },
});

export const getSomething = (state: RootState): any => state.api.loading;

export const {} = apiSlice.actions;

export default apiSlice.reducer;
