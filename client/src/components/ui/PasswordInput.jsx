import React, { useState } from 'react';
import { Input } from './input';
import { Label } from './label';
import { validatePassword, getPasswordStrength } from '../../utils/passwordValidation';

const PasswordInput = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  className = '',
  showValidation = true,
  showStrength = true,
  required = false,
  id,
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const validation = validatePassword(value);
  const strength = getPasswordStrength(value);
  
  const hasErrors = !validation.isValid && value.length > 0;
  
  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={id} className="text-gray-300">
          {label} {required && <span className="text-red-400">*</span>}
        </Label>
      )}
      
      <div className="relative">
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`
            bg-gray-700 border-gray-600 text-gray-100 focus:ring-blue-500 focus:border-blue-500 pr-10
            ${hasErrors ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
          required={required}
          {...props}
        />
        
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
        >
          {showPassword ? '🙈' : '👁️'}
        </button>
      </div>
      
      {/* Password Strength Indicator */}
      {showStrength && value.length > 0 && (
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className={`h-1 w-6 rounded ${strength.color === 'red' ? 'bg-red-500' : 'bg-gray-600'}`}></div>
            <div className={`h-1 w-6 rounded ${strength.color === 'yellow' || strength.color === 'green' ? 'bg-yellow-500' : 'bg-gray-600'}`}></div>
            <div className={`h-1 w-6 rounded ${strength.color === 'green' ? 'bg-green-500' : 'bg-gray-600'}`}></div>
          </div>
          <span className={`text-xs font-medium ${
            strength.color === 'red' ? 'text-red-400' : 
            strength.color === 'yellow' ? 'text-yellow-400' : 'text-green-400'
          }`}>
            {strength.strength.charAt(0).toUpperCase() + strength.strength.slice(1)}
          </span>
        </div>
      )}
      
      {/* Validation Errors */}
      {showValidation && hasErrors && (
        <div className="space-y-1">
          {validation.errors.map((error, index) => (
            <p key={index} className="text-red-400 text-xs flex items-center">
              <span className="mr-1">❌</span>
              {error}
            </p>
          ))}
        </div>
      )}
      
      {/* Requirements (shown when focused and no value) */}
      {showValidation && isFocused && value.length === 0 && (
        <div className="bg-gray-800 border border-gray-600 rounded-md p-3 space-y-1">
          <p className="text-gray-300 text-xs font-medium">Password Requirements:</p>
          <ul className="space-y-1">
            <li className="text-gray-400 text-xs flex items-center">
              <span className="mr-1">•</span>
              At least 8 characters long
            </li>
            <li className="text-gray-400 text-xs flex items-center">
              <span className="mr-1">•</span>
              At least 1 digit (0-9)
            </li>
            <li className="text-gray-400 text-xs flex items-center">
              <span className="mr-1">•</span>
              At least 1 capital letter (A-Z)
            </li>
          </ul>
        </div>
      )}
      
      {/* Success indicator */}
      {showValidation && validation.isValid && value.length > 0 && (
        <p className="text-green-400 text-xs flex items-center">
          <span className="mr-1">✅</span>
          Password meets all requirements
        </p>
      )}
    </div>
  );
};

export default PasswordInput;