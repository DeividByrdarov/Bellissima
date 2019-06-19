import React, { Component } from "react"
import Select from "react-select"
import { gql } from "apollo-boost"
import { Query } from "react-apollo"
import Input from "../../components/Input/Input"

const GET_PROCEDURES = gql`
  {
    getProcedures {
      _id
      name
      price
      required_time
      info
      slug
    }
  }
`

export class ProcedureManager extends Component {
  render() {
    return (
      <Query query={GET_PROCEDURES}>
        {({ loading, error, data }) => {
          if (error) {
            return <div>something went wrong...</div>
          }
          if (loading) {
            return <div>loading...</div>
          }

          return (
            <>
              <Select
                value={this.props.procedures}
                onChange={this.props.onChange}
                options={this.props.mapProcedures(data.getProcedures)}
                placeholder="Изберете процедури"
                isMulti
              />

              {this.props.procedures.map(pr => (
                <div key={pr.value}>
                  <Input
                    type="text"
                    name="info"
                    id={`info-${pr.value}`}
                    placeholder={`Допълнителна информация за ${pr.name}`}
                    onChange={this.props.infoChange.bind(null, pr.value)}
                    value={pr.info}
                  />
                </div>
              ))}
            </>
          )
        }}
      </Query>
    )
  }
}

export default ProcedureManager
