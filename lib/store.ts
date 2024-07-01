import { configureStore } from "@reduxjs/toolkit";
import movieReducer from "@/lib/movies/moviesSlice";
import actorsSlice from "@/lib/movies/actorsSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      movies: movieReducer,
      actors: actorsSlice,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
