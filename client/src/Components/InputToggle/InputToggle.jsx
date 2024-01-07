import React from 'react'
import './InputToggle.css'
const InputToggle = ({toggle, mode}) => {
  return (
    <input type="checkbox" class="theme-checkbox" checked={!mode} onChange={() => toggle()}/>
  )
}

export default InputToggle