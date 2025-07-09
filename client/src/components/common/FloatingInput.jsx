// frontend/src/components/common/FloatingInput.js
import React from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const FloatingInput = ({ id, label, type = 'text', value, onChange, ...props }) => {
  return (
    <div className="relative z-0 w-full group"> {/* Removed mb-6 here to allow parent to control */}
      <Input
        type={type}
        id={id}
        name={id}
        // Updated input classes for better floating label alignment
        className="block w-full text-base text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer pt-3 pb-2 px-0"
        placeholder=" " // Important for floating label effect
        value={value}
        onChange={onChange}
        {...props}
      />
      <Label
        htmlFor={id}
        // Refined label positioning and font-size for better alignment
        className="peer-focus:font-medium absolute text-base text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto left-0"
      >
        {label}
      </Label>
    </div>
  );
};

export default FloatingInput;