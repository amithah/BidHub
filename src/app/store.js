import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../feature/auth/authSlice";
import itemReducer from "../feature/item/itemSlice";
import auctionReducer from "../feature/auction/auctionSlice";
import bidReducer from "../feature/bid/bidSlice";



import storage from "redux-persist/lib/storage";
import persistReducer from "redux-persist/es/persistReducer";
import persistStore from "redux-persist/es/persistStore";
const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedReducer,
    items: itemReducer,
    auctions:auctionReducer,
    bids: bidReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  }),
});

export const persistor = persistStore(store);
