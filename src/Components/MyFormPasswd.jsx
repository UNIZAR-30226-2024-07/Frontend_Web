import React from "react";
import {Input} from "@nextui-org/react";
import { ImEyeBlocked } from "react-icons/im";
import { ImEye } from "react-icons/im";
import "./MyForm.css"


export function MyFormPasswd({placeholderForm, labelText }) {
  
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <div className="max-w-xs my-form-container">
      <Input
          isRequired
          label={<span className="form-input">{labelText}</span>}
          placeholder={placeholderForm}
          labelPlacement="outside"
          endContent={
          <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
            {isVisible ? (
              <ImEyeBlocked className="text-2xl text-default-400 pointer-events-none" />
            ) : (
              <ImEye className="text-2xl text-default-400 pointer-events-none" />
            )}
          </button>
        }
        type={isVisible ? "text" : "password"}
        className="max-w-xs"
      />
    </div>
  );
}

