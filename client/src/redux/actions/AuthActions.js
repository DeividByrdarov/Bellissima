export const AUTH_LOGIN = "AUTH_LOGIN"

export const login = token => dispatch => {
  dispatch({ type: AUTH_LOGIN, payload: token })
  localStorage.setItem("token", token)
}
