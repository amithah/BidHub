import { createSlice } from "@reduxjs/toolkit";
import useApi from "../../hooks/useApi";
import axios from "axios";

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
export const uploadToS3 = async (file, fileName, contentType = "image/*") => {
  try {
   
    const uploadData = {
      action: `putObject`,
      fileName:file.name,
      // ResponseContentType:"image"
    };

    const resp = await axios.post(`${import.meta.env.VITE_REACT_APP_BASE_URL}/upload`, uploadData);
    const s3url = resp.data.data.url;

    if (s3url) {
      const myHeaders = new Headers({
        "Content-Type": contentType,
      });
      await axios.put(s3url, file, { myHeaders });
      return s3url;
    }
  } catch (err) {

    return null;
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
