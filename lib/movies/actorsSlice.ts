import { createSlice, Slice } from "@reduxjs/toolkit";
import axios from "axios";
import isEmpty from "lodash.isempty";

export const getActors = async ({
  skip = undefined,
  count = undefined,
  search = undefined,
}: undefined | { skip?: unknown; count?: unknown; search?: unknown } = {}) => {
  let { data } = await axios("/api/actors/list", {
    method: "GET",
    params: {
      skip: Number.isFinite(skip) ? skip : 0,
      count: Number.isFinite(count) ? count : 10,
      ...(!isEmpty(search) ? { search } : {}),
    },
  });
  return data;
};

// @ts-ignore
const actorsSlice: Slice = createSlice({
  name: "actors",
  initialState: {
    actors: [],
    total: 0,
    status: "idle",
  },
  reducers: {
    clearActors(state: { actors: any[] }) {
      state.actors = [];
    },
    startLoading(state) {
      state.status = "loading";
    },
    // @ts-ignore
    fulfilled(state, action) {
      state.total = action.payload.total;
      // @ts-ignore
      state.actors.push(action?.payload);
      state.status = "idle";
    },
  },
});
export const { clearActors, startLoading, fulfilled } = actorsSlice.actions;
export default actorsSlice.reducer;
