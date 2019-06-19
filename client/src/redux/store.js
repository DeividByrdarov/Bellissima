import { createStore, compose, applyMiddleware } from "redux"
import { persistStore, persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"
import thunk from "redux-thunk"

import rootReducer from "./reducers"

const pReducer = persistReducer(
  {
    key: "root",
    storage,
    whitelist: ["auth"],
  },
  rootReducer
)
let enhancers = [applyMiddleware(thunk)]

if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
  const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__
  if (typeof devToolsExtension === "function") {
    enhancers.push(devToolsExtension())
  }
}

const store = createStore(pReducer, {}, compose(...enhancers))
export const persistor = persistStore(store)

export default store
