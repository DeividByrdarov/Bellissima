import React from "react"
import InputStyles from "./Input.module.scss"

const Input = ({ type, name, id, onChange, placeholder, value, className }) => {
  return (
    <input
      className={`${InputStyles["bel-input"]} ${className ? className : ""}`}
      name={name}
      id={id}
      onChange={onChange}
      placeholder={placeholder}
      value={value}
      type={type}
    />
  )
}

export default Input
