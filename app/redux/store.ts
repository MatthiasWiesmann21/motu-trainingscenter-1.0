"use client";

import { createStore, applyMiddleware } from "redux";
import { persistStore, persistReducer } from "redux-persist";
//import storage from "redux-persist/lib/storage";
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
import thunk from "redux-thunk";
import reducer from "./reducer";

const createNoopStorage = () => {
  return {
     getItem(_key: any) {
        return Promise.resolve(null);
     },
     setItem(_key: any, value: any) {
        return Promise.resolve(value);
     },
     removeItem(_key: any) {
        return Promise.resolve();
     },
  };
};

const storage = typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage();


const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducer);

export const store = createStore(persistedReducer);
export const persistor = persistStore(store);
