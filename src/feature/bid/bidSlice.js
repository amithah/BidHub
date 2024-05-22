import { createSlice } from "@reduxjs/toolkit";
import useApi from "../../hooks/useApi";

const initialState = {
  bids: [],
  bid: null,
  isLoading: false,
};

const bidSlice = createSlice({
  name: "bid",
  initialState,
  reducers: {
    addBidStart: (state) => {
      state.isLoading = true;
    },
    addBidSuccess: (state, action) => {
      state.isLoading = false;
      state.bid = action.payload.data;
    },
    addBidFailure: (state) => {
      state.isLoading = false;
    },
    listBidsStart: (state) => {
      state.isLoading = true;
    },
    listBidsSuccess: (state, action) => {
      state.isLoading = false;
      state.bids = action.payload.data;
    },
    listBidsFailure: (state) => {
      state.isLoading = false;
    },
    setBid: (state,action) => {
      state.bid = action.payload;
    },
  },
});

export const {
  addBidStart,
  addBidSuccess,
  addBidFailure,
  listBidsStart,
  listBidsSuccess,
  listBidsFailure,
  setBid
} = bidSlice.actions;

export const addBid = (data) => async (dispatch) => {
  const { fetchDataWithHeaders } = useApi();
  try {
    dispatch(addBidStart());
    const bid = await fetchDataWithHeaders("/bid", JSON.stringify(data), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    dispatch(addBidSuccess(bid));
  } catch (err) {
    dispatch(addBidFailure());
    console.log(err);
  }
};

export const listBids = () => async (dispatch) => {
  const { fetchDataWithHeaders } = useApi();
  try {
    dispatch(listBidsStart());
    const bids = await fetchDataWithHeaders("/bid", {
      method: "GET",
    });
    dispatch(listBidsSuccess(bids));
  } catch (err) {
    dispatch(listBidsFailure());
    console.log(err);
  }
};

export default bidSlice.reducer;
