import { createSlice, Slice } from "@reduxjs/toolkit";
import axios from "axios";
import isEmpty from "lodash.isempty";

export const getProducers = async ({
  skip = undefined,
  count = undefined,
  search = undefined,
}: undefined | { skip?: unknown; count?: unknown; search?: unknown } = {}) => {
  let { data } = await axios("/api/producers/list", {
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
const producersSlice: Slice = createSlice({
  name: "producers",
  initialState: {
    producers: [],
    total: 0,
    status: "idle",
  },
  reducers: {
    clearProducers(state: { producers: any[] }) {
      state.producers = [];
    },
    startLoading(state) {
      state.status = "loading";
    },
    // @ts-ignore
    fulfilled(state, action) {
      state.total = action.payload.total;
      // @ts-ignore
      state.producers.push(action?.payload);
      state.status = "idle";
    },
  },
});
export const { clearProducers, startLoading, fulfilled } =
  producersSlice.actions;
export default producersSlice.reducer;
