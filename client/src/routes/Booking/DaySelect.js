import React, { Component } from "react"
import { Query } from "react-apollo"
import { gql } from "apollo-boost"
import Select from "react-select"

const GET_AVAILABLE_DATES = gql`
  {
    getAvailableDays {
      available_dates {
        day
        month
        weekday
      }
      start_work_day
      end_work_day
    }
  }
`

export class DaySelect extends Component {
  mapDays = data => {
    return data.map(dm => {
      const day = dm.day < 10 ? "0" + dm.day : dm.day
      const month = dm.month < 10 ? "0" + dm.month : dm.month
      return {
        label: `${dm.weekday} ${day}.${month}`,
        value: {
          day,
          month,
        },
      }
    })
  }

  render() {
    return (
      <Query query={GET_AVAILABLE_DATES}>
        {({ loading, error, data }) => {
          if (error) {
            return <div>something went wrong...</div>
          }
          if (loading) {
            return <div>loading...</div>
          }

          return (
            <div>
              <Select
                value={this.props.dayMonth}
                onChange={this.props.onChange}
                options={this.mapDays(data.getAvailableDays.available_dates)}
                placeholder="Избери ден"
              />
            </div>
          )
        }}
      </Query>
    )
  }
}

export default DaySelect
