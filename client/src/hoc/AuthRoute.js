import React, { Component } from "react"
import { connect } from "react-redux"
import { Route, withRouter } from "react-router-dom"
import { getAuth } from "../redux/selectors"

export class AuthRoute extends Component {
  componentWillMount() {
    if (!this.props.token) {
      this.props.history.replace("/login")
    }
  }

  render() {
    return <Route {...this.props} />
  }
}

const mapStateToProps = state => ({
  token: getAuth(state).token,
})

export default withRouter(connect(mapStateToProps)(AuthRoute))
