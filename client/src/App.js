import React, { Component } from "react"
import ApolloClient, { InMemoryCache } from "apollo-boost"
import { ApolloProvider } from "react-apollo"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"

import store, { persistor } from "./redux/store"
import Login from "./routes/Login"
import Home from "./routes/Home"
import Booking from "./routes/Booking"
import AuthRoute from "./hoc/AuthRoute"

import "./assets/scss/main.scss"

const request = async operation => {
  const token = await localStorage.getItem("token")
  if (!token) return

  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : null,
    },
  })
}

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include",
  },
  request,
  cache: new InMemoryCache(),
})

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <ApolloProvider client={client}>
            <Router>
              <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/login" component={Login} />
                <AuthRoute path="/booking" component={Booking} />
              </Switch>
            </Router>
          </ApolloProvider>
        </PersistGate>
      </Provider>
    )
  }
}

export default App
