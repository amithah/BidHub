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
    setAuction: (state, action) => {
      state.auction = action?.payload;
    },
    fetchAuctionStart: (state) => {
      state.isLoading = true;
    },
    fetchAuctionSuccess: (state, action) => {
      state.isLoading = false;
      state.auction = action.payload.data;
    },
    fetchAuctionFailure: (state) => {
      state.isLoading = false;
    },
    auctionUpdateStart: (state) => {
      state.isLoading = true;
    },
    auctionUpdateSuccess: (state, action) => {
      state.isLoading = false;
      state.auction = action.payload.data;
    },
    auctionUpdateFailure: (state) => {
      state.isLoading = false;
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
  setAuction,
  fetchAuctionStart,
  fetchAuctionSuccess,
  fetchAuctionFailure,
  auctionUpdateStart,
  auctionUpdateSuccess,
  auctionUpdateFailure,
} = auctionSlice.actions;

export const addAuction = (data) => async (dispatch) => {
  const { fetchDataWithHeaders } = useApi();
  try {
    dispatch(addAuctionStart());
    const auction = await fetchDataWithHeaders(
      "/auction",
      JSON.stringify(data),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }
    );
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
export const fetchAuction = (id) => async (dispatch) => {
  const { fetchDataWithHeaders } = useApi();
  try {
    dispatch(fetchAuctionStart());
    const auction = await fetchDataWithHeaders(`/auction/${id}`, {
      method: "GET",
    });
    dispatch(fetchAuctionSuccess(auction));
  } catch (err) {
    dispatch(fetchAuctionFailure());
    console.log(err);
  }
};
export const updateAuction = (id, data) => async (dispatch) => {
  const { fetchDataWithHeaders } = useApi();
  try {
    dispatch(auctionUpdateStart());
    const auction = await fetchDataWithHeaders(`/auction/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    dispatch(auctionUpdateSuccess(auction));
  } catch (err) {
    dispatch(auctionUpdateFailure());
    console.log(err);
  }
};

export default auctionSlice.reducer;
