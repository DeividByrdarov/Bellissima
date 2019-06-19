import React, { Component } from "react"
import { gql } from "apollo-boost"
import { Query } from "react-apollo"
import TimeSelectStyles from "./TimeSelect.module.scss"
import { zeroInfront } from "../../lib/dateTime"

const GET_HOURS_FOR_DAY = gql`
  query getHoursForDay($duration: Float!, $dayMonth: String!) {
    getHoursForDay(duration: $duration, dayMonth: $dayMonth) {
      hour
      minutes
    }
  }
`

export class TimeSelect extends Component {
  state = {
    selectedTime: undefined,
  }

  renderDateItem = (arr, hourMinute, i) => {
    const formatted = `${zeroInfront(hourMinute.hour)}:${zeroInfront(
      hourMinute.minutes
    )}`
    const optionKey = (
      <option key={formatted} value={formatted}>
        {formatted}
      </option>
    )

    if (i > 0 && hourMinute.hour !== arr[i - 1].hour) {
      return (
        <React.Fragment key={formatted}>
          <option disabled />
          {optionKey}
        </React.Fragment>
      )
    }

    return optionKey
  }

  onChange = e => {
    this.props.onChange(e.target.value)
    this.setState({
      selectedTime: e.target.value,
    })
  }

  render() {
    return (
      <Query
        query={GET_HOURS_FOR_DAY}
        variables={{
          duration: this.props.duration,
          dayMonth: this.props.dayMonth,
        }}
      >
        {({ error, loading, data }) => {
          if (error) {
            console.log(error)
            return <div>Something went wrong...</div>
          }
          if (loading) return <div>loading...</div>
          return (
            <>
              <span
                className={`${TimeSelectStyles["select-wrapper"]} ${
                  TimeSelectStyles["faux-select"]
                }`}
              >
                <select
                  className={`${TimeSelectStyles["faux-select"]}`}
                  value={this.state.selectedTime}
                  onChange={this.onChange}
                  size="1"
                >
                  {data.getHoursForDay.map(
                    this.renderDateItem.bind(null, data.getHoursForDay)
                  )}

                  <option disabled />
                  <option disabled>Край на работното време</option>
                </select>

                <div className={`${TimeSelectStyles["faux-select-rendered"]}`}>
                  {this.state.selectedTime || "Избери час"}
                </div>
              </span>
            </>
          )
        }}
      </Query>
    )
  }
}

export default TimeSelect
