import { Metadata } from "next";
import { ToolDescription, ToolNameLists, ToolUrls } from '@/constants/tools';
import { canonicalUrl } from '@/utils/canonicalUrl';
import { CreditCardPaymentCalculator } from "./credit-card-payment-calculator";

export const metadata: Metadata = {
  title: ToolNameLists.CreditCardPaymentCalculator,
  description: ToolDescription[ToolNameLists.CreditCardPaymentCalculator],
  keywords: "credit card payment calculator, debt payoff calculator, credit card debt, interest calculator, minimum payment, payoff time, credit card interest, debt management, financial planning",
  openGraph: {
    title: ToolNameLists.CreditCardPaymentCalculator,
    description: ToolDescription[ToolNameLists.CreditCardPaymentCalculator],
    type: "website",
    url: canonicalUrl(ToolUrls[ToolNameLists.CreditCardPaymentCalculator], true),
  },
  alternates: {
    canonical: canonicalUrl(ToolUrls[ToolNameLists.CreditCardPaymentCalculator]),
  },
};

export default function CreditCardPaymentCalculatorPage() {
  return <CreditCardPaymentCalculator />;
}