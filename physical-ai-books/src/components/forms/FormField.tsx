import React from 'react';

interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({ 
  id, 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  error, 
  required = false 
}) => {
  return (
    <div className="form-field">
      <label htmlFor={id} className="form-label">
        {label} {required && <span className="required">*</span>}
      </label>
      <input
        id={id}
        type={type}
        className={`form-input ${error ? 'error' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default FormField;