import React, { useState } from 'react';
import { clamp } from '../utils/units';

const Hint: React.FC<{ id: string; text?: string }> = ({ id, text }) =>
  text ? <small id={id} className="hint">{text}</small> : null;

interface NumberFieldProps {
  id: string;
  label: string;
  hint?: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (value: number) => void;
}

// Keeps a local draft while typing so partial input ("", "1.") isn't clamped mid-keystroke
export const NumberField: React.FC<NumberFieldProps> = ({ id, label, hint, value, min, max, step, unit, onChange }) => {
  const [draft, setDraft] = useState<string | null>(null);
  const decimals = (String(step).split('.')[1] ?? '').length;

  const stepBy = (direction: 1 | -1) =>
    onChange(clamp(Number((value + direction * step).toFixed(decimals)), min, max));

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="stepper">
        <button
          type="button"
          className="stepper-btn"
          aria-label={`Decrease ${label.toLowerCase()}`}
          onClick={() => stepBy(-1)}
          disabled={value <= min}
        >
          −
        </button>
        <div className="stepper-input">
          <input
            id={id}
            type="number"
            inputMode={decimals ? 'decimal' : 'numeric'}
            value={draft ?? value.toFixed(decimals)}
            min={min}
            max={max}
            step={step}
            aria-describedby={hint ? `${id}-hint` : undefined}
            onFocus={(e) => e.target.select()}
            onChange={(e) => {
              setDraft(e.target.value);
              const parsed = parseFloat(e.target.value.replace(',', '.'));
              if (!isNaN(parsed) && parsed >= min && parsed <= max)
                onChange(parsed);
            }}
            onBlur={() => setDraft(null)}
          />
          {unit && <span className="unit">{unit}</span>}
        </div>
        <button
          type="button"
          className="stepper-btn"
          aria-label={`Increase ${label.toLowerCase()}`}
          onClick={() => stepBy(1)}
          disabled={value >= max}
        >
          +
        </button>
      </div>
      <Hint id={`${id}-hint`} text={hint} />
    </div>
  );
};

interface SegmentedProps<T extends string> {
  name: string;
  label: string;
  hint?: string;
  options: T[];
  labels?: Partial<Record<T, string>>; // display text, when it differs from the value
  value: T;
  onChange: (value: T) => void;
}

export const Segmented = <T extends string>({ name, label, hint, options, labels, value, onChange }: SegmentedProps<T>) => (
  <fieldset className="field">
    <legend>{label}</legend>
    <div className="segmented">
      {options.map((option) => (
        <label key={option} className={option === value ? 'active' : ''}>
          <input
            type="radio"
            name={name}
            value={option}
            checked={option === value}
            onChange={() => onChange(option)}
          />
          {labels?.[option] ?? option}
        </label>
      ))}
    </div>
    <Hint id={`${name}-hint`} text={hint} />
  </fieldset>
);

interface SelectFieldProps {
  id: string;
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

export const SelectField: React.FC<SelectFieldProps> = ({ id, label, value, options, onChange }) => (
  <div className="field">
    <label htmlFor={id}>{label}</label>
    <div className="select">
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  </div>
);

interface TextFieldProps {
  id: string;
  label: string;
  hint?: string;
  value: string;
  placeholder?: string;
  maxLength?: number;
  onChange: (value: string) => void;
}

export const TextField: React.FC<TextFieldProps> = ({ id, label, hint, value, placeholder, maxLength, onChange }) => (
  <div className="field">
    <label htmlFor={id}>{label}</label>
    <input
      id={id}
      type="text"
      className="text-input"
      value={value}
      placeholder={placeholder}
      maxLength={maxLength}
      autoComplete="off"
      aria-describedby={hint ? `${id}-hint` : undefined}
      onChange={(e) => onChange(e.target.value)}
    />
    <Hint id={`${id}-hint`} text={hint} />
  </div>
);

export const Toggle: React.FC<{ label: string; hint?: string; checked: boolean; onChange: (checked: boolean) => void }> =
  ({ label, hint, checked, onChange }) => (
    <label className="toggle">
      <span className="toggle-text">
        {label}
        {hint && <small>{hint}</small>}
      </span>
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="toggle-track" aria-hidden="true" />
    </label>
  );
