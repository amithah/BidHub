import { createSlice } from "@reduxjs/toolkit";
import useApi from "../../hooks/useApi";

const initialState = {
  auctions: [],
  auction: null,
  isLoading: false,
};

const auctionSlice = createSlice({
  name: "auction",
  initialState,
  reducers: {
    addAuctionStart: (state) => {
      state.isLoading = true;
    },
    addAuctionSuccess: (state, action) => {
      state.isLoading = false;
      state.auction = action.payload.data;
    },
    addAuctionFailure: (state) => {
      state.isLoading = false;
    },
    listAuctionsStart: (state) => {
      state.isLoading = true;
    },
    listAuctionsSuccess: (state, action) => {
      state.isLoading = false;
      state.auctions = action.payload.data;
    },
    listAuctionsFailure: (state) => {
      state.isLoading = false;
    },
    setAuction: (state,action) => {
      state.auction = action.payload;
    },
  },
});

export const {
  addAuctionStart,
  addAuctionSuccess,
  addAuctionFailure,
  listAuctionsStart,
  listAuctionsSuccess,
  listAuctionsFailure,
  setAuction
} = auctionSlice.actions;

export const addAuction = (data) => async (dispatch) => {
  const { fetchDataWithHeaders } = useApi();
  try {
    dispatch(addAuctionStart());
    const auction = await fetchDataWithHeaders("/auction", JSON.stringify(data), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    dispatch(addAuctionSuccess(auction));
  } catch (err) {
    dispatch(addAuctionFailure());
    console.log(err);
  }
};

export const listAuctions = () => async (dispatch) => {
  const { fetchDataWithHeaders } = useApi();
  try {
    dispatch(listAuctionsStart());
    const auctions = await fetchDataWithHeaders("/auction", {
      method: "GET",
    });
    dispatch(listAuctionsSuccess(auctions));
  } catch (err) {
    dispatch(listAuctionsFailure());
    console.log(err);
  }
};

export default auctionSlice.reducer;
