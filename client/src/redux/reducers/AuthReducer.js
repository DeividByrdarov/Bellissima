import { AUTH_LOGIN } from "../actions/AuthActions"

const initialState = {
  isLoggedIn: false,
  token: "",
}

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTH_LOGIN:
      return {
        isLoggedIn: true,
        token: action.payload,
      }
    default:
      return state
  }
}
