import React from 'react';

interface Currency {
  value: string;
  label: string;
  symbol: string;
}

const CURRENCIES: Currency[] = [
  { value: 'USD', label: 'USD ($)', symbol: '$' },
  { value: 'EUR', label: 'EUR (€)', symbol: '€' },
  { value: 'GBP', label: 'GBP (£)', symbol: '£' },
  { value: 'JPY', label: 'JPY (¥)', symbol: '¥' },
  { value: 'CAD', label: 'CAD (C$)', symbol: 'C$' },
  { value: 'AUD', label: 'AUD (A$)', symbol: 'A$' },
  { value: 'CHF', label: 'CHF (CHF)', symbol: 'CHF' },
  { value: 'CNY', label: 'CNY (¥)', symbol: '¥' }
];

interface CurrencySelectorProps {
  value: string;
  onChange: (currency: string) => void;
  label?: string;
  helperText?: string;
  className?: string;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  value,
  onChange,
  label = "Currency",
  helperText = "Select your preferred currency",
  className = ""
}) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
      >
        {CURRENCIES.map((currency) => (
          <option key={currency.value} value={currency.value}>
            {currency.label}
          </option>
        ))}
      </select>
      <p className="text-xs text-gray-500 mt-1">{helperText}</p>
    </div>
  );
};

export default CurrencySelector;
export { CURRENCIES };
export type { Currency };