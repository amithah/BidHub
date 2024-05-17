import { createSlice } from "@reduxjs/toolkit";
import useApi from "../../hooks/useApi";

const initialState = {
  items: [],
  item: null,
  isLoading: false,
};

const itemSlice = createSlice({
  name: "item",
  initialState,
  reducers: {
    addItemStart: (state) => {
      state.isLoading = true;
    },
    addItemSuccess: (state, action) => {
      state.isLoading = false;
      state.item = action.payload.data;
    },
    addItemFailure: (state) => {
      state.isLoading = false;
    },
    listItemsStart: (state) => {
      state.isLoading = true;
    },
    listItemsSuccess: (state, action) => {
      state.isLoading = false;
      state.items = action.payload.data;
    },
    listItemsFailure: (state) => {
      state.isLoading = false;
    },
    setItem: (state,action) => {
        state.item = action.payload;
      },
  },
});

export const {
  addItemStart,
  addItemSuccess,
  addItemFailure,
  listItemsStart,
  listItemsSuccess,
  listItemsFailure,
  setItem
} = itemSlice.actions;

export const addItem = (data) => async (dispatch) => {
  const { fetchDataWithHeaders } = useApi();
  try {
    dispatch(addItemStart());
    const item = await fetchDataWithHeaders("/item", JSON.stringify(data), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    dispatch(addItemSuccess(item));
  } catch (err) {
    dispatch(addItemFailure());
    console.log(err);
  }
};

export const listItems = () => async (dispatch) => {
  const { fetchDataWithHeaders } = useApi();
  try {
    dispatch(listItemsStart());
    const items = await fetchDataWithHeaders("/item", {
      method: "GET",
    });
    dispatch(listItemsSuccess(items));
  } catch (err) {
    dispatch(listItemsFailure());
    console.log(err);
  }
};

export default itemSlice.reducer;
