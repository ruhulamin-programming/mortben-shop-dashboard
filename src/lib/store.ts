// import { configureStore } from "@reduxjs/toolkit";
// import counterReducer from "@/lib/features/counterSlice";
// import { baseApi } from "./services/baseApi";

// export const store = configureStore({
//   reducer: {
//     counter: counterReducer,
//     [baseApi.reducerPath]: baseApi.reducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware().concat(baseApi.middleware),
// });

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import counterReducer from "@/lib/features/counterSlice";
import { baseApi } from "./services/baseApi";

// Combine all your reducers
const appReducer = combineReducers({
  counter: counterReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

// Root reducer that resets the state on logout
const rootReducer = (state: any, action: any) => {
  if (action.type === "auth/logout") {
    state = undefined; // This clears the entire Redux state
  }
  return appReducer(state, action);
};

// Create the store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
