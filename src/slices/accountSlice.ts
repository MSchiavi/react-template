import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import ApiService from "../service/service/ApiService";
import { AxiosError, CancelToken } from "axios";
import { IApiError } from "./apiSlice";

export interface IAccountState {
    loggedIn: boolean;
    loginLoading: boolean;
    registerLoading: boolean;
    jwt?: string;
    loginError?: string;
    registerError?: string;
    registerMessage?: string;
    showPopup: boolean;
    darkMode: boolean;
}
const DARK_MODE_STORAGE_KEY = "TEMPLATE_DARK_MODE";

const initialState = {
    loggedIn: false,
    loginLoading: false,
    registerLoading: false,
    jwt: undefined,
    user: undefined,
    loginError: undefined,
    registerError: undefined,
    registerMessage: undefined,
    showPopup: false,
    darkMode: localStorage.getItem(DARK_MODE_STORAGE_KEY) ? localStorage.getItem(DARK_MODE_STORAGE_KEY) === "true" : false,
} as IAccountState;

interface ILoginParams {
    email: string;
    password: string;
    cancelToken: CancelToken;
}

export const login = createAsyncThunk("api/v1/login/", async (params: ILoginParams, _thunkApi) => {
    const apiService: ApiService = ApiService.getInstance();
    try {
        const response = await apiService.post("login/", params.cancelToken, undefined, {
            username: params.email,
            password: params.password,
        });
        if (response.status === 201) {
            return response.data;
        }
    } catch (err: any) {
        const error: AxiosError = err;
        throw new Error((error?.response?.data as IApiError).error);
    }
});

export const register = createAsyncThunk("api/v1/register/", async (params: ILoginParams, _thunkApi) => {
    const apiService: ApiService = ApiService.getInstance();
    try {
        const response = await apiService.post("register/", params.cancelToken, undefined, {
            email: params.email,
            password: params.password,
        });
        if (response.status === 201) {
            return response.data;
        }
    } catch (err: any) {
        const error: AxiosError = err;
        throw new Error((error?.response?.data as IApiError).error);
    }
});

export const logout = createAsyncThunk("api/v1/logout/", async (params: { cancelToken: CancelToken }, _thunkApi) => {
    const apiService: ApiService = ApiService.getInstance();
    try {
        const response = await apiService.get("logout/", params.cancelToken, undefined);
        if (response.status === 200) {
            return response.data;
        }
    } catch (err: any) {
        const error: AxiosError = err;
        throw new Error((error?.response?.data as IApiError).error);
    }
});

export const checkSession = createAsyncThunk("api/v1/session/", async (params: { cancelToken: CancelToken }, _thunkApi) => {
    const apiService: ApiService = ApiService.getInstance();
    try {
        const response = await apiService.get("session/", params.cancelToken, undefined);
        if (response.status === 200) {
            return response.data;
        }
    } catch (err: any) {
        const error: AxiosError = err;
        throw new Error((error?.response?.data as IApiError).error);
    }
});

export const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        setDarkMode: (state: IAccountState, action: PayloadAction<boolean>) => {
            state.darkMode = action.payload;
            localStorage.setItem(DARK_MODE_STORAGE_KEY, state.darkMode.toString());
        },
        clearRegisterMessages: (state: IAccountState, action: PayloadAction<undefined>) => {
            state.registerMessage = undefined;
            state.registerError = undefined;
        },
        clearLoginMessages: (state: IAccountState, action: PayloadAction<undefined>) => {
            state.loginError = undefined;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loginLoading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loginLoading = false;
                state.loggedIn = true;
            })
            .addCase(login.rejected, (state, action) => {
                state.loginLoading = false;
                state.loginError = action.error.message;
            })
            .addCase(checkSession.fulfilled, (state, action) => {
                state.loggedIn = true;
            })
            .addCase(checkSession.rejected, (state, action) => {
                console.error(action.payload);
                state.loggedIn = false;
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.loggedIn = false;
            })
            .addCase(logout.rejected, (state, action) => {
                state.loggedIn = false;
            })
            .addCase(register.pending, (state) => {
                state.registerLoading = true;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.registerMessage = "Registered Successfully";
            })
            .addCase(register.rejected, (state, action) => {
                state.registerError = action.error.message;
            });
    },
});

export const getDarkMode = (state: RootState) => {
    return state.account.darkMode;
};
export const getLoggedIn = (state: RootState): boolean => state.account.loggedIn;
export const getRegisterMessage = (state: RootState): string | undefined => state.account.registerMessage;
export const getRegisterError = (state: RootState): string | undefined => state.account.registerError;
export const getLoginError = (state: RootState): string | undefined => state.account.loginError;

export const { setDarkMode, clearRegisterMessages, clearLoginMessages } = accountSlice.actions;

export default accountSlice.reducer;
