import { useState } from "react";
import Icon from "./Icon";

const AuthInput = ({ name, label, type = "text", value, onChange, half = false }) => {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && visible ? "text" : type;

  return (
    <div className={`field ${half ? "field-half" : ""}`}>
      <label htmlFor={name}>{label}</label>
      <div className="input-wrap">
        <input id={name} name={name} type={inputType} value={value} onChange={onChange} required />
        {isPassword && (
          <button type="button" className="icon-button" onClick={() => setVisible((current) => !current)} aria-label={visible ? "Hide password" : "Show password"}>
            <Icon name={visible ? "eyeOff" : "eye"} />
          </button>
        )}
      </div>
    </div>
  );
};

export default AuthInput;
