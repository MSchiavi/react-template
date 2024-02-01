import { configureStore } from "@reduxjs/toolkit";
import apiReducer from "./slices/apiSlice";
import accountReducer from "./slices/accountSlice";
import themeReducer from "./slices/themeSlice";

// https://github.com/reduxjs/redux-templates/blob/master/packages/cra-template-redux-typescript/template/src/features/counter/counterSlice.ts
export const store = configureStore({
    reducer: {
        api: apiReducer,
        account: accountReducer,
        theme: themeReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
