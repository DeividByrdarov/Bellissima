import React, { Component } from "react"
import { Mutation } from "react-apollo"
import { gql } from "apollo-boost"
import { connect } from "react-redux"

import * as AuthActions from "../../redux/actions/AuthActions"
import Input from "../../components/Input/Input"

const LOGIN_MUTATION = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      ok
      token
      msg
    }
  }
`

export class Login extends Component {
  state = {
    email: "",
    password: "",
  }

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  render() {
    return (
      <Mutation mutation={LOGIN_MUTATION}>
        {(login, { data }) => {
          if (data && data.login.ok) {
            this.props.login(data.login.token)
            this.props.history.push("/")
          }
          return (
            <div>
              <Input
                type="email"
                name="email"
                onChange={this.onChange}
                placeholder="Имейл"
                value={this.state.email}
              />
              <Input
                type="password"
                name="password"
                onChange={this.onChange}
                placeholder="Парола"
                value={this.state.password}
              />
              <button
                onClick={() =>
                  login({
                    variables: {
                      email: this.state.email,
                      password: this.state.password,
                    },
                  })
                }
              >
                Влизане
              </button>
            </div>
          )
        }}
      </Mutation>
    )
  }
}

const mapDispatchToProps = {
  login: AuthActions.login,
}

export default connect(
  null,
  mapDispatchToProps
)(Login)
