import { CURRENCIES } from "@/components/currencySelector";

export const getCurrencySymbol = (currency: string) => {
  return CURRENCIES.find(c => c.value === currency)?.symbol || '$';
};

export const formatCurrency = (amount: number, currency: string): string => {
    const symbol = getCurrencySymbol(currency);
    
    // Handle different currency formats
    if (currency === 'JPY') {
        return `${symbol}${Math.round(amount).toLocaleString()}`;
    } else if (currency === 'EUR') {
        return `${amount.toFixed(2).replace('.', ',')} ${symbol}`;
    } else {
        return `${symbol}${amount.toFixed(2)}`;
    }
};