import React, { Component } from "react"
import { gql } from "apollo-boost"
import { Mutation } from "react-apollo"
import ProcedureManager from "./ProcedureManager"
import DaySelect from "./DaySelect"
import TimeSelect from "./TimeSelect"
import Input from "../../components/Input/Input"

const CREATE_BOOKING_MUTATION = gql`
  mutation createBooking($start_time: String!, $procedures: [String!]!) {
    createBooking(start_time: $start_time, procedures: $procedures) {
      _id
      start_time
      duration
      procedures {
        _id
        name
        price
        required_time
        slug
        info
      }
    }
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
      value: pr.slug,
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

  render() {
    return (
      <Mutation mutation={CREATE_BOOKING_MUTATION}>
        {createBooking => (
          <form onSubmit={this.createBooking}>
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
            {this.state.time && <Input type="submit" value="Create Booking" />}
          </form>
        )}
      </Mutation>
    )
  }
}

export default Booking
