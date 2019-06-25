import React, { Component } from "react"
import { gql } from "apollo-boost"
import { Mutation } from "react-apollo"
import moment from "moment"
import ProcedureManager from "./ProcedureManager"
import DaySelect from "./DaySelect"
import TimeSelect from "./TimeSelect"
import Input from "../../components/Input/Input"

const CREATE_BOOKING_MUTATION = gql`
  mutation createBooking(
    $start_time: String!
    $procedures: [ProcedureWithInfoInputType!]!
  ) {
    createBooking(start_time: $start_time, procedures: $procedures)
  }
`

export class Booking extends Component {
  state = {
    procedures: [],
    dayMonth: "",
    time: "",
  }

  mapProcedures = procedures => {
    return procedures.map(pr => ({
      label: pr.name + " - " + pr.price + " лева",
      value: pr._id,
      name: pr.name,
      duration: pr.required_time,
    }))
  }

  onProceduresChange = data => {
    this.setState({
      procedures: data,
    })
  }

  procedureInfoChange = (value, e) => {
    const updated = this.state.procedures.map(pr => {
      if (pr.value === value) {
        pr.info = e.target.value
      }
      return pr
    })
    this.setState({
      procedures: updated,
    })
  }

  onDayMonthChange = data => {
    this.setState({ dayMonth: data })
  }

  onTimeChange = data => {
    this.setState({ time: data })
  }

  getValuesFromProceduresSelect(procedures) {
    return procedures.reduce(
      (acc, pr) => [
        ...acc,
        {
          procedure: pr.value,
          info: pr.info || null,
          image_url: pr.image || null,
        },
      ],
      []
    )
  }

  render() {
    const { dayMonth, time, procedures } = this.state
    return (
      <Mutation mutation={CREATE_BOOKING_MUTATION}>
        {(createBooking, { data }) => {
          if (data && !data.createBooking) {
            return <h2>Something went wrong...</h2>
          }

          return (
            <form
              onSubmit={e => {
                e.preventDefault()
                createBooking({
                  variables: {
                    start_time: `${moment().get("year")}-${
                      dayMonth.value.month
                    }-${dayMonth.value.day} ${time}`,
                    procedures: this.getValuesFromProceduresSelect(procedures),
                  },
                })
              }}
            >
              Booking
              <ProcedureManager
                procedures={this.state.procedures}
                mapProcedures={this.mapProcedures}
                onChange={this.onProceduresChange}
                infoChange={this.procedureInfoChange}
              />
              <br />
              <DaySelect
                dayMonth={this.state.dayMonth}
                onChange={this.onDayMonthChange}
              />
              <br />
              {this.state.dayMonth && (
                <TimeSelect
                  duration={this.state.procedures.reduce(
                    (acc, pr) => acc + pr.duration,
                    0
                  )}
                  dayMonth={this.state.dayMonth.value}
                  onChange={this.onTimeChange}
                />
              )}
              {this.state.time && (
                <Input type="submit" value="Create Booking" />
              )}
            </form>
          )
        }}
      </Mutation>
    )
  }
}

export default Booking
