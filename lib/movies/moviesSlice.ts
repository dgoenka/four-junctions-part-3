import { createSlice, Slice } from "@reduxjs/toolkit";
import axios from "axios";

export const getMovies = async ({
  skip = undefined,
  count = undefined,
}: undefined | { skip?: unknown; count?: unknown } = {}) => {
  let { data } = await axios("/api/movies/list", {
    method: "GET",
    params: {
      skip: Number.isFinite(skip) ? skip : 0,
      count: Number.isFinite(count) ? count : 10,
    },
    headers: { "Content-Type": "application/json" },
  });
  return data;
};

// @ts-ignore
const moviesSlice: Slice = createSlice({
  name: "movies",
  initialState: {
    movies: [],
    total: 0,
    status: "idle",
  },
  reducers: {
    clearMovies(state: { movies: any[] }) {
      state.movies = [];
    },
    startLoading(state) {
      state.status = "loading";
    },
    // @ts-ignore
    fulfilled(state, action) {
      state.total = action.payload.total;
      // @ts-ignore
      state.movies.push(action?.payload);
      state.status = "idle";
    },
  },
});
export const { clearMovies, startLoading, fulfilled } = moviesSlice.actions;
export default moviesSlice.reducer;
