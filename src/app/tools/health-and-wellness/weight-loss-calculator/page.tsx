import { WeightLossCalculator } from './weight-loss-calculator';

export const metadata = {
    title: 'Weight Loss Percentage Calculator',
    description: 'Track your weight loss progress, calculate BMI changes, and get personalized insights.',
};

export default function WeightLossCalculatorPage() {
  return <WeightLossCalculator />;
}