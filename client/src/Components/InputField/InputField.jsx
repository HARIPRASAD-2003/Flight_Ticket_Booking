import React from 'react';
import './InputField.css';
const InputField = ({type, Name, value, onChanges}) => {
  return (
    <div className="form__group field">
      <input type={type} className="form__field" placeholder={Name} value={value} onChange={onChanges}/>
      <label htmlFor={Name} className="form__label">{Name}</label>
    </div>
  );
}

export default InputField;
